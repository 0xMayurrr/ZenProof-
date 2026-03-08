const crypto = require('crypto');
const ethers = require('ethers');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });
};

// @desc    Signup with Email
// @route   POST /auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, error: 'Please provide email and password' });

        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) return res.status(400).json({ success: false, error: 'User already exists' });

        const nonce = crypto.randomBytes(16).toString('hex');
        const walletAddress = '0x' + crypto.randomBytes(20).toString('hex'); // mock wallet for email users

        const normalizedRole = role === 'individual' ? 'user' : role;

        user = await User.create({
            email: email.toLowerCase(),
            name,
            role: normalizedRole || 'user',
            walletAddress,
            did: `did:ethr:sepolia:${walletAddress}`,
            nonce: `DeID Auth Nonce: ${nonce}`
        });

        const token = generateToken(user._id);
        res.status(201).json({ success: true, token, user: { id: user._id, email: user.email, name: user.name, role: user.role, walletAddress: user.walletAddress, did: user.did } });
    } catch (error) {
        next(error);
    }
};

// @desc    Login with Email
// @route   POST /auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, error: 'Please provide email and password' });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

        const token = generateToken(user._id);
        res.status(200).json({ success: true, token, user: { id: user._id, email: user.email, name: user.name, role: user.role, walletAddress: user.walletAddress, did: user.did } });
    } catch (error) {
        next(error);
    }
};

// @desc    Get nonce for wallet signature
// @route   POST /auth/nonce
// @access  Public
exports.getNonce = async (req, res, next) => {
    try {
        const { walletAddress, role } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ success: false, error: 'Please provide a wallet address' });
        }

        const formattedAddress = walletAddress.toLowerCase();
        let user = await User.findOne({ walletAddress: formattedAddress });

        const nonce = crypto.randomBytes(16).toString('hex');
        const nonceMessage = `DeID Auth Nonce: ${nonce}`;

        if (!user) {
            const normalizedRole = role === 'individual' ? 'user' : role;
            // Register new user
            user = await User.create({
                walletAddress: formattedAddress,
                role: normalizedRole || 'user',
                did: `did:ethr:sepolia:${formattedAddress}`,
                nonce: nonceMessage
            });
        } else {
            user.nonce = nonceMessage;
            if (!user.did) {
                user.did = `did:ethr:sepolia:${formattedAddress}`;
            }
            if (role && role !== 'individual' && role !== 'user') {
                user.role = role; // Upgrade role if they signed up as issuer now
            }
            await user.save();
        }

        res.status(200).json({
            success: true,
            nonce: nonceMessage
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify wallet signature and login
// @route   POST /auth/verify
// @access  Public
exports.verifySignature = async (req, res, next) => {
    try {
        const { walletAddress, signature } = req.body;

        if (!walletAddress || !signature) {
            return res.status(400).json({ success: false, error: 'Please provide wallet address and signature' });
        }

        const formattedAddress = walletAddress.toLowerCase();
        const user = await User.findOne({ walletAddress: formattedAddress });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User unauthenticated' });
        }

        // Verify the signature
        const recoveredAddress = ethers.verifyMessage(user.nonce, signature);

        if (recoveredAddress.toLowerCase() !== formattedAddress) {
            return res.status(401).json({ success: false, error: 'Signature verification failed' });
        }

        // Rotate nonce for security
        user.nonce = `DeID Auth Nonce: ${crypto.randomBytes(16).toString('hex')}`;
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                role: user.role,
                did: user.did
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /auth/me
// @access  Private
exports.updateMe = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            organizationName: req.body.organizationName,
            website: req.body.website,
            description: req.body.description
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
