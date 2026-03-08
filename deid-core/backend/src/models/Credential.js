const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    issuerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientWallet: {
        type: String,
        required: true,
        lowercase: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        enum: ['education', 'employment', 'certification', 'license', 'award', 'other'],
        default: 'other'
    },
    ipfsCID: {
        type: String,
        required: true
    },
    credentialHash: {
        type: String,
        required: true,
        unique: true
    },
    blockchainTxHash: {
        type: String,
        required: true
    },
    issuedAt: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date
    },
    revoked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Credential', credentialSchema);
