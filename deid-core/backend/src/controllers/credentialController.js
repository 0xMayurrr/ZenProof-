const crypto = require('crypto');
const Credential = require('../models/Credential');
const User = require('../models/User');
const Issuer = require('../models/Issuer');
const ipfsService = require('../services/ipfsService');
const blockchainService = require('../services/blockchainService');
const aiFraudService = require('../services/aiFraudService');

// @desc    Issue a new credential
// @route   POST /credentials/issue
// @access  Private (Issuer Only)
exports.issueCredential = async (req, res, next) => {
    try {
        const { title, description, category, expiryDate } = req.body;
        let recipientWallet = req.body.recipientWallet;

        if (!recipientWallet) {
            return res.status(400).json({ success: false, error: 'Recipient wallet or DID is required' });
        }

        // Normalize DID to wallet address if necessary
        if (recipientWallet.toLowerCase().startsWith('did:ethr:')) {
            const parts = recipientWallet.split(':');
            recipientWallet = parts[parts.length - 1]; // get the last part which is the hex address
        }

        // Validate wallet format
        if (!/^0x[a-fA-F0-9]{40}$/.test(recipientWallet)) {
            return res.status(400).json({ success: false, error: 'Invalid recipient wallet address format' });
        }

        // Verify role
        if (req.user.role !== 'issuer') {
            return res.status(403).json({ success: false, error: 'Only authorized issuers can issue credentials' });
        }

        // Verify issuer status
        const isAuthorizedOnChain = await blockchainService.checkIssuer(req.user.walletAddress);
        if (!isAuthorizedOnChain) {
            return res.status(403).json({ success: false, error: 'Issuer is not authorized on blockchain' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a document file' });
        }

        // AI OCR / Fraud Detection Check
        const aiCheck = await aiFraudService.validateDocument(req.file.buffer, req.file.mimetype, recipientWallet);
        if (!aiCheck.isValid) {
            return res.status(400).json({
                success: false,
                error: `Fraud Detection Failed. Confidence Score: ${aiCheck.confidence.toFixed(2)}. AI thinks this document might be invalid or forged.`
            });
        }

        // 1. Upload to IPFS
        const ipfsCID = await ipfsService.uploadToIPFS(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        // 2. Generate Hash
        const hashContent = `${req.user.walletAddress}-${recipientWallet}-${ipfsCID}-${Date.now()}`;
        const credentialHash = '0x' + crypto.createHash('sha256').update(hashContent).digest('hex');

        // 3. Optional: find recipient user id if registered
        const recipientUser = await User.findOne({ walletAddress: recipientWallet.toLowerCase() });
        const recipientId = recipientUser ? recipientUser._id : null;

        // 4. Issue On-Chain
        const blockchainRes = await blockchainService.issueCredential(
            recipientWallet,
            ipfsCID,
            credentialHash
        );

        // 5. Save to MongoDB
        const credential = await Credential.create({
            issuerId: req.user._id,
            recipientWallet: recipientWallet.toLowerCase(),
            recipientId: recipientId,
            title,
            description,
            category: category || 'other',
            ipfsCID,
            credentialHash,
            blockchainTxHash: blockchainRes.txHash,
            expiryDate: expiryDate ? new Date(expiryDate) : null
        });

        res.status(201).json({
            success: true,
            data: credential
        });

    } catch (error) {
        console.error('Issue Credential Error:', error);
        next(error);
    }
};

// @desc    Revoke a credential
// @route   PUT /credentials/revoke/:id
// @access  Private (Issuer Only)
exports.revokeCredential = async (req, res, next) => {
    try {
        const credential = await Credential.findById(req.params.id);

        if (!credential) {
            return res.status(404).json({ success: false, error: 'Credential not found' });
        }

        // Must be the issuer
        if (credential.issuerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized to revoke this credential' });
        }

        // Revoke On-Chain
        await blockchainService.revokeCredential(credential.credentialHash);

        // Update DB
        credential.revoked = true;
        await credential.save();

        res.status(200).json({
            success: true,
            data: credential
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's credentials (recipient view)
// @route   GET /credentials
// @access  Private
exports.getMyCredentials = async (req, res, next) => {
    try {
        const credentials = await Credential.find({
            recipientWallet: req.user.walletAddress.toLowerCase(),
            revoked: false
        }).populate({
            path: 'issuerId',
            select: 'name organizationName walletAddress'
        });

        res.status(200).json({
            success: true,
            count: credentials.length,
            data: credentials
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get credentials issued by the user (issuer view)
// @route   GET /credentials/issued
// @access  Private (Issuer Only)
exports.getIssuedCredentials = async (req, res, next) => {
    try {
        if (req.user.role !== 'issuer') {
            return res.status(403).json({ success: false, error: 'Only issuers can view issued credentials' });
        }

        const credentials = await Credential.find({
            issuerId: req.user._id
        }).populate({
            path: 'recipientId',
            select: 'name email'
        }).sort('-issuedAt');

        res.status(200).json({
            success: true,
            count: credentials.length,
            data: credentials
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single credential by ID
// @route   GET /credentials/:id
// @access  Private
exports.getCredentialById = async (req, res, next) => {
    try {
        const credential = await Credential.findById(req.params.id)
            .populate('issuerId', 'name organizationName walletAddress')
            .populate('recipientId', 'name email');

        if (!credential) {
            return res.status(404).json({ success: false, error: 'Credential not found' });
        }

        // Safeguard for deleted users (null references in DB)
        const issuerId = credential.issuerId ? (credential.issuerId._id || credential.issuerId).toString() : null;
        const recipientWallet = credential.recipientWallet ? credential.recipientWallet.toLowerCase() : null;
        const userWallet = req.user.walletAddress ? req.user.walletAddress.toLowerCase() : null;

        // Must be the issuer or the recipient to view this detailed data
        if (
            issuerId !== req.user._id.toString() &&
            recipientWallet !== userWallet
        ) {
            return res.status(403).json({ success: false, error: 'Not authorized to access this credential' });
        }

        res.status(200).json({
            success: true,
            data: credential
        });
    } catch (error) {
        next(error);
    }
};
