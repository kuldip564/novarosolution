import mongoose from 'mongoose';
import { getCacheHealth } from '../services/cacheService.js';

export function getHealth(req, res) {
  const dbConnected = mongoose.connection.readyState === 1;
  const cache = getCacheHealth();
  const degraded = !dbConnected || (cache.redisConfigured && !cache.redisReady);
  const statusCode = degraded ? 503 : 200;

  res.status(statusCode).json({
    ok: !degraded,
    message: degraded ? 'Server is running in degraded mode.' : 'Server is running',
    uptimeSeconds: Math.floor(process.uptime()),
    services: {
      db: dbConnected ? 'up' : 'down',
      cache
    }
  });
}

