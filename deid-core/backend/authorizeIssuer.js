require('dotenv').config();
const { ethers } = require('ethers');

const ABI = ["function authorizeIssuer(address issuer) external", "function checkIssuer(address issuer) external view returns (bool)"];

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SERVER_WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);

    const issuerAddress = process.argv[2];
    if (!issuerAddress) {
        console.log('Usage: node authorizeIssuer.js <wallet_address>');
        process.exit(1);
    }

    console.log(`Checking if ${issuerAddress} is authorized...`);
    const isAuth = await contract.checkIssuer(issuerAddress);
    if (isAuth) { console.log('Already authorized!'); process.exit(0); }

    console.log('Authorizing issuer on blockchain...');
    const tx = await contract.authorizeIssuer(issuerAddress);
    await tx.wait();
    console.log(`Done! Tx: ${tx.hash}`);
}

main().catch(console.error);
