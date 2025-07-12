import crypto from 'crypto';
import axios from 'axios';
import { Request, Response } from 'express';
import { saveToken } from './db';
import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TOKEN_URL = 'https://api.twitter.com/2/oauth2/token'; // URL corrigida
const SCOPES = ['tweet.read', 'users.read', 'offline.access', 'like.read', 'follows.read'];

export function base64URLEncode(buffer: Buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function sha256(buffer: Buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

export async function startAuth(req: Request, res: Response) {
    // Corrigido: usar base64url para code_verifier
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
}

export async function handleCallback(req: Request, res: Response) {
    const codeVerifier = req.session.codeVerifier;
    if (!codeVerifier) {
      return res.status(400).send("Missing code verifier from session");
    }

    const { code, state } = req.query;

    // Verificações aprimoradas
    if (!code || typeof code !== 'string') return res.status(400).send('Missing or invalid code');
    if (!state || typeof state !== 'string') return res.status(400).send('Missing or invalid state');
    if (state !== req.session.state) return res.status(400).send('Invalid state');

    try {
      console.log('=== TOKEN EXCHANGE START ===');
      console.log('Code verifier:', codeVerifier);
      console.log('Code from callback:', code);
      console.log('State from callback:', state);
      console.log('Session state:', req.session.state);
      
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
        code: code,
      });

      console.log('Request params:', params.toString());

      // Basic Auth É necessário mesmo com PKCE
      const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
      console.log('Basic Auth created (length):', basicAuth.length);
      
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
      console.log('Token data:', tokenResponse.data);

      const token = tokenResponse.data;

      // Verificar se o token foi recebido
      if (!token.access_token) {
        throw new Error('No access token received');
      }

      console.log('Making profile request...');
      const profileResponse = await axios.get('https://api.twitter.com/2/users/me', {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      
      console.log('Profile response:', profileResponse.data);
      const userId = profileResponse.data.data.id;

      console.log('Saving token for user:', userId);
      await saveToken(userId, token);
      
      // Limpar session após sucesso
      delete req.session.codeVerifier;
      delete req.session.state;
      
      console.log('Redirecting to frontend...');
      res.redirect(`http://localhost:3000/signup?oauthProvider=twitter&oauthId=${userId}`);

    } catch (err) {
      console.error('=== TOKEN EXCHANGE ERROR ===');
      console.error('Error type:', typeof err);
      console.error('Error message:', err instanceof Error ? err.message : 'Unknown error');
      console.error('Full error:', err);
      
      // Log mais detalhado do erro
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:');
        console.error('- Status:', err.response?.status);
        console.error('- Status text:', err.response?.statusText);
        console.error('- Response data:', err.response?.data);
        console.error('- Request URL:', err.config?.url);
        console.error('- Request method:', err.config?.method);
        console.error('- Request headers:', err.config?.headers);
      }
      
      res.status(500).send('Erro na troca do token');
    }
}