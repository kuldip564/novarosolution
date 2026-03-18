import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export function createAuthToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
