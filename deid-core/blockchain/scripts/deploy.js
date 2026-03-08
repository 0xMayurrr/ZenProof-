const hre = require("hardhat");

async function main() {
    const account = (await hre.ethers.getSigners())[0];
    console.log("Deploying contracts with the account:", account.address);

    // Deploying CredentialRegistry
    const CredentialRegistry = await hre.ethers.getContractFactory("CredentialRegistry");
    const credentialRegistry = await CredentialRegistry.deploy();

    await credentialRegistry.waitForDeployment();
    const address = await credentialRegistry.getAddress();

    console.log("CredentialRegistry deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
