const { ethers } = require('ethers');

// ABI fragment required for interaction
const contractABI = [
    "function issueCredential(address recipient, string calldata ipfsCID, bytes32 credentialHash) external",
    "function revokeCredential(bytes32 credentialHash) external",
    "function verifyCredential(bytes32 credentialHash) external view returns (bool isValid, address issuer, address recipient, string memory ipfsCID, uint256 issuedAt, bool isRevoked)",
    "function checkIssuer(address issuer) external view returns (bool)",
    "function authorizeIssuer(address issuer) external",
    "function updateRepScore(address user, uint256 repos, uint256 badges, uint256 multiplier) external",
    "function devRepScores(address user) external view returns (uint256)"
];

class BlockchainService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);

        let privateKey = process.env.SERVER_WALLET_PRIVATE_KEY || '';
        if (privateKey && !privateKey.startsWith('0x')) {
            privateKey = '0x' + privateKey;
        }

        if (!privateKey || privateKey.length < 66) {
            console.warn('WARNING: SERVER_WALLET_PRIVATE_KEY is missing or invalid. Blockchain writes will fail.');
            this.wallet = null;
            this.contract = null;
            return;
        }

        if (!process.env.CONTRACT_ADDRESS) {
            console.warn('WARNING: CONTRACT_ADDRESS is missing. Blockchain writes will fail.');
            this.wallet = null;
            this.contract = null;
            return;
        }

        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            contractABI,
            this.wallet
        );
    }

    _requireContract() {
        if (!this.contract) throw new Error('Blockchain service not configured: missing SERVER_WALLET_PRIVATE_KEY');
    }

    async issueCredential(recipient, ipfsCID, credentialHash) {
        this._requireContract();
        try {
            const tx = await this.contract.issueCredential(recipient, ipfsCID, credentialHash);
            const receipt = await tx.wait();
            return {
                success: true,
                txHash: receipt.hash
            };
        } catch (error) {
            console.error('Blockchain Issue Error:', error);
            throw new Error(`Blockchain issue failed: ${error.message}`);
        }
    }

    async revokeCredential(credentialHash) {
        this._requireContract();
        try {
            const tx = await this.contract.revokeCredential(credentialHash);
            const receipt = await tx.wait();
            return {
                success: true,
                txHash: receipt.hash
            };
        } catch (error) {
            console.error('Blockchain Revoke Error:', error);
            throw new Error(`Blockchain revoke failed: ${error.message}`);
        }
    }

    async verifyCredential(credentialHash) {
        try {
            const result = await this.contract.verifyCredential(credentialHash);
            return {
                isValid: result.isValid,
                issuer: result.issuer,
                recipient: result.recipient,
                ipfsCID: result.ipfsCID,
                issuedAt: result.issuedAt,
                isRevoked: result.isRevoked
            };
        } catch (error) {
            console.error('Blockchain Verify Error:', error);
            throw new Error(`Blockchain verification failed: ${error.message}`);
        }
    }

    async authorizeIssuer(issuerAddress) {
        this._requireContract();
        try {
            const isAlready = await this.contract.checkIssuer(issuerAddress);
            if (isAlready) return { success: true };
            const tx = await this.contract.authorizeIssuer(issuerAddress);
            await tx.wait();
            return { success: true, txHash: tx.hash };
        } catch (error) {
            console.error('Blockchain Authorize Issuer Error:', error);
            throw new Error(`Failed to authorize issuer: ${error.message}`);
        }
    }

    async checkIssuer(issuerAddress) {
        try {
            return await this.contract.checkIssuer(issuerAddress);
        } catch (error) {
            console.error('Blockchain Check Issuer Error:', error);
            throw new Error(`Failed to check issuer: ${error.message}`);
        }
    }

    async updateRepScore(userAddress, repos, badges, multiplier = 10) {
        this._requireContract();
        try {
            const tx = await this.contract.updateRepScore(userAddress, repos, badges, multiplier);
            const receipt = await tx.wait();
            return {
                success: true,
                txHash: receipt.hash
            };
        } catch (error) {
            console.error('Blockchain Update Rep Score Error:', error);
            throw new Error(`Failed to update rep score: ${error.message}`);
        }
    }

    async getRepScore(userAddress) {
        try {
            // Returns a bigInt, convert to string/number if needed
            const score = await this.contract.devRepScores(userAddress);
            return Number(score);
        } catch (error) {
            console.error('Blockchain Get Rep Score Error:', error);
            throw new Error(`Failed to get rep score: ${error.message}`);
        }
    }
}

module.exports = new BlockchainService();
