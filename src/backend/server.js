require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const cors = require('cors');
const app = express();

// Enable CORS for frontend communication
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

if (process.env.NODE_ENV === 'production') {
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  // Add Railway preview URLs
  allowedOrigins.push('https://your-domain.railway.app');
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
const web3Routes = require('./routes/web3');

// Use routes
app.use('/api', healthRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', clubsRoutes);
app.use('/api/fan-groups', fanGroupsRoutes);
app.use('/api', eventsRoutes);
app.use('/api', tasksRoutes);
app.use('/api', badgesRoutes);
app.use('/api', checkInsRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/web3', web3Routes);

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