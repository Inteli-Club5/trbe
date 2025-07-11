require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const RPC_URL = process.env.RPC_URL;
const CHAIN_ID = Number(process.env.CHAIN_ID);
const CONTRACT_ADDRESS_SCORE_USER = process.env.CONTRACT_ADDRESS_SCORE_USER;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !CHAIN_ID || !CONTRACT_ADDRESS_SCORE_USER || !PRIVATE_KEY) {
  console.error('Error: Missing env variables');
  process.exit(1);
}

const ABI_PATH = path.join(__dirname, 'abis', 'ScoreUser.json');

let ScoreUserABI;
try {
  const abiFile = fs.readFileSync(ABI_PATH, 'utf8');
  ScoreUserABI = JSON.parse(abiFile).abi || JSON.parse(abiFile);
} catch (error) {
  console.error('Failed to load ABI file:', error.message);
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);
const wallet = new ethers.Wallet(PRIVATE_KEY).connect(provider);
const scoreUserContract = new ethers.Contract(CONTRACT_ADDRESS_SCORE_USER, ScoreUserABI, wallet);

function isValidAddress(address) {
  try {
    ethers.getAddress(address); 
    return true;
  } catch {
    return false;
  }
}

app.post('/calculateReputation', async (req, res) => {
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

app.get('/getReputation/:userAddress', async (req, res) => {
  const userAddress = req.params.userAddress;

  if (!isValidAddress(userAddress)) {
    return res.status(400).json({ error: 'Invalid user address.' });
  }

  try {
    const reputation = await scoreUserContract.getReputation(userAddress);
    res.status(200).json({ user: userAddress, reputation: reputation.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Error getting reputation from contract.', details: error.message });
  }
});

const CONTRACT_ADDRESS_FAN_CLUBS = process.env.CONTRACT_ADDRESS_FAN_CLUBS;
const ABI_PATH_TWO = path.join(__dirname, 'abis', 'FanClubs.json');

let FanClubsABI;

try {
  const abiFile = fs.readFileSync(ABI_PATH_TWO, 'utf8');
  FanClubsABI = JSON.parse(abiFile).abi || JSON.parse(abiFile);
} catch (error) {
  console.error('Failed to load ABI file:', error.message);
  process.exit(1);
}

const fanClubsContract = new ethers.Contract(CONTRACT_ADDRESS_FAN_CLUBS, FanClubsABI, wallet);

app.post('/fanclub/create', async (req, res) => {
  try {
    const { fanClubId, price } = req.body;
    if (!fanClubId || price === undefined) return res.status(400).json({ error: 'fanClubId and price are required' });

    const tx = await fanClubsContract.createFanClub(fanClubId, ethers.parseUnits(price.toString(), 'wei'));
    await tx.wait();

    res.json({ message: 'Fan club created', txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fanclub/:fanClubId/checkMember/:user', async (req, res) => {
  try {
    const { fanClubId, user } = req.params;
    const isMember = await fanClubsContract.checkMember(fanClubId, user);
    res.json({ isMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fanclub/:fanClubId/balance', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const balance = await fanClubsContract.getBalance(fanClubId);
    res.json({ balance: balance.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fanclub/:fanClubId/price', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const price = await fanClubsContract.getJoinPrice(fanClubId);
    res.json({ price: price.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fanclub/:fanClubId/members', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const members = await fanClubsContract.getMembers(fanClubId);
    res.json({ members });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fanclub/:fanClubId/owner', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const owner = await fanClubsContract.getOwner(fanClubId);
    res.json({ owner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/fanclub/:fanClubId/join', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const price = await fanClubsContract.getJoinPrice(fanClubId);

    const tx = await fanClubsContract.join(fanClubId, { value: price });
    await tx.wait();

    res.json({ message: 'Joined fan club', txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/fanclub/:fanClubId/leave', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const tx = await fanClubsContract.leave(fanClubId);
    await tx.wait();

    res.json({ message: 'Left fan club', txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/fanclub/:fanClubId/updatePrice', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { newPrice } = req.body;
    if (newPrice === undefined) return res.status(400).json({ error: 'newPrice is required' });

    const tx = await fanClubsContract.updatePrice(fanClubId, ethers.parseUnits(newPrice.toString(), 'wei'));
    await tx.wait();

    res.json({ message: 'Price updated', txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/fanclub/:fanClubId/withdraw', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: 'amount is required' });

    const tx = await fanClubsContract.withdraw(fanClubId, ethers.parseUnits(amount.toString(), 'wei'));
    await tx.wait();

    res.json({ message: 'Withdraw successful', txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Trybe Backend API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;