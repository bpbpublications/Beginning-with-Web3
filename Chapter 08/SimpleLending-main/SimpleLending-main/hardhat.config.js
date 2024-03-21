require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // Hardhat Network configuration
      // The default configuration is usually sufficient for local development.
      // You can customize it if needed (e.g., setting a fixed block gas limit).
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
  // Add any additional configurations here.
};
