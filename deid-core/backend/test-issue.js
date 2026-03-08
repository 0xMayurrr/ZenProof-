const mongoose = require('mongoose');
const User = require('./src/models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

async function test() {
    try {
        console.log("Finding an issuer...");
        const user = await User.findOne({ role: 'issuer' });
        if (!user) {
            console.log("No issuer found in DB!");
            process.exit(1);
        }

        console.log("Issuer found:", user.email || user.walletAddress);

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '30d'
        });

        // Issue credential
        const formData = new FormData();
        formData.append('title', 'Test Degree');
        formData.append('category', 'education');
        formData.append('recipientWallet', '0x2222222222222222222222222222222222222222');
        formData.append('description', 'Test Description');
        formData.append('document', Buffer.from('PDF Content Here'), {
            filename: 'test.pdf',
            contentType: 'application/pdf'
        });

        console.log("Calling API...");
        const res = await axios.post("http://localhost:5000/api/credentials/issue", formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });

        console.log("Success:", res.data);
    } catch (e) {
        console.error("Error Status:", e.response ? e.response.status : e.message);
        console.error("Error Data:", e.response ? e.response.data : e.message);
    } finally {
        mongoose.disconnect();
    }
}

test();
