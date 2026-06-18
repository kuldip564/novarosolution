import { config } from "../config/env.js";
import { hashPassword } from "./auth.js";
import { updateOrCreate } from "./mongo-write.js";
import { prisma } from "./prisma.js";

export async function syncAdminFromEnv(): Promise<void> {
  const email = config.ADMIN_EMAIL.toLowerCase();
  const hashedPassword = await hashPassword(config.ADMIN_PASSWORD);

  await updateOrCreate({
    find: () => prisma.adminUser.findUnique({ where: { email } }),
    update: (existing) =>
      prisma.adminUser.update({
        where: { id: existing.id },
        data: { hashedPassword },
      }),
    create: () => prisma.adminUser.create({ data: { email, hashedPassword } }),
  });

  console.log(`Admin user synced from env: ${email}`);
}
