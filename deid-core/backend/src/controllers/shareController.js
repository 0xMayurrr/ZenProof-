const crypto = require('crypto');
const ShareLink = require('../models/ShareLink');
const Credential = require('../models/Credential');

exports.createShare = async (req, res, next) => {
    try {
        const { credentialId, expiresInDays } = req.body;

        const credential = await Credential.findById(credentialId);
        if (!credential) {
            return res.status(404).json({ success: false, error: 'Credential not found' });
        }

        if (credential.recipientWallet.toLowerCase() !== req.user.walletAddress.toLowerCase()) {
            return res.status(403).json({ success: false, error: 'Not authorized to share this credential' });
        }

        const token = crypto.randomBytes(16).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (parseInt(expiresInDays) || 30));

        const share = await ShareLink.create({
            credentialId,
            userId: req.user._id,
            token,
            expiresAt
        });

        res.status(201).json({ success: true, data: share });
    } catch (error) {
        next(error);
    }
};

exports.getShares = async (req, res, next) => {
    try {
        const shares = await ShareLink.find({ userId: req.user._id })
            .populate('credentialId')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: shares
        });
    } catch (error) {
        next(error);
    }
};

exports.revokeShare = async (req, res, next) => {
    try {
        const share = await ShareLink.findById(req.params.id);

        if (!share) {
            return res.status(404).json({ success: false, error: 'Share link not found' });
        }

        if (share.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized to revoke this share' });
        }

        await share.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

exports.accessShare = async (req, res, next) => {
    try {
        const share = await ShareLink.findOne({ token: req.params.token })
            .populate({
                path: 'credentialId',
                populate: { path: 'issuerId', select: 'name did' }
            });

        if (!share || share.expiresAt < new Date()) {
            return res.status(404).json({ success: false, error: 'Share link is invalid or has expired' });
        }

        if (share.credentialId.revoked) {
            return res.status(400).json({ success: false, error: 'The credential for this share link has been revoked.' });
        }

        // Log access in background 
        share.accessLogs.push({
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
        share.save().catch(console.error);

        res.status(200).json({
            success: true,
            data: {
                credential: share.credentialId,
                expiresAt: share.expiresAt
            }
        });
    } catch (error) {
        next(error);
    }
};
