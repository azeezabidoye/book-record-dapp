require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();
require("hardhat-deploy");
require("hardhat-gas-reporter");

const { PRIVATE_KEY, INFURA_SEPOLIA_URL, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: { artifacts: "./src/artifacts" },
  networks: {
    hardhat: { chainId: 1337 },
    sepolia: {
      url: INFURA_SEPOLIA_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
