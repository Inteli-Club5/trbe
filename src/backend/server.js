require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const cors = require('cors');

const app = express();

// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-domain.railway.app'
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Import routes
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const clubsRoutes = require('./routes/clubs');
const fanGroupsRoutes = require('./routes/fan-groups');
const eventsRoutes = require('./routes/events');
const tasksRoutes = require('./routes/tasks');
const badgesRoutes = require('./routes/badges');
const checkInsRoutes = require('./routes/check-ins');
const gamesRoutes = require('./routes/games');
const notificationsRoutes = require('./routes/notifications');
const transactionsRoutes = require('./routes/transactions');
const footballRoutes = require('./routes/football');

// Use routes
app.use('/api', healthRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', clubsRoutes);
app.use('/api', fanGroupsRoutes);
app.use('/api', eventsRoutes);
app.use('/api', tasksRoutes);
app.use('/api', badgesRoutes);
app.use('/api', checkInsRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/football', footballRoutes);

// Debug endpoint to check file structure
app.get('/api/debug/files', (req, res) => {
  const publicDir = path.join(__dirname, 'public');
  const outDir = path.join(publicDir, 'out');
  
  try {
    const files = [];
    
    if (fs.existsSync(publicDir)) {
      const publicFiles = fs.readdirSync(publicDir, { recursive: true });
      files.push({ directory: 'public', files: publicFiles });
    }
    
    if (fs.existsSync(outDir)) {
      const outFiles = fs.readdirSync(outDir, { recursive: true });
      files.push({ directory: 'out', files: outFiles });
    }
    
    // Check for specific HTML files
    const htmlFiles = [];
    const possibleHtmlPaths = [
      path.join(__dirname, 'public/out/index.html'),
      path.join(__dirname, 'public/out/index/index.html')
    ];
    
    possibleHtmlPaths.forEach(filePath => {
      htmlFiles.push({
        path: filePath,
        exists: fs.existsSync(filePath),
        size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0
      });
    });
    
    res.json({
      publicDir: publicDir,
      outDir: outDir,
      exists: {
        public: fs.existsSync(publicDir),
        out: fs.existsSync(outDir)
      },
      files: files,
      htmlFiles: htmlFiles,
      currentDir: __dirname
    });
  } catch (error) {
    res.json({
      error: error.message,
      publicDir: publicDir,
      outDir: outDir,
      currentDir: __dirname
    });
  }
});

// Serve static files from the frontend build
app.use('/_next', express.static(path.join(__dirname, 'public/.next')));
app.use('/public', express.static(path.join(__dirname, 'public/public')));

// Serve Next.js static files
app.use('/_next/static', express.static(path.join(__dirname, 'public/.next/static')));
app.use('/_next/chunks', express.static(path.join(__dirname, 'public/.next/chunks')));
app.use('/_next/webpack', express.static(path.join(__dirname, 'public/.next/webpack')));

const PORT = process.env.PORT || 5001;

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

app.get('/fanclubs', async (req, res) => {
  try {
    const fanClubIds = await fanClubsContract.getAllFanClubIds();
    res.json({ fanClubIds });
  } catch (error) {
    console.error('Failed to fetch fan club IDs:', error);
    res.status(500).json({ error: 'Failed to fetch fan club IDs' });
  }
});


app.post('/fanclub/create', async (req, res) => {
  try {
    const { fanClubId, price } = req.body;

    if (!fanClubId || price === undefined) {
      return res.status(400).json({ error: 'fanClubId and price are required' });
    }

    const priceBigInt = ethers.parseUnits(price.toString(), 'ether');

    const tx = await fanClubsContract.createFanClub(fanClubId, priceBigInt);
    await tx.wait();

    res.json({ message: 'Fan club created', txHash: tx.hash });
  } catch (error) {
    console.error('[CREATE FANCLUB ERROR]', error);
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

    const amountWei = ethers.BigNumber.from(amount.toString());
    const tx = await fanClubsContract.withdraw(fanClubId, amountWei);
    await tx.wait();

    res.json({ message: 'Withdraw successful', txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/fanclub/:fanClubId/depositFanTokens', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { tokenAddress, amount } = req.body;

    if (!tokenAddress || !amount) {
      return res.status(400).json({ error: 'tokenAddress and amount are required' });
    }

    const amountParsed = ethers.parseUnits(amount.toString(), 18);
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);

    const approveTx = await tokenContract.approve(CONTRACT_ADDRESS_FAN_CLUBS, amountParsed);
    await approveTx.wait();

    const tx = await fanClubsContract.depositFanTokens(fanClubId, tokenAddress, amountParsed);
    await tx.wait();

    res.json({ message: 'Fan tokens deposited successfully', txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

app.get('/fanclub/:fanClubId/fanTokenBalance/:tokenAddress', async (req, res) => {
  try {
    const { fanClubId, tokenAddress } = req.params;

    const balance = await fanClubsContract.getFanTokenBalance(fanClubId, tokenAddress);
    const decimals = 18; 

    const balanceFormatted = ethers.formatUnits(balance, decimals);

    res.json({ balance: balanceFormatted.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

app.post('/fanclub/:fanClubId/rewardFanToken', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { tokenAddress, recipient, amount } = req.body;

    if (!tokenAddress || !recipient || !amount) {
      return res.status(400).json({ error: 'tokenAddress, recipient, and amount are required' });
    }

    const amountParsed = ethers.parseUnits(amount.toString(), 18);
    const tx = await fanClubsContract.rewardFanToken(fanClubId, tokenAddress, recipient, amountParsed);
    await tx.wait();

    res.json({ message: 'Fan token rewarded successfully', txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

app.post('/fanclub/:fanClubId/withdrawFanTokens', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { tokenAddress, amount } = req.body;

    if (!tokenAddress || !amount) {
      return res.status(400).json({ error: 'tokenAddress and amount are required' });
    }

    const amountParsed = ethers.parseUnits(amount.toString(), 18);
    const tx = await fanClubsContract.withdrawFanTokens(fanClubId, tokenAddress, amountParsed);
    await tx.wait();

    res.json({ message: 'Fan tokens withdrawn successfully', txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

app.post('/deploy/nftBadge', async (req, res) => {
  try {
    const { name, symbol, baseURI } = req.body;

    if (!name || !symbol || !baseURI) {
      return res.status(400).json({ error: 'name, symbol and baseURI are required' });
    }

    const artifactPathNFTBadge = path.join(__dirname, 'abis', 'NFTBadge.json');

    const artifact = JSON.parse(fs.readFileSync(artifactPathNFTBadge, 'utf8'));
    const { abi, bytecode } = artifact;

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    const contract = await factory.deploy(name, symbol, baseURI);
    await contract.waitForDeployment();

    const deployedAddress = await contract.getAddress();

    res.status(200).json({
      message: 'NFTBadge deployed successfully',
      contractAddress: deployedAddress,
      name,
      symbol,
      baseURI
    });
  } catch (error) {
    console.error('[DEPLOY NFTBADGE ERROR]', error);
    res.status(500).json({ error: error.message || error.toString() });
  }
});

app.post('/mint/nftBadge', async (req, res) => {
  try {
    const { contractAddress, to } = req.body;

    if (!contractAddress || !to) {
      return res.status(400).json({ error: 'contractAddress and to are required' });
    }

    const artifactPathNFTBadge = path.join(__dirname, 'abis', 'NFTBadge.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPathNFTBadge, 'utf8'));
    const { abi } = artifact;

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const tx = await contract.mint(to);
    const receipt = await tx.wait();
    const tokenId = BigInt(receipt.logs[0].topics[3]).toString();

    res.json({
      transactionHash: tx.hash,
      tokenId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/approve/nftBadge', async (req, res) => {
  try {
    const { contractAddress, approvedAddress, tokenId } = req.body;

    if (!contractAddress || !approvedAddress || !tokenId) {
      return res.status(400).json({ error: 'contractAddress, approvedAddress and tokenId are required' });
    }

    const artifactPathNFTBadge = path.join(__dirname, 'abis', 'NFTBadge.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPathNFTBadge, 'utf8'));
    const { abi } = artifact;

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const owner = await contract.ownerOf(tokenId);
    console.log('Owner of token:', owner);
    console.log('Wallet address:', wallet.address);

    const tx = await contract.approve(approvedAddress, tokenId);
    const receipt = await tx.wait();

    res.json({
      message: 'NFT approved successfully',
      transactionHash: tx.hash,
      receipt,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/fanclub/:fanClubId/depositFanNFT', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { nftAddress, tokenId } = req.body;

    if (!nftAddress || tokenId === undefined)
      return res.status(400).json({ error: 'nftAddress and tokenId are required' });

    const tx = await fanClubsContract.depositFanNFT(fanClubId, nftAddress, tokenId);
    await tx.wait();

    res.json({ message: 'NFT deposited successfully', txHash: tx.hash });
  } catch (error) {
    console.error('[DEPOSIT FAN NFT ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/fanclub/:fanClubId/withdrawFanNFT', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { nftAddress, tokenId } = req.body;

    if (!nftAddress || tokenId === undefined)
      return res.status(400).json({ error: 'nftAddress and tokenId are required' });

    const tx = await fanClubsContract.withdrawFanNFT(fanClubId, nftAddress, tokenId);
    await tx.wait();

    res.json({ message: 'NFT withdrawn successfully', txHash: tx.hash });
  } catch (error) {
    console.error('[WITHDRAW FAN NFT ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/fanclub/:fanClubId/rewardFanNFT', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { nftAddress, recipient, tokenId } = req.body;

    if (!nftAddress || !recipient || tokenId === undefined)
      return res.status(400).json({ error: 'nftAddress, recipient, and tokenId are required' });

    const tx = await fanClubsContract.rewardFanNFT(fanClubId, nftAddress, recipient, tokenId);
    await tx.wait();

    res.json({ message: 'NFT rewarded successfully', txHash: tx.hash });
  } catch (error) {
    console.error('[REWARD FAN NFT ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/marketplace/create', async (req, res) => {
  try {
    const {fanClubId, tokenAddress} = req.body;

    const tx = await fanClubsContract.createMarketplace(fanClubId, tokenAddress);
    await tx.wait();

    res.json({ message: 'Marketplace created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create marketplace' });
  }
});

app.post('/marketplace/list', async (req, res) => {
  try {
    const { fanClubId, nftAddress, tokenId, price} = req.body;

    const parsedPrice = ethers.utils.parseUnits(price.toString(), 18)

    const tx = await fanClubsContract.listItem(fanClubId, nftAddress, tokenId, parsedPrice);
    await tx.wait();

    res.json({ message: 'NFT listed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list NFT' });
  }
});

app.post('/marketplace/delist', async (req, res) => {
  try {
    const { fanClubId, nftAddress, tokenId} = req.body;

    const tx = await fanClubsContract.delistItem(fanClubId, nftAddress, tokenId);
    await tx.wait();

    res.json({ message: 'NFT delisted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delist NFT' });
  }
});

app.post('/marketplace/buy', async (req, res) => {
  try {
    const { fanClubId, tokenAddress, nftAddress, tokenId} = req.body;

    const erc20 = new ethers.Contract(tokenAddress, erc20Abi, wallet);
    await erc20.approve(tokenAddress, price);

    const tx = await fanClubsContract.buy(fanClubId, nftAddress, tokenId);
    await tx.wait();

    res.json({ message: 'NFT purchased successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to buy NFT' });
  }
});

app.get('/marketplace/items/:fanClubId', async (req, res) => {
  try {
    const fanClubId = req.params.fanClubId;
    const items = await fanClubsContract.getItems(fanClubId);

    const filtered = items.filter(item => item.isListed);

    res.json({ items: filtered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
});


app.get('/fanclub/:fanClubId/getFanNFT', async (req, res) => {
  try {
    const { fanClubId } = req.params;
    const { nftAddress, tokenId } = req.query;

    if (!nftAddress || tokenId === undefined)
      return res.status(400).json({ error: 'nftAddress and tokenId are required' });

    const result = await fanClubsContract.getFanNFT(fanClubId, nftAddress, tokenId);
    res.json({ ownedByFanClub: result });
  } catch (error) {
    console.error('[GET FAN NFT ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve the frontend for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Try to serve the Next.js app files
  const possiblePaths = [
    path.join(__dirname, 'public/.next/server/app/page.html'),
    path.join(__dirname, 'public/.next/server/pages/index.html'),
    path.join(__dirname, 'public/.next/static/index.html'),
    path.join(__dirname, 'public/.next/index.html')
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log('Serving Next.js app from:', filePath);
      return res.sendFile(filePath);
    }
  }
  
  // If no Next.js files found, show debug info
  console.log('No Next.js files found');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TRBE - Frontend Not Found</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 5px; }
        .debug { background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 3px; }
      </style>
    </head>
    <body>
      <h1>TRBE - Frontend Issue</h1>
      <div class="error">
        <h2>Next.js frontend not found</h2>
        <p>The Next.js build files are not being generated or copied correctly.</p>
      </div>
      <div class="debug">
        <h3>Debug Info:</h3>
        <p><a href="/api/debug/files">Check file structure</a></p>
        <p>API is working: <a href="/api/health">Health Check</a></p>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;