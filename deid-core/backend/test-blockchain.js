require('dotenv').config();
const { ethers } = require('ethers');

// ABI fragment required for interaction
const contractABI = [
    "function issueCredential(address recipient, string calldata ipfsCID, bytes32 credentialHash) external",
    "function revokeCredential(bytes32 credentialHash) external",
    "function verifyCredential(bytes32 credentialHash) external view returns (bool isValid, address issuer, address recipient, string memory ipfsCID, uint256 issuedAt, bool isRevoked)",
    "function checkIssuer(address issuer) external view returns (bool)",
    "function authorizeIssuer(address issuer) external"
];

async function test() {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
        const wallet = new ethers.Wallet(process.env.SERVER_WALLET_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            contractABI,
            wallet
        );

        console.log("Checking Issuer...", wallet.address);
        const isAuthorized = await contract.checkIssuer(wallet.address);
        console.log("Is Authorized:", isAuthorized);

    } catch (e) {
        console.error("Error:", e);
    }
}

test();
