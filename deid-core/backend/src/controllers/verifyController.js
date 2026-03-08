const Credential = require('../models/Credential');
const User = require('../models/User');
const blockchainService = require('../services/blockchainService');

// @desc    Verify a credential by hash
// @route   GET /verify/:credentialHash
// @access  Public
exports.verifyCredentialObj = async (req, res, next) => {
    try {
        const { credentialHash } = req.params;

        // 1. Get from Blockchain
        const bcResult = await blockchainService.verifyCredential(credentialHash);

        if (!bcResult.isValid) {
            return res.status(404).json({
                success: false,
                authenticity: 'INVALID',
                message: 'Credential does not exist or has been revoked on the blockchain'
            });
        }

        // 2. Fetch Metadata from DB
        const credential = await Credential.findOne({ credentialHash })
            .populate('issuerId', 'name organizationName walletAddress')
            .populate('recipientId', 'name did');

        if (!credential) {
            return res.status(404).json({
                success: false,
                authenticity: 'INVALID',
                message: 'Credential metadata not found in database'
            });
        }

        // Return combined format
        res.status(200).json({
            success: true,
            authenticity: bcResult.isRevoked ? 'REVOKED' : 'VALID',
            blockchainData: {
                issuer: bcResult.issuer,
                recipient: bcResult.recipient,
                ipfsCID: bcResult.ipfsCID,
                issuedAt: new Date(Number(bcResult.issuedAt) * 1000).toISOString(),
                isRevoked: bcResult.isRevoked
            },
            metadata: {
                title: credential.title,
                description: credential.description,
                expiryDate: credential.expiryDate,
                issuerConfig: credential.issuerId,
                recipientConfig: credential.recipientId
            }
        });

    } catch (error) {
        next(error);
    }
};
