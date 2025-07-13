// utils/contracts.js
const { ethers } = require('ethers');
const fanClubsAbiJson = require('../abis/FanClubs.json');
const scoreUserAbiJson = require('../abis/ScoreUser.json');

// Variáveis de ambiente
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contratos
const fanClubsContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS_FAN_CLUBS,
  fanClubsAbiJson.abi,
  wallet
);

const scoreUserContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS_SCORE_USER,
  scoreUserAbiJson.abi,
  wallet
);

// Funções utilitárias
const isValidAddress = (address) => ethers.isAddress(address);

// ABI básica para ERC20
const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function decimals() external view returns (uint8)"
];

module.exports = {
  provider,
  wallet,
  scoreUserContract,
  fanClubsContract,
  isValidAddress,
  erc20Abi
};