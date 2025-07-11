require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    spicy: {
      url: "https://spicy-rpc.chiliz.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 88882,
    },
    hardhat: {
      chainId: 31337,
    },
  },
};