import {
  classifyDatabaseError,
  databaseProblemHelp,
  describeDatabaseUrl,
  type DatabaseProblem,
} from "./dbErrors.js";
import { prisma } from "./prisma.js";

const CACHE_MS_OK = 15_000;
const CACHE_MS_FAIL = 30_000;
const PROBE_MS = 4_000;

export type DatabaseState = "unknown" | "connected" | DatabaseProblem;

let cached: { ok: boolean; at: number } | null = null;
let state: DatabaseState = "unknown";
let probePromise: Promise<boolean> | null = null;

function setState(next: DatabaseState, error?: unknown): void {
  if (next === state) return;
  const previous = state;
  state = next;

  if (next === "connected") {
    console.log(previous === "unknown" ? "MongoDB: connected" : "MongoDB: connection restored");
    return;
  }

  // Log the diagnosis once per change, not on every failed request.
  const { summary, warnings } = describeDatabaseUrl(process.env.DATABASE_URL);
  console.error(`MongoDB: unavailable (${next}) — ${summary}`);
  console.error(`  Fix: ${databaseProblemHelp[next as DatabaseProblem]}`);
  for (const warning of warnings) console.error(`  Check: ${warning}`);
  if (error) {
    const firstLine = (error instanceof Error ? error.message : String(error))
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(-1)[0];
    if (firstLine) console.error(`  Driver: ${firstLine.slice(0, 300)}`);
  }
  console.error("  The public site keeps working on built-in content; enquiries are queued until the database is back.");
}

export function markDatabaseUnavailable(error?: unknown): void {
  cached = { ok: false, at: Date.now() };
  setState(error ? classifyDatabaseError(error) : state === "connected" ? "unreachable" : state, error);
}

export function markDatabaseAvailable(): void {
  cached = { ok: true, at: Date.now() };
  setState("connected");
}

export function getDatabaseState(): DatabaseState {
  return state;
}

async function runProbe(): Promise<boolean> {
  let timer: NodeJS.Timeout | undefined;
  try {
    await Promise.race([
      prisma.$runCommandRaw({ ping: 1 }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Database probe timeout")), PROBE_MS);
      }),
    ]);
    markDatabaseAvailable();
    return true;
  } catch (error) {
    markDatabaseUnavailable(error);
    return false;
  } finally {
    if (timer) clearTimeout(timer);
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
  return isDatabaseAvailable();
}
