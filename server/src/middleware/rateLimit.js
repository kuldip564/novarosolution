import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '../config/env.js';

export const apiRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
  message: {
    ok: false,
    message: 'Too many requests. Please try again shortly.'
  }
});

