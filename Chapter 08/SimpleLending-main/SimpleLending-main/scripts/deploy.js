const { ethers } = require("hardhat");

async function main() {
    // Retrieve the account that will be used for deploying contracts
    const [deployer] = await ethers.getSigners();

    // Log the deployer's address
    console.log("Deploying contracts with the account:", deployer.address);

    // Specify the initial supply for the USDCToken
    const initialUsdcSupply = ethers.utils.parseUnits("1000000", 6); // For example, 1,000,000 USDC with 6 decimals

    // Deploy the USDCToken contract
    const USDCToken = await ethers.getContractFactory("USDCToken");
    const usdcToken = await USDCToken.deploy(initialUsdcSupply);

    // Wait for the USDCToken contract to be deployed
    await usdcToken.deployed();
    console.log("USDCToken deployed to:", usdcToken.address);

    // Now deploy the SimpleLending contract with the address of the deployed USDCToken
    const SimpleLending = await ethers.getContractFactory("SimpleLending");
    const simpleLending = await SimpleLending.deploy(usdcToken.address);

    // Wait for the SimpleLending contract to be deployed
    await simpleLending.deployed();
    console.log("SimpleLending deployed to:", simpleLending.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
