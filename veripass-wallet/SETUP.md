# VeriPass Wallet - Production Setup Guide

## What Was Added

### Backend (Node.js + Express + MongoDB)
- ✅ REST API with authentication (JWT)
- ✅ MongoDB models for Users, Credentials, Shares
- ✅ Auth routes (login/signup)
- ✅ Credential management routes
- ✅ Share management routes

### Frontend Integration
- ✅ API client (`src/lib/api.ts`)
- ✅ Blockchain integration (`src/lib/blockchain.ts`)
- ✅ Updated AuthContext to use real API

### Configuration
- ✅ Environment variables setup
- ✅ TypeScript configuration

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 2. Frontend Setup
```bash
# In root directory
cp .env.example .env
# Edit .env with API URL
npm install
npm run dev
```

### 3. MongoDB Setup
**Option A - Local:**
```bash
mongod
```

**Option B - MongoDB Atlas (Cloud):**
1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in backend/.env

## What Still Needs Implementation

### 1. Smart Contract Deployment
- Deploy DID Registry contract to Ethereum testnet (Sepolia)
- Update `CONTRACT_ADDRESS` in .env

### 2. W3C Verifiable Credentials
- Implement proper VC signing/verification
- Add DID document resolution

### 3. Production Features
- Email verification
- Password reset
- Rate limiting
- File uploads for credential documents
- Webhook notifications

## Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Open http://localhost:5173
4. Sign up with email/password
5. Login and test features

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
VITE_BLOCKCHAIN_RPC=https://sepolia.infura.io/v3/YOUR_KEY
VITE_CHAIN_ID=11155111
VITE_CONTRACT_ADDRESS=0x...
```

### Backend (backend/.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/veripass
JWT_SECRET=change-this-to-random-string
APP_URL=http://localhost:5173
```

## Next Steps

1. Install MongoDB
2. Run `cd backend && npm install`
3. Create backend/.env file
4. Run `npm run dev` in backend folder
5. Create .env file in root
6. Run `npm run dev` in root folder
7. Test signup/login functionality
