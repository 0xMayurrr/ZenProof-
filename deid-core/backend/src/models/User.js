const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
        sparse: true
    },
    name: {
        type: String,
        trim: true
    },
    did: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['user', 'issuer', 'admin'],
        default: 'user'
    },
    organizationName: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    description: {
        type: String
    },
    githubUsername: {
        type: String,
        trim: true
    },
    nonce: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
