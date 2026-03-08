const axios = require('axios');
const FormData = require('form-data');
const { ethers } = require('ethers');

async function test() {
    try {
        // 1. Create a random wallet
        const wallet = ethers.Wallet.createRandom();
        console.log("Wallet:", wallet.address);

        // 2. Register as user first or issuer
        console.log("Registering...");
        const signupRes = await axios.post("http://localhost:5000/api/auth/signup", {
            email: "test_" + Date.now() + "@test.com",
            password: "password123",
            name: "Test Issuer",
            role: "issuer",
            walletAddress: wallet.address
        });
        console.log("Signup:", signupRes.data);

        // Let's pretend the signup was successful and try to login maybe? Or wait, signup doesn't require signature?
        // Let's see if signup works. If it returns a token, we use it.
        // But auth uses nonce and signature. We'll find out!
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}

test();
