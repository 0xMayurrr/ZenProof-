const blockchainService = require('../services/blockchainService');
const Credential = require('../models/Credential');

// @desc    Update and retrieve Dev Rep Score
// @route   POST /devrep/update
// @access  Private (Issuer or User themselves, but contract requires Issuer. Let's use server wallet to sign it as the contract's authorized issuer if the system is doing it, or we need to ensure the caller is an Issuer on-chain. Actually, the contract has `onlyAuthorizedIssuer` for `updateRepScore`. If a student wants to update their score, the backend server (which is an authorized issuer) can execute it for them.)
exports.updateDevRepScore = async (req, res, next) => {
    try {
        const { githubRepos } = req.body;
        const userWallet = req.user.walletAddress.toLowerCase();

        // Count user badges/credentials
        const badgesCount = await Credential.countDocuments({
            recipientWallet: userWallet,
            revoked: false
        });

        const reposCount = parseInt(githubRepos) || 0;
        const multiplier = 10; // For instance: (repos + badges) * 10

        // Ensure server wallet issues it, as it's authorized
        // Update on-chain
        const tx = await blockchainService.updateRepScore(userWallet, reposCount, badgesCount, multiplier);

        res.status(200).json({
            success: true,
            message: 'Dev Rep Score updated successfully',
            score: (reposCount + badgesCount) * multiplier,
            txHash: tx.txHash
        });

    } catch (error) {
        console.error('Update Dev Rep Score Error:', error);
        next(error);
    }
};

// @desc    Get Dev Rep Score
// @route   GET /devrep/:walletAddress
// @access  Public or Private
exports.getDevRepScore = async (req, res, next) => {
    try {
        const walletAddress = req.params.walletAddress.toLowerCase();
        const score = await blockchainService.getRepScore(walletAddress);

        res.status(200).json({
            success: true,
            score: score
        });

    } catch (error) {
        console.error('Get Dev Rep Score Error:', error);
        next(error);
    }
};
