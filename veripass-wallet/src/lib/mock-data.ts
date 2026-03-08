export interface Credential {
  id: string;
  title: string;
  category: "education" | "employment" | "certification" | "license" | "award" | "other";
  issuer: string;
  issuerDid: string;
  recipientDid: string;
  issueDate: string;
  expiryDate?: string;
  status: "verified" | "revoked" | "pending";
  ipfsCid: string;
  txHash: string;
  description: string;
  metadata: Record<string, string>;
}

export interface ShareRecord {
  id: string;
  credentialId: string;
  credentialTitle: string;
  shareToken: string;
  createdAt: string;
  expiresAt?: string;
  accessCount: number;
  isActive: boolean;
}

export const mockCredentials: Credential[] = [
  {
    id: "cred-001",
    title: "Bachelor of Computer Science",
    category: "education",
    issuer: "Stanford University",
    issuerDid: "did:deid:issuer:stanford",
    recipientDid: "did:deid:user:001",
    issueDate: "2024-06-15",
    status: "verified",
    ipfsCid: "QmX7bVbZ8YNPqR9a3KJftQB8rTrmC1jNzfP1vYMBaerZN5",
    txHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
    description: "Degree awarded with honors in Computer Science",
    metadata: { GPA: "3.9", Honors: "Magna Cum Laude" },
  },
  {
    id: "cred-002",
    title: "AWS Solutions Architect Professional",
    category: "certification",
    issuer: "Amazon Web Services",
    issuerDid: "did:deid:issuer:aws",
    recipientDid: "did:deid:user:001",
    issueDate: "2025-01-20",
    expiryDate: "2028-01-20",
    status: "verified",
    ipfsCid: "QmY8cWcA9YOQs0b4LKguRB9sTsmD2kOzgQ2vZNDcbfaSP6",
    txHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    description: "Professional-level certification for designing distributed systems on AWS",
    metadata: { "Score": "92%", "Certification ID": "AWS-SAP-2025-7891" },
  },
  {
    id: "cred-003",
    title: "Senior Software Engineer",
    category: "employment",
    issuer: "Google LLC",
    issuerDid: "did:deid:issuer:google",
    recipientDid: "did:deid:user:001",
    issueDate: "2023-03-01",
    status: "verified",
    ipfsCid: "QmZ9dXdB0ZPRt1c5MKhuSC0tUtmE3lPagR3wOEecfcbTP7",
    txHash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
    description: "Employment verification for Senior Software Engineer position",
    metadata: { Department: "Cloud Platform", Duration: "2021-2023" },
  },
  {
    id: "cred-004",
    title: "Professional Engineering License",
    category: "license",
    issuer: "State Board of Engineering",
    issuerDid: "did:deid:issuer:stateboard",
    recipientDid: "did:deid:user:001",
    issueDate: "2022-09-10",
    expiryDate: "2026-09-10",
    status: "verified",
    ipfsCid: "QmA0eYeC1aQSu2d6NLiuTD1uVtnF4mQbhT4xPFgdgeUQ8",
    txHash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    description: "Licensed Professional Engineer in the State of California",
    metadata: { "License Number": "PE-2022-45678", State: "California" },
  },
  {
    id: "cred-005",
    title: "Innovation Award 2024",
    category: "award",
    issuer: "TechCrunch",
    issuerDid: "did:deid:issuer:techcrunch",
    recipientDid: "did:deid:user:001",
    issueDate: "2024-11-05",
    status: "pending",
    ipfsCid: "QmB1fZfD2bRTv3e7OMjuUE2wWopG5nRciU5yQGhehuVR9",
    txHash: "",
    description: "Recognized for breakthrough innovation in decentralized identity",
    metadata: { Category: "Web3", Event: "Disrupt 2024" },
  },
  {
    id: "cred-006",
    title: "Master of Business Administration",
    category: "education",
    issuer: "MIT Sloan",
    issuerDid: "did:deid:issuer:mit",
    recipientDid: "did:deid:user:001",
    issueDate: "2025-05-20",
    status: "revoked",
    ipfsCid: "QmC2gAgE3cSUw4f8PNkuVF3xXqpH6oPdjV6zRIigiwWS0",
    txHash: "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
    description: "MBA degree — record revoked for verification purposes",
    metadata: {},
  },
];

export const mockShares: ShareRecord[] = [
  {
    id: "share-001",
    credentialId: "cred-001",
    credentialTitle: "Bachelor of Computer Science",
    shareToken: "abc123xyz",
    createdAt: "2025-12-01",
    expiresAt: "2026-06-01",
    accessCount: 14,
    isActive: true,
  },
  {
    id: "share-002",
    credentialId: "cred-002",
    credentialTitle: "AWS Solutions Architect Professional",
    shareToken: "def456uvw",
    createdAt: "2026-01-15",
    accessCount: 7,
    isActive: true,
  },
  {
    id: "share-003",
    credentialId: "cred-003",
    credentialTitle: "Senior Software Engineer",
    shareToken: "ghi789rst",
    createdAt: "2025-11-20",
    expiresAt: "2026-02-20",
    accessCount: 3,
    isActive: false,
  },
];

export const categoryIcons: Record<string, string> = {
  education: "🎓",
  employment: "💼",
  certification: "📜",
  license: "🪪",
  award: "🏆",
  other: "📄",
};

export const categoryColors: Record<string, string> = {
  education: "bg-primary/10 text-primary border-primary/20",
  employment: "bg-accent/10 text-accent border-accent/20",
  certification: "bg-warning/10 text-warning border-warning/20",
  license: "bg-success/10 text-success border-success/20",
  award: "bg-destructive/10 text-destructive border-destructive/20",
  other: "bg-muted text-muted-foreground border-border",
};
