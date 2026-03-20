import dns from 'node:dns';
import mongoose from 'mongoose';
import { MONGODB_DNS_SERVERS, MONGODB_URI, NODE_ENV } from '../config/env.js';

let connectionPromise;
let dnsConfigured = false;

mongoose.set('bufferCommands', false);

function configureDnsServers() {
  if (dnsConfigured) return;
  const servers = String(MONGODB_DNS_SERVERS || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  if (servers.length === 0) return;
  try {
    dns.setServers(servers);
    dnsConfigured = true;
  } catch (error) {
    console.warn(`[db] Unable to apply custom DNS servers: ${error?.message || 'unknown error'}`);
  }
}

async function connectWithUri(uri) {
  configureDnsServers();
  await mongoose.connect(uri, {
    autoIndex: NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 12000,
    maxPoolSize: 30,
    minPoolSize: NODE_ENV === 'production' ? 5 : 1,
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
  });
  return mongoose.connection;
}

export async function getDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = connectWithUri(MONGODB_URI)
      .catch((error) => {
        console.error(`[db] Atlas connection failed (${error?.code || 'unknown_error'}).`);
        throw error;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

