const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleLending", function () {
  let simpleLending, usdcToken;
  let owner, user1, user2;
  let MockUSDC;
  const depositAmountETH = ethers.utils.parseEther("1"); // 1 ETH
  const depositAmountUSDC = ethers.utils.parseUnits('1000', 6); // 1000 USDC
  const fundingAmountUSDC = ethers.utils.parseUnits('5000', 6); // 5000 USDC for contract funding

  beforeEach(async function () {
    // Deploy Mock USDC Token
    MockUSDC = await ethers.getContractFactory("USDCToken");
    usdcToken = await MockUSDC.deploy(ethers.utils.parseUnits('10000', 6)); // 10,000 USDC
    await usdcToken.deployed();

    console.log("Mock USDC Token deployed to:", usdcToken.address);

    // Deploy SimpleLending contract
    const SimpleLending = await ethers.getContractFactory("SimpleLending");
    simpleLending = await SimpleLending.deploy(usdcToken.address);
    await simpleLending.deployed();
    console.log("SimpleLending deployed to:", simpleLending.address);

    [owner, user1, user2] = await ethers.getSigners();

    // Fund the SimpleLending contract with USDC for interest payouts
    await usdcToken.transfer(simpleLending.address, fundingAmountUSDC);
    console.log("5000 USDC transferred to SimpleLending contract for interest payouts.");

    // Transfer USDC to user1 and user2
    await usdcToken.transfer(user1.address, depositAmountUSDC);
    await usdcToken.transfer(user2.address, depositAmountUSDC);
    console.log("1000 USDC transferred to user 1 and user 2.");

    // Send 2 ETH to user1 and user2 from owner for collateral
    await owner.sendTransaction({ to: user1.address, value: ethers.utils.parseEther("2") });
    await owner.sendTransaction({ to: user2.address, value: ethers.utils.parseEther("2") });
    console.log("2 ETH sent to user 1 and user 2 for collateral.");
  });

  describe("ETH Deposits and Withdrawals", function () {
    it("Should allow users to deposit ETH", async function () {
      await simpleLending.connect(user1).depositETH({ value: depositAmountETH });
      const depositDetails = await simpleLending.getDepositDetails(user1.address);
      expect(depositDetails.ethAmount).to.equal(depositAmountETH);
      console.log(`User 1 deposited ${ethers.utils.formatEther(depositAmountETH)} ETH.`);
    });

    it("Should allow users to withdraw their ETH deposits", async function () {
      await simpleLending.connect(user1).depositETH({ value: depositAmountETH });
      await simpleLending.connect(user1).withdrawFunds();
      const depositDetails = await simpleLending.getDepositDetails(user1.address);
      expect(depositDetails.ethAmount).to.equal(0);
      console.log(`User 1 withdrew their ETH deposit.`);
    });
  });

  describe("USDC Deposits and Withdrawals", function () {
    it("Should allow users to deposit USDC", async function () {
      await usdcToken.connect(user1).approve(simpleLending.address, depositAmountUSDC);
      await simpleLending.connect(user1).depositUSDC(depositAmountUSDC);
      const depositDetails = await simpleLending.getDepositDetails(user1.address);
      expect(depositDetails.usdcAmount).to.equal(depositAmountUSDC);
      console.log(`User 1 deposited ${ethers.utils.formatUnits(depositAmountUSDC, 6)} USDC.`);
    });

    it("Should allow users to withdraw their USDC deposits after 2 years", async function () {
      await usdcToken.connect(user1).approve(simpleLending.address, depositAmountUSDC);
      await simpleLending.connect(user1).depositUSDC(depositAmountUSDC);
      
      // Simulate 2 years of time passing
      await ethers.provider.send("evm_increaseTime", [2 * 365 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
    
      const user1BalanceBefore = await usdcToken.balanceOf(user1.address);
      await simpleLending.connect(user1).withdrawFunds();

      const user1BalanceAfter = await usdcToken.balanceOf(user1.address);
    
      const totalWithdrawn = user1BalanceAfter.sub(user1BalanceBefore);
      console.log(`User 1 withdrew a total of ${ethers.utils.formatUnits(totalWithdrawn, 6)} USDC (deposit + interest) after 2 years.`);
    });
  });

  // Additional tests for borrowing, interest calculations, and error scenarios can be added here
});
