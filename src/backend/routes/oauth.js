const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';
const SCOPES = ['tweet.read', 'users.read', 'offline.access', 'like.read', 'follows.read'];

function base64URLEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

// Start Twitter OAuth flow
router.get('/twitter/start', (req, res) => {
  try {
    // Generate code verifier and challenge
    const codeVerifier = base64URLEncode(crypto.randomBytes(32));
    req.session.codeVerifier = codeVerifier;

    const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));
    req.session.state = crypto.randomBytes(16).toString('hex');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(' '),
      state: req.session.state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    req.session.save(() => {
      res.redirect(`${AUTH_URL}?${params.toString()}`);
    });
  } catch (error) {
    console.error('Error starting Twitter auth:', error);
    res.status(500).json({ success: false, message: 'Failed to start Twitter authentication' });
  }
});

// Handle Twitter OAuth callback
router.get('/twitter/callback', async (req, res) => {
  try {
    const codeVerifier = req.session.codeVerifier;
    if (!codeVerifier) {
      return res.status(400).send("Missing code verifier from session");
    }

    const { code, state } = req.query;

    // Verify state and code
    if (!code || typeof code !== 'string') {
      return res.status(400).send('Missing or invalid code');
    }
    if (!state || typeof state !== 'string') {
      return res.status(400).send('Missing or invalid state');
    }
    if (state !== req.session.state) {
      return res.status(400).send('Invalid state');
    }

    console.log('=== TOKEN EXCHANGE START ===');
    console.log('Code verifier:', codeVerifier);
    console.log('Code from callback:', code);

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
      code: code,
    });

    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    console.log('Making token request to:', TOKEN_URL);
    const tokenResponse = await axios.post(
      TOKEN_URL,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`,
        }
      }
    );

    console.log('Token response received:', tokenResponse.status);
    const token = tokenResponse.data;

    if (!token.access_token) {
      throw new Error('No access token received');
    }

    console.log('Making profile request...');
    const profileResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    const userId = profileResponse.data.data.id;
    console.log('Profile response - User ID:', userId);

    // Store Twitter data in session
    req.session.twitterUserId = userId;
    req.session.twitterAccessToken = token.access_token;
    req.session.twitterRefreshToken = token.refresh_token;

    // Clean up session
    delete req.session.codeVerifier;
    delete req.session.state;

    // Save session and redirect
    req.session.save(() => {
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ 
                type: 'twitter-auth-success', 
                userId: '${userId}',
                accessToken: '${token.access_token}'
              }, '*');
              window.close();
            </script>
            <p>Authorization completed. You can close this window.</p>
          </body>
        </html>
      `);
    });

  } catch (error) {
    console.error('=== TOKEN EXCHANGE ERROR ===');
    console.error('Error message:', error.message);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:');
      console.error('- Status:', error.response?.status);
      console.error('- Response data:', error.response?.data);
    }
    
    res.status(500).send('Error in token exchange');
  }
});

// Check Twitter OAuth status
router.get('/twitter/status', (req, res) => {
  if (req.session.twitterUserId) {
    res.json({ 
      authorized: true, 
      userId: req.session.twitterUserId,
      hasToken: !!req.session.twitterAccessToken
    });
  } else {
    res.json({ authorized: false });
  }
});

// Disconnect Twitter account
router.post('/twitter/disconnect', (req, res) => {
  delete req.session.twitterUserId;
  delete req.session.twitterAccessToken;
  delete req.session.twitterRefreshToken;
  
  req.session.save(() => {
    res.json({ success: true, message: 'Twitter account disconnected' });
  });
});

module.exports = router;
