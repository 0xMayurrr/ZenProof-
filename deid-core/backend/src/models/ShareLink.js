const mongoose = require('mongoose');

const shareLinkSchema = new mongoose.Schema({
    credentialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Credential',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    accessLogs: [{
        accessedAt: { type: Date, default: Date.now },
        ipAddress: { type: String },
        userAgent: { type: String }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Automatically delete expired documents
shareLinkSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ShareLink', shareLinkSchema);
