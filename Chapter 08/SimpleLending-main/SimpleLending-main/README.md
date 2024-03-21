# SimpleLending Project

SimpleLending is a blockchain-based lending application built on the Ethereum network. It is designed to demonstrate a basic lending and interest accrual system using smart contracts.

## Prerequisites

### Node.js Compatibility

To ensure compatibility and avoid certain errors (such as `ERR_OSSL_EVP_UNSUPPORTED` in Node.js 17+), it is recommended to use Node.js version 16. You can manage different Node.js versions using Node Version Manager (nvm).

#### Install Node Version Manager (nvm)

- **For Windows**: Use [nvm-windows](https://github.com/coreybutler/nvm-windows).
   - Download and install `nvm-setup.zip` from the [latest release](https://github.com/coreybutler/nvm-windows/releases).

#### Install a Compatible Node.js Version

1. Open a command prompt or PowerShell as an administrator.
2. Install Node.js version 16 and switch to it:
   ```bash
   nvm install 16
   nvm use 16
   ```
   This sets your Node.js runtime to version 16.

## Project Setup

### Install Dependencies

Navigate to your project directory and install the necessary dependencies:

```bash
npm install
```

### Compiling the Contract

Use Hardhat to compile your smart contracts:

```bash
npx hardhat compile
```

### Running Tests

To run tests for your smart contracts:

```bash
npx hardhat test
```

### Deploying the Contract

Deploy your contract to a local testnet or Ethereum network:

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

Replace `<network-name>` with your desired network. For test with local hardhat network, you can use "hardhat" as network-name.

## Interacting with the Contract

### Deposits and Withdrawals

- Users can make deposits to and withdrawals from the contract.
- The contract calculates interest based on the time elapsed since the deposit.


## Contributing

Contributions to the SimpleLending project are welcome. Please ensure that your code adheres to the project standards and guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*This README provides a basic overview of the SimpleLending project. Adjust and expand as needed to fit the specific details and requirements of your project.*
