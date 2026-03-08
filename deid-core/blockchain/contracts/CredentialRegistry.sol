// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CredentialRegistry
 * @dev Registry for issuing, revoking, and verifying credentials stored off-chain.
 */
contract CredentialRegistry {
    address public owner;

    struct Credential {
        address issuer;
        address recipient;
        string ipfsCID;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(address => bool) public authorizedIssuers;
    mapping(bytes32 => Credential) public credentials;
    mapping(address => uint256) public devRepScores;

    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    event CredentialIssued(bytes32 indexed credentialHash, address indexed issuer, address indexed recipient, string ipfsCID);
    event CredentialRevoked(bytes32 indexed credentialHash, address indexed issuer);
    event RepScoreUpdated(address indexed user, uint256 newScore);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "Caller is not an authorized issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Authorize the deployer by default
        authorizedIssuers[msg.sender] = true;
    }

    /**
     * @dev Authorize a new issuer
     * @param issuer Address of the issuer
     */
    function authorizeIssuer(address issuer) external onlyOwner {
        require(!authorizedIssuers[issuer], "Issuer already authorized");
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    /**
     * @dev Revoke an issuer's authorization
     * @param issuer Address of the issuer
     */
    function revokeIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "Issuer not authorized");
        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    /**
     * @dev Issue a new credential
     * @param recipient Address of the credential recipient
     * @param ipfsCID IPFS CID string of the document
     * @param credentialHash Unique SHA256 hash representing the credential
     */
    function issueCredential(
        address recipient,
        string calldata ipfsCID,
        bytes32 credentialHash
    ) external onlyAuthorizedIssuer {
        require(credentials[credentialHash].issuedAt == 0, "Credential already exists");

        credentials[credentialHash] = Credential({
            issuer: msg.sender,
            recipient: recipient,
            ipfsCID: ipfsCID,
            issuedAt: block.timestamp,
            revoked: false
        });

        emit CredentialIssued(credentialHash, msg.sender, recipient, ipfsCID);
    }

    /**
     * @dev Revoke a previously issued credential
     * @param credentialHash Unique SHA256 hash representing the credential
     */
    function revokeCredential(bytes32 credentialHash) external {
        require(credentials[credentialHash].issuedAt != 0, "Credential does not exist");
        require(credentials[credentialHash].issuer == msg.sender, "Only the issuer can revoke");
        require(!credentials[credentialHash].revoked, "Credential already revoked");

        credentials[credentialHash].revoked = true;

        emit CredentialRevoked(credentialHash, msg.sender);
    }

    /**
     * @dev Verify a credential's authenticity and status
     * @param credentialHash Unique SHA256 hash representing the credential
     * @return isValid Whether the credential exists and is not revoked
     * @return issuer Address of the issuer
     * @return recipient Address of the recipient
     * @return ipfsCID IPFS CID of the document
     * @return issuedAt Timestamp of issuance
     * @return isRevoked Revocation status
     */
    function verifyCredential(bytes32 credentialHash) external view returns (
        bool isValid,
        address issuer,
        address recipient,
        string memory ipfsCID,
        uint256 issuedAt,
        bool isRevoked
    ) {
        Credential memory cred = credentials[credentialHash];
        bool exists = cred.issuedAt != 0;
        return (
            exists && !cred.revoked,
            cred.issuer,
            cred.recipient,
            cred.ipfsCID,
            cred.issuedAt,
            cred.revoked
        );
    }

    /**
     * @dev Check if an address is an authorized issuer
     * @param issuer Address to check
     * @return bool True if authorized, false otherwise
     */
    function checkIssuer(address issuer) external view returns (bool) {
        return authorizedIssuers[issuer];
    }

    /**
     * @dev Update a user's Dev Rep Score
     * @param user Address of the user
     * @param repos Number of github repos
     * @param badges Number of hackathon badges/certifications
     * @param multiplier Multiplier (e.g., 10 for basic scoring)
     */
    function updateRepScore(
        address user,
        uint256 repos,
        uint256 badges,
        uint256 multiplier
    ) external onlyAuthorizedIssuer {
        uint256 score = (repos + badges) * multiplier;
        devRepScores[user] = score;
        emit RepScoreUpdated(user, score);
    }
}
