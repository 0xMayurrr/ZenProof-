<div align="center">

  <img src="./veripass-wallet/public/logo_new-removebg-preview.png" alt="ZenProof Logo" width="300"/>

  <br/><br/>

  # ZenProof — Veripass Wallet

  **Your Identity. Your Rules. On-chain. Forever.**

  Decentralized Credential Wallet — own, store, manage, and verify your life achievements as cryptographic credentials bound to a permanent Decentralized Identifier on the Polygon Blockchain.

  <br/>

  [![Live Frontend](https://img.shields.io/badge/Netlify-Live-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://zenproof-wallet.netlify.app/)
  [![Live Backend](https://img.shields.io/badge/Render-API_Live-000000?style=for-the-badge&logo=render&logoColor=white)](https://zenproof-wallet-backend.onrender.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blueviolet?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <br/>

  > **This was my Final Year Project (FYP)** — built from scratch, shipped to production, deployed live. Real stack. Real contracts. Real credentials. No fluff.

  <br/>

</div>

---

## What is ZenProof?

You grind through 4 years of college, boot camps, hackathons, open source — and all you have to prove it is a PDF nobody can verify and a LinkedIn anyone can fake.

**ZenProof kills that problem.**

It's a **privacy-first, Universal Credential Wallet** that transforms your real-world achievements — degrees, certifications, DAO contributions — into cryptographically signed **Verifiable Credentials** bound to a permanent Decentralized Identifier (DID) that lives on-chain.

The key: using **Zero-Knowledge Proofs (ZK-SNARKs)**, you can prove your credentials to anyone on the internet without ever exposing the underlying raw data. Prove you have a CS degree without handing over your transcript. Prove you're a senior dev without revealing your institution. The data stays yours. The proof speaks for itself.

**Own your identity. Not just your tokens.**

---

## Core Features

| Feature | Description |
|---|---|
| **Web3 Authentication** | Passwordless sign-in via MetaMask wallet signatures — no email, no password, no server custody |
| **Universal DID Construction** | Auto-generates a `did:polygon:...` identity document per user, fully W3C standards compliant |
| **Verifiable Credentials** | Immutable credential issuance with IPFS content hashes anchored to Sepolia smart contracts |
| **Zero-Knowledge Privacy Layer** | Prove credentials to third parties without revealing the raw data underneath — ZK-SNARKs under the hood |
| **AI-Powered Fraud Detection** | Machine learning layer that flags anomalous credential submissions before they hit the chain |
| **One-Click Shareable Proofs** | Instant verifiable QR codes and share-links for recruiters to cryptographically verify applicants on the spot |
| **Dev Rep Engine** | GitHub-native module that calculates developer activity statistics and mints them as unique on-chain credentials |

---

## The AI Layer — Why It Matters

Credential fraud is real. Fake degrees, forged certificates, manipulated transcripts — they all look legitimate on paper.

ZenProof introduces an **AI-powered verification layer** that runs on every credential submission before it gets anchored on-chain. The model is trained on patterns of legitimate vs. fraudulent credential data, flagging anomalies in real time:

- Unusual institution-credential pairings
- Metadata inconsistencies across multi-credential submissions
- Reputation scoring based on issuer trust signals

This isn't just blockchain for the sake of blockchain. The combination of **AI fraud detection + ZK privacy + on-chain immutability** creates a full-stack trust layer that neither Web2 nor Web3 alone can pull off.

---

## Tech Stack

Full-stack monorepo — three precisely tuned layers, each doing exactly what it's built for.

### Frontend — `/veripass-wallet`
- **Framework:** React + Vite (TypeScript)
- **Styling:** Tailwind CSS + Shadcn UI + Framer Motion
- **Web3 Engine:** Ethers.js v6
- **Deployed:** Netlify

### Backend — `/deid-core/backend`
- **Runtime:** Node.js + Express
- **Database:** MongoDB Atlas
- **Identity Protocol:** JWT + Custom DID Resolver
- **Deployed:** Render

### Blockchain Layer — `/deid-core/contracts`
- **Network:** Ethereum Sepolia / Polygon Amoy
- **Language:** Solidity + Hardhat
- **Decentralized Storage:** IPFS via Pinata

---

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/0xMayurrr/zenproof-veripass.git
cd zenproof-veripass
```

### 2. Run the backend
```bash
cd deid-core/backend
npm install
```
Set up your `.env` with your MongoDB URI, Pinata API keys, and private keys. Do not commit these.
```bash
npm run dev
# Starts on http://localhost:5000
```

### 3. Run the frontend
```bash
cd veripass-wallet
npm install
```
Set `VITE_API_URL=http://localhost:5000/api` in your `.env`.
```bash
npm run dev
# Starts on http://localhost:8080
```

### 4. Connect
Open `http://localhost:8080/` in a Web3-injected browser (Brave or Chrome with MetaMask). Connect your wallet.

---

## Security

All sensitive environment variables — contract deployment keys, MongoDB URIs, API secrets — are excluded from version control via a custom `.gitignore`. Nothing sensitive touches this repo. That's non-negotiable.

---

## What Comes Next — Credora

<div align="center">
  <img src="./veripass-wallet/public/credora-high-resolution-logo-transparent.png" alt="Credora Logo" width="260"/>
  <br/><br/>
</div>

ZenProof was the proof of concept. **[Credora](https://github.com/0xMayurrr/Credora_Digital)** is the production system.

Credora is the upgraded, government-grade successor to ZenProof — rebuilt on **Hyperledger Fabric 2.5** with a dual-layer authentication model: MetaMask for citizens, X.509 MSP certificates for institutions. The AI fraud detection engine is deeper, the ZK privacy architecture is tighter, and the credential lifecycle management is built for national-scale deployment.

It was submitted to the **Blockchain India Challenge 2024 (MeitY)** — a government initiative to modernize India's credential infrastructure.

> ZenProof validated the idea. Credora ships it to the real world.

**Repo:** [github.com/0xMayurrr/Credora_Digital](https://github.com/0xMayurrr/Credora_Digital)

---

## Links

- **Live App:** [zenproof-wallet.netlify.app](https://zenproof-wallet.netlify.app/)
- **Backend API:** [zenproof-wallet-backend.onrender.com](https://zenproof-wallet-backend.onrender.com/)
- **ZenProof Repo:** [github.com/0xMayurrr/ZenProof-](https://github.com/0xMayurrr/ZenProof-)
- **Credora Repo:** [github.com/0xMayurrr/Credora_Digital](https://github.com/0xMayurrr/Credora_Digital)

---

<div align="center">

  *Final Year Project — built, deployed, and on-chain.*

  **[@0xMayurrr](https://github.com/0xMayurrr)**

</div>
