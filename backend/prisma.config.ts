import "dotenv/config";
import { defineConfig } from "prisma/config";

// Replaces the deprecated `package.json#prisma` block. With a config file, Prisma no longer
// loads .env by itself, so dotenv/config above provides DATABASE_URL for local CLI commands.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
