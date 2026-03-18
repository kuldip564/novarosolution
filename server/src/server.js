import app from './app.js';
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_ENABLED,
  DEFAULT_ADMIN_NAME,
  DEFAULT_ADMIN_PASSWORD,
  PORT,
} from './config/env.js';
import { getDb } from './db/connection.js';
import bcrypt from 'bcryptjs';
import {
  createUser,
  findUserByEmail,
  findUserByName,
  updateUserById,
} from './models/userModel.js';

let serverInstance;

async function ensureDefaultAdmin() {
  if (!DEFAULT_ADMIN_ENABLED) return;

  const adminName = String(DEFAULT_ADMIN_NAME || '').trim();
  const adminEmail = String(DEFAULT_ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = String(DEFAULT_ADMIN_PASSWORD || '');

  if (!adminName || !adminEmail || adminPassword.length < 8) {
    console.warn('[server] Default admin is enabled but credentials are missing/weak. Skipping admin bootstrap.');
    return;
  }

  const existingByEmail = await findUserByEmail(adminEmail);
  const existingByName = await findUserByName(adminName);
  const existingAdmin = existingByEmail || existingByName;
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  if (!existingAdmin) {
    await createUser({
      name: adminName,
      email: adminEmail,
      password: passwordHash,
      role: 'admin',
    });
    return;
  }

  await updateUserById(existingAdmin.id, {
    role: 'admin',
    password: passwordHash,
    name: adminName,
    email: adminEmail,
  });
}

export async function startServer() {
  let dbReady = false;
  try {
    await getDb();
    dbReady = true;
  } catch (error) {
    console.error(`[server] DB connection failed. Running in degraded mode: ${error?.message || 'unknown error'}`);
  }

  if (dbReady) {
    try {
      await ensureDefaultAdmin();
    } catch (error) {
      console.error(`[server] Failed to ensure default admin: ${error?.message || 'unknown error'}`);
    }
  }

  if (serverInstance) return serverInstance;

  serverInstance = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  return serverInstance;
}

