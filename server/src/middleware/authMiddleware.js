import { verifyAuthToken } from '../utils/token.js';
import { findUserById } from '../models/userModel.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        ok: false,
        message: 'Unauthorized. Missing token.',
      });
    }

    const decoded = verifyAuthToken(token);
    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Unauthorized. User not found.',
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({
        ok: false,
        message: 'Account is disabled. Contact admin.',
      });
    }

    const tokenVersion = Number(decoded.tokenVersion || 0);
    const currentTokenVersion = Number(user.tokenVersion || 0);
    if (tokenVersion !== currentTokenVersion) {
      return res.status(401).json({
        ok: false,
        message: 'Session expired. Please login again.',
      });
    }

    // Always use the latest role/status from database so role changes
    // take effect immediately without forcing re-login.
    req.auth = {
      ...decoded,
      userId: user.id,
      role: user.role,
      isActive: user.isActive,
      tokenVersion: currentTokenVersion,
    };
    return next();
  } catch {
    return res.status(401).json({
      ok: false,
      message: 'Unauthorized. Invalid token.',
    });
  }
}

export function requireAdmin(req, res, next) {
  if (req.auth?.role !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Forbidden. Admin access required.',
    });
  }
  return next();
}

export function requireEmployee(req, res, next) {
  if (req.auth?.role !== 'employee') {
    return res.status(403).json({
      ok: false,
      message: 'Forbidden. Employee access required.',
    });
  }
  return next();
}

export function requireCreator(req, res, next) {
  if (req.auth?.role !== 'creator' && req.auth?.role !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Forbidden. Creator access required.',
    });
  }
  return next();
}

