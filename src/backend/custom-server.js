const express = require('express');
const next = require('next');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Prepare the Next.js app
const app = next({ dev, hostname, port, dir: './frontend' });
const handle = app.getRequestHandler();

// Import routes
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  // Use API routes
  server.use('/api', healthRoutes);
  server.use('/api', userRoutes);

  // Blockchain setup
  const RPC_URL = process.env.RPC_URL;
  const CHAIN_ID = Number(process.env.CHAIN_ID);
  const CONTRACT_ADDRESS_SCORE_USER = process.env.CONTRACT_ADDRESS_SCORE_USER;
  const CONTRACT_ADDRESS_FAN_CLUBS = process.env.CONTRACT_ADDRESS_FAN_CLUBS;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!RPC_URL || !CHAIN_ID || !CONTRACT_ADDRESS_SCORE_USER || !PRIVATE_KEY || !CONTRACT_ADDRESS_FAN_CLUBS) {
    console.error('Error: Missing env variables');
    process.exit(1);
  }

  const ABI_PATH_SCORE_USER = path.join(__dirname, 'abis', 'ScoreUser.json');
  const ABI_PATH_FAN_CLUBS = path.join(__dirname, 'abis', 'FanClubs.json');
  const erc20Abi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function balanceOf(address owner) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
  ];

  let ScoreUserABI, FanClubsABI;
  try {
    const abiScore = fs.readFileSync(ABI_PATH_SCORE_USER, 'utf8');
    ScoreUserABI = JSON.parse(abiScore).abi || JSON.parse(abiScore);
  } catch (error) {
    console.error('Failed to load ScoreUser ABI file:', error.message);
    process.exit(1);
  }

  try {
    const abiFan = fs.readFileSync(ABI_PATH_FAN_CLUBS, 'utf8');
    FanClubsABI = JSON.parse(abiFan).abi || JSON.parse(abiFan);
  } catch (error) {
    console.error('Failed to load FanClubs ABI file:', error.message);
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);
  const wallet = new ethers.Wallet(PRIVATE_KEY).connect(provider);

  const scoreUserContract = new ethers.Contract(CONTRACT_ADDRESS_SCORE_USER, ScoreUserABI, wallet);
  const fanClubsContract = new ethers.Contract(CONTRACT_ADDRESS_FAN_CLUBS, FanClubsABI, wallet);

  function isValidAddress(address) {
    try {
      ethers.getAddress(address);
      return true;
    } catch {
      return false;
    }
  }

  // Add all your blockchain routes here
  server.post('/api/calculateReputation', async (req, res) => {
    const { user, likes, comments, retweets, hashtag, checkEvents, gamesId, reports } = req.body;

    if (
      !user ||
      likes === undefined ||
      comments === undefined ||
      retweets === undefined ||
      hashtag === undefined ||
      checkEvents === undefined ||
      gamesId === undefined ||
      reports === undefined
    ) {
      return res.status(400).json({ error: 'All parameters are required.' });
    }

    if (!isValidAddress(user)) {
      return res.status(400).json({ error: 'Invalid user address.' });
    }

    try {
      const tx = await scoreUserContract.calculateReputation(
        user,
        likes,
        comments,
        retweets,
        hashtag,
        checkEvents,
        gamesId,
        reports
      );

      await tx.wait();

      res.status(200).json({ message: 'Reputation calculated successfully!', transactionHash: tx.hash });
    } catch (error) {
      res.status(500).json({ error: 'Error calculating reputation on contract.', details: error.message });
    }
  });

  // Add all other blockchain routes here...
  // (Copy all the routes from server.js)

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}); 