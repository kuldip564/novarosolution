import { prisma } from "./prisma.js";

const CACHE_MS_OK = 15_000;
const CACHE_MS_FAIL = 60_000;
const PROBE_MS = 2_000;

let cached: { ok: boolean; at: number } | null = null;
let probePromise: Promise<boolean> | null = null;

export function markDatabaseUnavailable(): void {
  cached = { ok: false, at: Date.now() };
}

export function markDatabaseAvailable(): void {
  cached = { ok: true, at: Date.now() };
}

async function runProbe(): Promise<boolean> {
  try {
    await Promise.race([
      prisma.$runCommandRaw({ ping: 1 }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Database probe timeout")), PROBE_MS);
      }),
    ]);
    cached = { ok: true, at: Date.now() };
    return true;
  } catch {
    cached = { ok: false, at: Date.now() };
    return false;
  }
}

export async function isDatabaseAvailable(): Promise<boolean> {
  if (cached) {
    const ttl = cached.ok ? CACHE_MS_OK : CACHE_MS_FAIL;
    if (Date.now() - cached.at < ttl) {
      return cached.ok;
    }
  }

  if (!probePromise) {
    probePromise = runProbe().finally(() => {
      probePromise = null;
    });
  }

  return probePromise;
}

export async function probeDatabaseOnStartup(): Promise<boolean> {
  const ok = await isDatabaseAvailable();
  if (ok) {
    console.log("MongoDB: connected");
  } else {
    console.warn(
      "MongoDB: unavailable — public site uses frontend fallbacks; admin/CMS will not work until DATABASE_URL is fixed.",
    );
  }
  return ok;
}
