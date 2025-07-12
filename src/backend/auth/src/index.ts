/// <reference path="./types/express-session.d.ts" />

import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { startAuth, handleCallback } from './oauth';
import connectSqlite3 from 'connect-sqlite3';
import cors from 'cors'

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // seu frontend
  credentials: true, // se estiver usando cookies/sessão
}));

const SQLiteStore = connectSqlite3(session);

const sessionStore: session.Store = new SQLiteStore({
  db: 'sessions.sqlite',
  dir: './',
}) as any // <-- usamos 'as any' aqui para ignorar os tipos incorretos

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // em produção, use 'secure: true' com HTTPS
    store: sessionStore,
  })
)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/auth/twitter/start', startAuth);
app.get('/auth/twitter/callback', handleCallback);
app.get('/api/oauth/twitter/status', (req, res) => {
  if (req.session.twitterUserId) {
    res.json({ authorized: true, userId: req.session.twitterUserId });
  } else {
    res.json({ authorized: false });
  }
});


const port = 5000;
app.listen(port, () => {
  console.log(`Servidor OAuth rodando em http://localhost:${port}`);
});
