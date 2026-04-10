<div align="center">

  <img src="./public/credora-high-resolution-logo-transparent.png" alt="Credora Logo" width="300"/>

  <br/><br/>

  # Credora — Digital Credential Infrastructure

  **Government-grade. Privacy-preserving. AI-verified. On-chain.**

  A universal credential lifecycle management platform built on Hyperledger Fabric — combining Zero-Knowledge Proofs and AI-powered fraud detection to bring verifiable credentials to national scale.

  <br/>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blueviolet?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![Built On](https://img.shields.io/badge/Hyperledger-Fabric_2.5-2F3134?style=for-the-badge&logo=hyperledger&logoColor=white)](https://www.hyperledger.org/use/fabric)
  [![MeitY](https://img.shields.io/badge/MeitY-Blockchain_India_Challenge_2024-FF6C37?style=for-the-badge)](https://www.meity.gov.in/)

  <br/>

  > Built by **[@0xMayurrr](https://github.com/0xMayurrr)** and **[@irfanmhmd](https://github.com/irfanmhmd)**
  >
  > Submitted to the **Blockchain India Challenge 2024** — a government initiative by MeitY to modernize India's credential infrastructure.

  <br/>

</div>

---

## What is Credora?

Credential fraud in India is a multi-billion rupee problem. Fake degrees, forged marksheets, fabricated experience letters — they get people hired, admitted, and licensed for roles they have zero business being in. Current verification systems are manual, slow, and easy to game.

**Credora is the fix.**

It's a **government-grade, privacy-preserving credential platform** that handles the full lifecycle — issuance, storage, sharing, and verification — for real-world credentials like university degrees, professional certifications, and government-issued documents. Built on a **permissioned blockchain**, powered by **AI fraud detection**, and secured with **Zero-Knowledge Proofs**.

Institutions issue on-chain. Citizens own and control. Verifiers check cryptographically. Nobody fakes anything.

---

## The Problem with Credentials Today

- PDFs get forged. Universities can't verify at scale.
- Centralized databases get breached. Sensitive data lives in silos.
- Manual verification is slow, expensive, and inconsistent.
- Citizens have zero control over who accesses their credential data.

Credora doesn't patch these problems. It replaces the broken system entirely.

---

## Core Features

| Feature | Description |
|---|---|
| **Permissioned Blockchain** | Built on Hyperledger Fabric 2.5 — an enterprise-grade permissioned network where only authorized institutions can issue credentials |
| **Dual-Layer Authentication** | MetaMask wallet signatures for citizens. X.509 MSP certificates for institutions. Two completely separate trust anchors. |
| **Zero-Knowledge Proofs** | Citizens prove credential validity to verifiers without revealing the underlying data — degree without the transcript, identity without the documents |
| **AI Fraud Detection** | An ML model runs on every credential submission, pattern-matching against known fraud signatures before anything hits the ledger |
| **Full Credential Lifecycle** | Issue → Store → Share → Verify. Every stage is handled on-chain with cryptographic guarantees |
| **Selective Disclosure** | Citizens control exactly what gets shared with whom — no more all-or-nothing data dumps |
| **Audit Trail** | Every credential event — issuance, access, revocation — is permanently logged on the permissioned ledger |

---

## The AI Layer — Fraud Detection at Scale

This is what separates Credora from every other "credentials on blockchain" project.

Immutability is a double-edged sword. Once a fraudulent credential is on-chain, it's permanent. That's why **fraud detection has to happen before issuance**, not after.

Credora's AI layer runs on every incoming credential submission:

- **Pattern recognition** — flags credential metadata that doesn't match known institutional profiles
- **Anomaly detection** — identifies statistical outliers in submission patterns across the network
- **Issuer trust scoring** — weights the credibility of credential claims against historical issuer behavior
- **Cross-reference verification** — checks submitted data against registered institutional schemas

The result: fraudulent credentials get caught at the gate. Legitimate ones pass through in seconds. The ledger stays clean.

---

## Architecture

Credora is a multi-layer system where every component has a specific trust boundary.

```
Citizen / Verifier
        |
   React Frontend (TypeScript)
        |
   Node.js API Gateway
        |
   ┌────────────────────────────────────────┐
   │         Hyperledger Fabric 2.5          │
   │   Orderer → Peer Nodes → CouchDB        │
   │   Chaincode (Go) — Credential Logic     │
   └────────────────────────────────────────┘
        |
   IPFS (Pinata) — Raw Credential Storage
        |
   AI Fraud Detection Microservice
        |
   ZK-SNARK Proof Generation / Verification
```

### Technology Breakdown

**Blockchain Layer**
- Hyperledger Fabric 2.5 — permissioned network
- Chaincode written in Go — credential issuance, revocation, and access control
- CouchDB — rich query support for credential state

**Authentication**
- Citizens: MetaMask + wallet-based signature auth
- Institutions: X.509 certificates via Fabric MSP

**Privacy Layer**
- ZK-SNARKs for selective credential disclosure
- Zero raw data ever leaves the citizen's control

**AI Fraud Detection**
- ML microservice trained on credential fraud patterns
- Runs pre-issuance on every submission
- Flags suspicious submissions for institutional review

**Frontend**
- React + TypeScript
- Tailwind CSS + Framer Motion
- Responsive wallet interface for citizens and institutional dashboards for issuers

**Storage**
- IPFS via Pinata for decentralized raw credential storage
- Content-addressed hashes anchored to Fabric ledger

---

## Quick Start

### Prerequisites
- Docker + Docker Compose
- Node.js 18+
- Hyperledger Fabric binaries and samples
- Go 1.21+

### 1. Clone the repo
```bash
git clone https://github.com/0xMayurrr/Credora_Digital.git
cd Credora_Digital
```

### 2. Bootstrap the Fabric network
```bash
cd network
./network.sh up createChannel -c credora-channel -ca
./network.sh deployCC -c credora-channel -ccn credora -ccp ../chaincode/credora -ccl go
```

### 3. Run the API gateway
```bash
cd api
npm install
cp .env.example .env
# Fill in your Fabric connection profile, Pinata keys, and JWT secret
npm run dev
```

### 4. Run the frontend
```bash
cd client
npm install
npm run dev
# Opens on http://localhost:3000
```

---

## The Origin — ZenProof

Credora didn't come from nowhere.

**[ZenProof](https://github.com/0xMayurrr/ZenProof-)** was the Final Year Project that proved the concept. A decentralized credential wallet on Polygon with ZK privacy and a Web3-native UX. It shipped. It deployed. It worked.

Credora is what happens when you take that proof-of-concept and rebuild it for the real world — permissioned blockchain for institution compliance, AI fraud detection for integrity at scale, and a government-ready architecture for national deployment.

> ZenProof asked "can this work?". Credora answers "here's how it scales."

---

## Submission

This project was submitted to the **Blockchain India Challenge 2024**, an initiative by the **Ministry of Electronics and Information Technology (MeitY)** to identify and accelerate blockchain-based solutions for India's digital infrastructure.

---

## Contributors

- **[0xMayurrr](https://github.com/0xMayurrr)** — Protocol Architecture, Blockchain Layer, AI Integration, Frontend
- **[irfanmhmd](https://github.com/irfanmhmd)** — Chaincode Development, Network Configuration, Backend API

---

## Links

- **ZenProof (Origin):** [github.com/0xMayurrr/ZenProof-](https://github.com/0xMayurrr/ZenProof-)
- **Credora Repo:** [github.com/0xMayurrr/Credora_Digital](https://github.com/0xMayurrr/Credora_Digital)

---

<div align="center">

  *Built for India's Digital Future.*

  **[@0xMayurrr](https://github.com/0xMayurrr)** · **[@irfanmhmd](https://github.com/irfanmhmd)**

</div>
