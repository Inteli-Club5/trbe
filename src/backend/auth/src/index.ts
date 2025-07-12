import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { startAuth, handleCallback } from './oauth';

dotenv.config();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // para dev local. Em prod, usar secure: true com HTTPS
}));

app.get('/', startAuth);
app.get('/oauth/callback', handleCallback);

const port = 5001;
app.listen(port, () => {
  console.log(`Servidor OAuth rodando em http://localhost:${port}`);
});
