// src/types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    twitterUserId?: string;
    codeVerifier?: string;
    state?: string;
  }
}
