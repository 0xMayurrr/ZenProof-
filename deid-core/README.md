# DeID Universal Certificate Wallet 🪪

## 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas URI
- Metamask Extension

## 2. Blockchain Setup

1. Open a terminal and navigate to `deid-core/blockchain`:
   ```bash
   cd deid-core/blockchain
   npm install
   ```

2. Configure Environment:
   Rename `.env.example` to `.env` and fill in the details:
   - `PRIVATE_KEY`: Your deployment wallet private key
   - `AMOY_RPC_URL`: `https://rpc-amoy.polygon.technology`

3. Compile Contract:
   ```bash
   npx hardhat compile
   ```

4. Deploy to Polygon Amoy or Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network polygonAmoy
   ```
   **Save the deployed contract address.**

## 3. Backend Setup

1. Open a terminal and navigate to `deid-core/backend`:
   ```bash
   cd deid-core/backend
   npm install
   ```

2. Configure Environment:
   Rename `.env.example` to `.env` and configure:
   - `CONTRACT_ADDRESS`: The deployed address from Step 2
   - `SERVER_WALLET_PRIVATE_KEY`: Private key representing the Server (admin)
   - `PINATA_JWT`: Your Pinata API token for IPFS.

3. Start MongoDB
   Ensure MongoDB is running locally (`mongodb://localhost:27017/deid`).

4. Run Server:
   ```bash
   npm run dev
   ```
   It will run on `http://localhost:5000`.

## 4. API Endpoints

### Auth
- `POST /auth/nonce` - Get a nonce for wallet signing
- `POST /auth/verify` - Verify signature & return JWT

### Credentials
- `POST /credentials/issue` - Issue a credential (requires Auth & Issuer Wallet) (Form-Data: `document` file, `recipientWallet`, `title`)
- `GET /credentials` - Get credentials belonging to logged in user

### Verify
- `GET /verify/:credentialHash` - Verify validity and on-chain status of a credential

---
*Developed for DeID - Universal Certificate Wallet Platform*
