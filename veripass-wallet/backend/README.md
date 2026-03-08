# VeriPass Backend Setup

## Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas account
- MetaMask wallet (for blockchain features)

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your values:
- Set `MONGODB_URI` to your MongoDB connection string
- Change `JWT_SECRET` to a secure random string
- Add Infura/Alchemy RPC URL for blockchain

4. Start MongoDB (if local):
```bash
mongod
```

5. Run backend:
```bash
npm run dev
```

Backend runs on http://localhost:3001
