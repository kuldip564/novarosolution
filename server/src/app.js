import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CORS_ORIGIN, TRUST_PROXY } from './config/env.js';
import { getDb } from './db/connection.js';
import apiRoutes from './routes/index.js';

const app = express();
const allowedOrigins = CORS_ORIGIN.split(',').map((origin) => origin.trim());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../clinte/dist');
const shouldServeClient = process.env.NODE_ENV === 'production' && fs.existsSync(clientDistPath);

app.disable('x-powered-by');
app.set('trust proxy', TRUST_PROXY);


function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes('*')) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return true;
  if (/^http:\/\/\[::1\]:\d+$/.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
// Allow larger payloads for proof file uploads (base64 data URLs).
app.use(express.json({ limit: '25mb' }));

app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    await getDb();
  } catch (error) {
    console.warn(`[db] Request proceeding without DB connection: ${error?.message || 'unknown error'}`);
  }
  return next();
});

app.use('/api', apiRoutes);

if (shouldServeClient) {
  app.use(express.static(clientDistPath));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  if (err?.message === 'Not allowed by CORS') {
    return res.status(403).json({
      ok: false,
      message: 'CORS blocked this origin.',
    });
  }
  return next(err);
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: shouldServeClient ? 'Route not found (API).' : 'Route not found',
  });
});

export default app;

