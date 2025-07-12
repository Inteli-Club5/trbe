import crypto from 'crypto';
import axios from 'axios';
import { Request, Response } from 'express';
import { saveToken } from './db';

const CLIENT_ID = process.env.X_CLIENT_ID!;
const CLIENT_SECRET = process.env.X_CLIENT_SECRET!;
const REDIRECT_URI = process.env.X_REDIRECT_URI!;
const AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TOKEN_URL = 'https://api.x.com/2/oauth2/token';
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

    const codeVerifier = crypto.randomBytes(32).toString('hex');
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
  
    res.redirect(`${AUTH_URL}?${params.toString()}`);
  }
  

export async function handleCallback(req: Request, res: Response) {

    const codeVerifier = req.session.codeVerifier;
    if (!codeVerifier) {
      return res.status(400).send("Missing code verifier from session");
    }

  const { code, state } = req.query;

  if (!code || !state) return res.status(400).send('Missing code or state');
  if (state !== req.session.state) return res.status(400).send('Invalid state');

  try {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.TWITTER_CLIENT_ID!, // use '!' se você tem certeza que está definido
        redirect_uri: process.env.TWITTER_REDIRECT_URI!,
        code_verifier: codeVerifier,
        code: code as string,
      });

    const tokenResponse = await axios.post(TOKEN_URL, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const token = tokenResponse.data;

    // Aqui você deve extrair o userId (ex: do token id_token ou do perfil do usuário)
    // Exemplo genérico: suponha que você tenha o userId no tokenResponse.data.user_id
    const userId = 'userIdExtraido'; // substituir pela lógica real

    await saveToken(userId, token);

    res.send('Autenticação bem sucedida! Pode fechar esta janela.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro na troca do token');
  }
}
