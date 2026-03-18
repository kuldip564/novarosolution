import app from './app.js';
import { PORT } from './config/env.js';
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
  const adminName = 'kuldipadmin1027';
  const adminEmail = 'kuldipadmin1027@admin.local';
  const adminPassword = 'Kuldip@1027';

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

