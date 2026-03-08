const mongoose = require('mongoose');

const issuerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    organizationName: {
        type: String,
        required: true,
        trim: true
    },
    verifiedStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    description: {
        type: String
    },
    website: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Issuer', issuerSchema);
