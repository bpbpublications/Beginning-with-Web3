// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleLending {
    IERC20 public usdcToken;
    uint256 public constant INTEREST_RATE = 80; // 80%
    uint256 public constant ETH_TO_USDC_RATE = 3000; // 1 ETH = 3000 USDC
    uint256 public constant COLLATERAL_FACTOR = 150; // 150% Collateral

    struct Deposit {
        uint256 usdcAmount;
        uint256 ethAmount;
        uint256 timeOfDeposit;
    }

    struct Borrow {
        uint256 usdcAmount;
        uint256 ethCollateral;
    }

    mapping(address => Deposit) private deposits;
    mapping(address => Borrow) private borrows;

    constructor(address _usdcAddress) {
        usdcToken = IERC20(_usdcAddress);
    }

    function depositUSDC(uint256 amount) external {
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        deposits[msg.sender].usdcAmount += amount;
        deposits[msg.sender].timeOfDeposit = block.timestamp;
    }

    function depositETH() external payable {
        deposits[msg.sender].ethAmount += msg.value;
        deposits[msg.sender].timeOfDeposit = block.timestamp;
    }

    function withdrawFunds() external {
        Deposit memory userDeposit = deposits[msg.sender];
        require(userDeposit.usdcAmount > 0 || userDeposit.ethAmount > 0, "No deposit found");

        uint256 interest = calculateInterest(userDeposit.usdcAmount, userDeposit.timeOfDeposit);
        require(usdcToken.transfer(msg.sender, userDeposit.usdcAmount + interest), "Withdrawal failed");

        payable(msg.sender).transfer(userDeposit.ethAmount);

        deposits[msg.sender] = Deposit(0, 0, 0);
    }

    function calculateInterest(uint256 amount, uint256 timeOfDeposit) public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - timeOfDeposit;
        uint256 interestPerYear = (amount * INTEREST_RATE) / 100;
        uint256 interest = (interestPerYear * timeElapsed) / 365 days;
        return interest;
    }

    function borrowUSDC(uint256 usdcAmount) external payable {
        uint256 totalCollateralInUSDC = deposits[msg.sender].ethAmount * ETH_TO_USDC_RATE;
        uint256 requiredCollateral = usdcAmount * COLLATERAL_FACTOR / 100;
        require(totalCollateralInUSDC >= requiredCollateral, "Insufficient collateral");

        require(usdcToken.transfer(msg.sender, usdcAmount), "Transfer failed");
        borrows[msg.sender] = Borrow(usdcAmount, msg.value);
    }

    function getDepositDetails(address depositor) external view returns (Deposit memory) {
        return deposits[depositor];
    }

         
      
      }
