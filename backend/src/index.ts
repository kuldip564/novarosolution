import { createApp } from "./app.js";
import { config, getTrustProxy, isCloudinaryConfigured } from "./config/env.js";
import { describeDatabaseUrl } from "./lib/dbErrors.js";
import { isDatabaseAvailable, probeDatabaseOnStartup } from "./lib/dbHealth.js";
import { flushQueuedLeads, pendingLeadCount, startLeadOutbox } from "./lib/leadOutbox.js";
import { verifyMailer } from "./lib/mailer.js";
import { prisma } from "./lib/prisma.js";
import { syncAdminFromEnv } from "./lib/syncAdmin.js";

const app = createApp();

const STARTUP_DB_MS = 8_000;
const RECOVERY_CHECK_MS = 60_000;
let adminSynced = false;

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception — exiting so the host restarts a clean process:", error);
  process.exit(1);
});

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms} ms`)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

async function ensureAdminSynced(): Promise<void> {
  if (adminSynced) return;
  try {
    await withTimeout(syncAdminFromEnv(), STARTUP_DB_MS, "Admin sync");
    adminSynced = true;
  } catch (error) {
    console.error("Admin sync skipped:", error instanceof Error ? error.message : error);
  }
}

async function start() {
  console.log(`Starting backend (${config.NODE_ENV}) — database ${describeDatabaseUrl(process.env.DATABASE_URL).summary}`);

  const dbOk = await probeDatabaseOnStartup();
  if (dbOk) {
    await ensureAdminSynced();
  } else {
    console.warn("Admin login and the CMS stay off until the database connects; this is retried every minute.");
  }

  console.log(
    isCloudinaryConfigured()
      ? "Cloudinary: configured (novaro folder)"
      : "Cloudinary: not configured — using local /uploads fallback",
  );
  void verifyMailer();

  startLeadOutbox();

  // When the database comes back, sync the admin user without needing a redeploy.
  const recovery = setInterval(() => {
    if (adminSynced) return;
    void isDatabaseAvailable().then((ok) => (ok ? ensureAdminSynced() : undefined));
  }, RECOVERY_CHECK_MS);
  recovery.unref();

  const server = app.listen(config.PORT, "0.0.0.0", () => {
    console.log(`Backend listening on port ${config.PORT} (trust proxy: ${String(getTrustProxy())})`);
  });

  // Keep-alive longer than typical load-balancer idle timeouts to avoid sporadic 502s.
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;

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

  let shuttingDown = false;
  async function shutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received — shutting down gracefully`);

    const force = setTimeout(() => {
      console.error("Shutdown took too long — forcing exit");
      process.exit(1);
    }, 10_000);
    force.unref();

    server.close(async (err) => {
      if (pendingLeadCount() > 0) {
        await withTimeout(flushQueuedLeads(), 4_000, "Lead flush").catch(() => undefined);
        if (pendingLeadCount() > 0) {
          console.warn(
            `[lead-fallback] ${pendingLeadCount()} enquiries were not saved — recover them from the [lead-fallback] log lines`,
          );
        }
      }
      await prisma.$disconnect().catch(() => undefined);
      if (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }
      process.exit(0);
    });
  }

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

void start();
