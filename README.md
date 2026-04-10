<div align="center">

  <img src="./veripass-wallet/public/logo_new-removebg-preview.png" alt="ZenProof Logo" width="300"/>

  <br/>
  <br/>

  # ⚡ ZenProof — Veripass Wallet

  ### *Your Identity. Your Rules. On-chain. Forever.*

  **Decentralized Credential Wallet — Securely own, store, manage, and verify your life achievements and decentralized identities on the Polygon Blockchain. No middlemen. No gatekeepers. Just you and the chain. 🔗**

  <br/>

  [![Live Frontend](https://img.shields.io/badge/🚀_Netlify-Live_Now-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://zenproof-wallet.netlify.app/)
  [![Live Backend](https://img.shields.io/badge/⚙️_Render-API_Live-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://zenproof-wallet-backend.onrender.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blueviolet?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![Built With Love](https://img.shields.io/badge/Built_With-💚_Vibes-ff69b4?style=for-the-badge)]()

  <br/>

  > 🎓 **This project was built as my Final Year Project (FYP)** — shipped from scratch, late nights, a lot of coffee, and pure vibe. It's real, it works, and it slaps.

  <br/>

</div>

---

## 🧬 What even IS ZenProof?

Bro, picture this — you grind through 4 years of college, boot camps, open source contributions, hackathons... and all you have to show for it is a PDF no one can verify and a LinkedIn that anyone can fake.

**ZenProof kills that problem forever.**

It's a **privacy-first, Universal Credential Wallet** that transforms your real-world achievements — university degrees, certifications, DAO contributions — into **cryptographically signed Verifiable Credentials** bound to a permanent Decentralized Identifier (DID) that lives on-chain.

The killer feature? 🥷 Using **Zero-Knowledge Proofs (ZK-SNARKs)**, you can prove your rep across the internet **without leaking ANY underlying data**. Prove you have a CS degree without showing your transcript. Prove you're a senior dev without doxxing yourself. It's lowkey the future.

**Own your identity. Not just your tokens.**

---

## ✨ Core Features — The Hits

| Feature | What it does |
|---|---|
| 🔐 **Web3 Auth** | Passwordless sign-in via MetaMask signatures. No passwords. No email. Just your wallet. |
| 🆔 **Universal DID** | Auto-generates your own `did:polygon:...` identity document based on W3C standards |
| 📜 **Verifiable Credentials** | Immutable credential issuance using IPFS hashes anchored to Sepolia smart contracts |
| 🥷 **ZK Architecture** | Prove achievements to anyone without leaking the actual data. Zero-knowledge is zero-compromise. |
| 📇 **One-Click Share** | Instant verifiable QR codes + share-links for recruiters to silently verify you on the spot |
| 💻 **Dev Rep Engine** | GitHub-native module that calculates your dev activity stats and mints them as on-chain credentials |

---

## 🏗️ Tech Stack — What's Under the Hood

> This is a full-stack **monorepo** with precisely tuned micro-services. Each layer does what it's built for.

### 🎨 Frontend — `/veripass-wallet`
- **Framework:** React + Vite (TypeScript) — fast, typed, and clean
- **Styling:** Tailwind CSS + Shadcn UI + Framer Motion — smooth and sexy
- **Web3 Engine:** Ethers.js v6 — the gold standard
- **Deployed on:** Netlify ✅

### ⚙️ Backend — `/deid-core/backend`
- **Runtime:** Node.js + Express — reliable and fast
- **Database:** MongoDB Atlas (Cloud) — scalable NoSQL
- **Identity Protocol:** JWT + Custom DID Resolver — our own sauce
- **Deployed on:** Render ✅

### ⛓️ Blockchain Layer — `/deid-core/contracts`
- **Network:** Ethereum Sepolia / Polygon Amoy
- **Language:** Solidity + Hardhat Toolkit
- **Storage:** IPFS via Pinata API — decentralized, permanent

---

## 🚀 Quick Start — Run It Locally

Clone it. Boot it. Ship it. Let's go.

### Step 1 — Clone the Repo
```bash
git clone https://github.com/0xMayurrr/zenproof-veripass.git
cd zenproof-veripass
```

### Step 2 — Setup Backend
```bash
cd deid-core/backend
npm install
```
Create your `.env` file from the template. Drop in your MongoDB URI, private keys, Pinata API keys. **Do NOT commit these. Ever.**
```bash
npm run dev
# Backend fires up on http://localhost:5000
```

### Step 3 — Setup Frontend
```bash
cd veripass-wallet
npm install
```
Set `VITE_API_URL=http://localhost:5000/api` in your `.env` file.
```bash
npm run dev
# Frontend fires up on http://localhost:8080
```

### Step 4 — Open the App
Fire up `http://localhost:8080/` in a Web3-injected browser (Brave / Chrome + MetaMask). Connect your wallet. You're in. 🫡

---

## 🛡️ Security

All environment variables — contract keys, MongoDB URIs, API secrets — are **strictly excluded from git** via a custom `.gitignore`. Nothing sensitive ever touches the repo. This is non-negotiable.

---

## 🚀 What's Next — Meet Credora

<div align="center">
  <img src="./veripass-wallet/public/credora-high-resolution-logo-transparent.png" alt="Credora Logo" width="280"/>
  <br/>
  <br/>
</div>

ZenProof was the beginning. **[Credora](https://github.com/0xMayurrr/ZenProof-)** is the evolution.

Credora is the **upgraded, production-grade successor** to ZenProof — rebuilt from the learnings of this FYP with a cleaner architecture, a more powerful credential engine, and an enterprise-ready onboarding system for institutions to issue verifiable credentials at scale.

> 🔗 ZenProof → Credora is the **proof-of-concept → production** glow-up. Same mission. 10x the execution.

Stay tuned. It's going to go crazy. 🔥

---

## 🔗 Links

- 🌐 **Live App:** [zenproof-wallet.netlify.app](https://zenproof-wallet.netlify.app/)
- 🏗️ **Backend API:** [zenproof-wallet-backend.onrender.com](https://zenproof-wallet-backend.onrender.com/)
- 🐙 **GitHub:** [0xMayurrr/ZenProof-](https://github.com/0xMayurrr/ZenProof-)

---

<div align="center">

  ### Built with 💚 + 🔥 vibes for the Universal Credential initiative.

  *Final Year Project — shipped, deployed, and on-chain.*

  **[@0xMayurrr](https://github.com/0xMayurrr)**

</div>
