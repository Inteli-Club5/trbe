require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const app = express();
app.use(express.json());

// Import routes
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api', healthRoutes);
app.use('/api', userRoutes);

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

const PORT = process.env.PORT || 3000;

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

// Serve the frontend for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve a simple HTML page that loads the Next.js app
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>TRIBE - Fan Engagement Platform</title>
      <meta name="description" content="The ultimate fan engagement platform with gamification, rewards, and community features">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
      </style>
    </head>
    <body class="bg-white dark:bg-black text-gray-900 dark:text-white">
      <div id="root">
        <div class="loading">
          <div class="text-center">
            <h1 class="text-2xl font-bold mb-4">TRIBE</h1>
            <p class="text-gray-600 dark:text-gray-400">Loading Fan Engagement Platform...</p>
            <div class="mt-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
      
      <script>
        // Simple React-like app for demonstration
        function createElement(type, props, ...children) {
          return { type, props: { ...props, children } };
        }
        
        function render(element, container) {
          if (typeof element === 'string') {
            container.appendChild(document.createTextNode(element));
            return;
          }
          
          const dom = document.createElement(element.type);
          
          if (element.props) {
            Object.keys(element.props).forEach(name => {
              if (name !== 'children') {
                if (name.startsWith('on')) {
                  dom.addEventListener(name.toLowerCase().substring(2), element.props[name]);
                } else {
                  dom.setAttribute(name, element.props[name]);
                }
              }
            });
          }
          
          if (element.props.children) {
            element.props.children.forEach(child => render(child, dom));
          }
          
          container.appendChild(dom);
        }
        
        // Simple app component
        function App() {
          return createElement('div', { className: 'min-h-screen bg-white dark:bg-black' },
            createElement('header', { className: 'bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4' },
              createElement('div', { className: 'flex items-center justify-between' },
                createElement('h1', { className: 'text-xl font-bold' }, 'TRIBE'),
                createElement('button', { 
                  className: 'px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded',
                  onClick: () => alert('Theme toggle clicked!')
                }, 'Toggle Theme')
              )
            ),
            createElement('main', { className: 'p-4' },
              createElement('div', { className: 'max-w-md mx-auto space-y-6' },
                createElement('div', { className: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6' },
                  createElement('h2', { className: 'text-lg font-semibold mb-4' }, 'Welcome to TRIBE'),
                  createElement('p', { className: 'text-gray-600 dark:text-gray-400 mb-4' }, 
                    'The ultimate fan engagement platform with gamification, rewards, and community features.'
                  ),
                  createElement('div', { className: 'space-y-3' },
                    createElement('div', { className: 'flex items-center gap-3' },
                      createElement('div', { className: 'w-3 h-3 bg-green-500 rounded-full' }),
                      createElement('span', null, 'Fan Club Management')
                    ),
                    createElement('div', { className: 'flex items-center gap-3' },
                      createElement('div', { className: 'w-3 h-3 bg-blue-500 rounded-full' }),
                      createElement('span', null, 'Reputation System')
                    ),
                    createElement('div', { className: 'flex items-center gap-3' },
                      createElement('div', { className: 'w-3 h-3 bg-purple-500 rounded-full' }),
                      createElement('span', null, 'Blockchain Integration')
                    )
                  )
                ),
                createElement('div', { className: 'text-center' },
                  createElement('p', { className: 'text-sm text-gray-500' }, 
                    'API endpoints available at /api/*'
                  ),
                  createElement('a', { 
                    href: '/api/health',
                    className: 'text-blue-600 hover:underline'
                  }, 'Check API Health')
                )
              )
            )
          );
        }
        
        // Render the app
        const root = document.getElementById('root');
        root.innerHTML = '';
        render(App(), root);
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;