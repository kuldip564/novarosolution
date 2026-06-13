import { config } from "../config/env.js";
import { hashPassword } from "./auth.js";
import { prisma } from "./prisma.js";

export async function syncAdminFromEnv(): Promise<void> {
  const email = config.ADMIN_EMAIL.toLowerCase();
  const hashedPassword = await hashPassword(config.ADMIN_PASSWORD);

  await prisma.adminUser.upsert({
    where: { email },
    update: { hashedPassword },
    create: { email, hashedPassword },
  });

  console.log(`Admin user synced from env: ${email}`);
}
