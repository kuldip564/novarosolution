import { createApp } from "./app.js";
import { config, isCloudinaryConfigured } from "./config/env.js";
import { probeDatabaseOnStartup } from "./lib/dbHealth.js";
import { syncAdminFromEnv } from "./lib/syncAdmin.js";

const app = createApp();

const STARTUP_DB_MS = 3_000;

async function start() {
  await probeDatabaseOnStartup();

  try {
    await Promise.race([
      syncAdminFromEnv(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Admin sync timeout")), STARTUP_DB_MS);
      }),
    ]);
  } catch (error) {
    console.error("Failed to sync admin user from env:", error);
    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
    console.warn(
      "Continuing in development — fix DATABASE_URL / MongoDB, then restart. Admin login may fail until sync succeeds.",
    );
  }

  console.log(
    isCloudinaryConfigured()
      ? "Cloudinary: configured (novaro folder)"
      : "Cloudinary: not configured — using local /uploads fallback",
  );

  const server = app.listen(config.PORT, () => {
    console.log(
      `Backend listening on http://localhost:${config.PORT} (${config.NODE_ENV})`,
    );
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `\nPort ${config.PORT} is already in use.\n` +
          `On macOS, AirPlay Receiver often occupies port 5000 — set PORT=5001 in backend/.env\n` +
          `or disable AirPlay Receiver in System Settings → General → AirDrop & Handoff.\n`,
      );
    } else {
      console.error("Failed to start server:", err.message);
    }
    process.exit(1);
  });

  function shutdown(signal: string) {
    console.log(`${signal} received — shutting down gracefully`);
    server.close((err) => {
      if (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start();
