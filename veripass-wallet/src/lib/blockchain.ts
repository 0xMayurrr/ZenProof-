import { ethers } from 'ethers';

const RPC_URL = import.meta.env.VITE_BLOCKCHAIN_RPC;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const DID_REGISTRY_ABI = [
  'function createDID(string memory didDocument) external returns (string memory)',
  'function resolveDID(string memory did) external view returns (string memory)',
  'function updateDID(string memory did, string memory didDocument) external',
];

export const blockchain = {
  getProvider: () => {
    if ((window as any).ethereum) {
      return new ethers.BrowserProvider((window as any).ethereum);
    }
    return new ethers.JsonRpcProvider(RPC_URL);
  },

  createDID: async (didDocument: any) => {
    const provider = blockchain.getProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DID_REGISTRY_ABI, signer);
    const tx = await contract.createDID(JSON.stringify(didDocument));
    const receipt = await tx.wait();
    return receipt;
  },

  resolveDID: async (did: string) => {
    const provider = blockchain.getProvider();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DID_REGISTRY_ABI, provider);
    const didDocument = await contract.resolveDID(did);
    return JSON.parse(didDocument);
  },

  connectWallet: async () => {
    if (!(window as any).ethereum) throw new Error('MetaMask not installed');
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    return { address, signer };
  },
};
