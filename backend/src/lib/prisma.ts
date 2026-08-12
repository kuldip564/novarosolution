import { PrismaClient } from "@prisma/client";
import { withMongoTimeouts } from "./databaseUrl.js";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL
    ? withMongoTimeouts(process.env.DATABASE_URL)
    : undefined;

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
    ...(url ? { datasources: { db: { url } } } : {}),
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
