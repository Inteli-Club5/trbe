const { ethers } = require('ethers');

// Web3 Authentication Middleware
function web3AuthMiddleware(req, res, next) {
  // Skip authentication for health check and public routes
  if (req.path === '/api/health' || req.path.startsWith('/api/football')) {
    return next();
  }

  const web3Address = req.headers['x-web3-address'];
  const web3Signature = req.headers['x-web3-signature'];
  const web3Timestamp = req.headers['x-web3-timestamp'];
  const web3Message = req.headers['x-web3-message'];

  // Check if all required headers are present
  if (!web3Address || !web3Signature || !web3Timestamp || !web3Message) {
    return res.status(401).json({
      error: 'Web3 authentication headers missing',
      required: ['x-web3-address', 'x-web3-signature', 'x-web3-timestamp', 'x-web3-message']
    });
  }

  try {
    // Validate timestamp (prevent replay attacks)
    const timestamp = parseInt(web3Timestamp);
    const now = Date.now();
    const timeWindow = 5 * 60 * 1000; // 5 minutes

    if (Math.abs(now - timestamp) > timeWindow) {
      return res.status(401).json({
        error: 'Request timestamp expired',
        timestamp,
        now,
        timeWindow
      });
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(web3Message, web3Signature);
    
    // Check if the recovered address matches the claimed address
    if (recoveredAddress.toLowerCase() !== web3Address.toLowerCase()) {
      return res.status(401).json({
        error: 'Invalid signature',
        recoveredAddress,
        claimedAddress: web3Address
      });
    }

    // Add user information to request
    req.user = {
      address: web3Address.toLowerCase(),
      authenticated: true,
      authMethod: 'web3'
    };

    // Log successful authentication
    console.log(`Web3 authentication successful for address: ${web3Address}`);

    next();
  } catch (error) {
    console.error('Web3 authentication error:', error);
    return res.status(401).json({
      error: 'Authentication failed',
      details: error.message
    });
  }
}

// Optional authentication middleware (for routes that can work with or without auth)
function optionalWeb3AuthMiddleware(req, res, next) {
  const web3Address = req.headers['x-web3-address'];
  const web3Signature = req.headers['x-web3-signature'];
  const web3Timestamp = req.headers['x-web3-timestamp'];
  const web3Message = req.headers['x-web3-message'];

  // If no Web3 headers, continue without authentication
  if (!web3Address || !web3Signature || !web3Timestamp || !web3Message) {
    req.user = {
      authenticated: false,
      authMethod: 'none'
    };
    return next();
  }

  try {
    // Validate timestamp
    const timestamp = parseInt(web3Timestamp);
    const now = Date.now();
    const timeWindow = 5 * 60 * 1000; // 5 minutes

    if (Math.abs(now - timestamp) > timeWindow) {
      req.user = {
        authenticated: false,
        authMethod: 'none'
      };
      return next();
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(web3Message, web3Signature);
    
    if (recoveredAddress.toLowerCase() === web3Address.toLowerCase()) {
      req.user = {
        address: web3Address.toLowerCase(),
        authenticated: true,
        authMethod: 'web3'
      };
    } else {
      req.user = {
        authenticated: false,
        authMethod: 'none'
      };
    }

    next();
  } catch (error) {
    console.error('Optional Web3 authentication error:', error);
    req.user = {
      authenticated: false,
      authMethod: 'none'
    };
    next();
  }
}

// Helper function to check if user is authenticated
function requireAuth(req, res, next) {
  if (!req.user || !req.user.authenticated) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please connect your wallet to access this resource'
    });
  }
  next();
}

// Helper function to get user address
function getUserAddress(req) {
  return req.user?.address;
}

// Helper function to check if user is authenticated
function isAuthenticated(req) {
  return req.user?.authenticated === true;
}

module.exports = {
  web3AuthMiddleware,
  optionalWeb3AuthMiddleware,
  requireAuth,
  getUserAddress,
  isAuthenticated
}; 