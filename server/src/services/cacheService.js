import Redis from 'ioredis';
import { CACHE_TTL_SECONDS, REDIS_URL } from '../config/env.js';

const inMemoryStore = new Map();
let redisClient = null;
let redisReady = false;

function getExpiry(ttlSeconds) {
  return Date.now() + ttlSeconds * 1000;
}

function getMemoryValue(key) {
  const entry = inMemoryStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    inMemoryStore.delete(key);
    return null;
  }
  return entry.value;
}

function setMemoryValue(key, value, ttlSeconds = CACHE_TTL_SECONDS) {
  inMemoryStore.set(key, {
    value,
    expiresAt: getExpiry(ttlSeconds)
  });
}

function deleteMemoryByPrefix(prefix) {
  for (const key of inMemoryStore.keys()) {
    if (key.startsWith(prefix)) inMemoryStore.delete(key);
  }
}

function getRedisClient() {
  if (!REDIS_URL) return null;
  if (redisClient) return redisClient;
  redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false
  });
  redisClient.on('ready', () => {
    redisReady = true;
  });
  redisClient.on('error', () => {
    redisReady = false;
  });
  return redisClient;
}

export async function getCache(key) {
  const client = getRedisClient();
  if (client && redisReady) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      // Fallback to in-memory cache on transient redis errors.
    }
  }
  return getMemoryValue(key);
}

export async function setCache(key, value, ttlSeconds = CACHE_TTL_SECONDS) {
  const client = getRedisClient();
  if (client && redisReady) {
    try {
      await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    } catch {
      // Fallback to in-memory cache on transient redis errors.
    }
  }
  setMemoryValue(key, value, ttlSeconds);
}

export async function deleteCacheByPrefix(prefix) {
  const client = getRedisClient();
  if (client && redisReady) {
    try {
      const stream = client.scanStream({ match: `${prefix}*`, count: 200 });
      stream.on('data', (keys) => {
        if (Array.isArray(keys) && keys.length) {
          client.del(...keys).catch(() => {});
        }
      });
    } catch {
      // Ignore redis delete errors and keep in-memory invalidation.
    }
  }
  deleteMemoryByPrefix(prefix);
}

