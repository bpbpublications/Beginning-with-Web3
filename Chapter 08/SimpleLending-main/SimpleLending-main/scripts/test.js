const hre = require("hardhat");
const ethers = hre.ethers;

// Function to advance time on the blockchain
async function advanceTime(timeInSeconds) {
    await hre.network.provider.send("evm_increaseTime", [timeInSeconds]);
    await hre.network.provider.send("evm_mine");
}

async function main() {
    // Deploy Mock USDC Token
    const MockUSDC = await ethers.getContractFactory("USDCToken");
    const usdcToken = await MockUSDC.deploy(ethers.utils.parseUnits('10000', 6)); // 10,000 USDC
    await usdcToken.deployed();
    console.log("Mock USDC Token deployed to:", usdcToken.address);

    // Deploy SimpleLending contract
    const SimpleLending = await ethers.getContractFactory("SimpleLending");
    const simpleLending = await SimpleLending.deploy(usdcToken.address);
    await simpleLending.deployed();
    console.log("SimpleLending deployed to:", simpleLending.address);

    const [owner, user1, user2] = await ethers.getSigners();

    // Fund the SimpleLending contract with additional USDC for interest payouts
    const fundingAmount = ethers.utils.parseUnits('1000', 6); // 1000 USDC
    await usdcToken.transfer(simpleLending.address, fundingAmount);
    console.log("1000 USDC transferred to SimpleLending contract for interest payouts.");

    // Send 1 ETH to user1 from owner for gas fees
    let tx = await owner.sendTransaction({
        to: user1.address,
        value: ethers.utils.parseEther("1.0") // 1 ETH
    });
    await tx.wait();
    console.log("1 ETH sent to user 1 for gas.");

    // Send 2 ETH to user2 from owner for gas fees and collateral
    tx = await owner.sendTransaction({
        to: user2.address,
        value: ethers.utils.parseEther("2.0") // 2 ETH
    });
    await tx.wait();
    console.log("2 ETH sent to user 2 for gas and collateral.");

    // Transfer 100 USDC to user1
    const transferAmount = ethers.utils.parseUnits('100', 6); // 100 USDC
    await usdcToken.transfer(user1.address, transferAmount);
    console.log("100 USDC transferred to user 1.");

    // Approve and Deposit 100 USDC to SimpleLending by user1
    await usdcToken.connect(user1).approve(simpleLending.address, transferAmount);
    await simpleLending.connect(user1).depositUSDC(transferAmount);
    console.log("100 USDC deposited by user 1.");

    // Simulate time passing to represent 1 year
    console.log("Advancing time to simulate 1 year...");
    await advanceTime(365 * 24 * 60 * 60); // Advance time by 1 year (in seconds)

    // Withdraw funds by user1 and log the amount withdrawn
    const user1BalanceBefore = await usdcToken.balanceOf(user1.address);
    await simpleLending.connect(user1).withdrawFunds();
    const user1BalanceAfter = await usdcToken.balanceOf(user1.address);
    const withdrawnAmount = user1BalanceAfter.sub(user1BalanceBefore);
    console.log(`Amount withdrawn by user 1: ${ethers.utils.formatUnits(withdrawnAmount, 6)} USDC`);

    // User 2 deposits ETH as collateral
    const collateralAmount = ethers.utils.parseEther("1.5"); // 1.5 ETH
    await simpleLending.connect(user2).depositETH({ value: collateralAmount });
    console.log(`1.5 ETH deposited as collateral by user 2.`);

    // User 2 borrows USDC
    const borrowAmount = ethers.utils.parseUnits('100', 6); // 100 USDC
    await simpleLending.connect(user2).borrowUSDC(borrowAmount);
    console.log("100 USDC borrowed by user 2.");

    // Additional steps for user 2 can be added here if needed
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
