import { Prisma } from "@prisma/client";

export type DatabaseProblem = "auth_failed" | "unreachable" | "dns" | "config" | "unknown";

const AUTH = /authentication ?failed|bad auth|scram failure|AuthenticationFailed/i;
const DNS = /querySrv|ENOTFOUND|getaddrinfo|EAI_AGAIN|could not resolve/i;
const UNREACHABLE =
  /server selection timeout|ReplicaSetNoPrimary|ECONNREFUSED|connection refused|ETIMEDOUT|timed out|ECONNRESET|socket|probe timeout|No available servers|Transactions are not supported by this deployment/i;
const CONFIG = /invalid connection string|database must be defined|Error parsing connection string|P1013/i;

function messageOf(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

/** True when the error means "the database cannot be used right now" (as opposed to a bug or bad input). */
export function isDatabaseConnectionError(error: unknown): boolean {
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    return true;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && ["P1000", "P1001", "P1002", "P1013"].includes(error.code)) {
    return true;
  }
  // Only Prisma errors count — an unrelated timeout (e.g. an image upload) must not mark the database as down.
  const fromPrisma =
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError;
  if (!fromPrisma) return false;
  const message = messageOf(error);
  return AUTH.test(message) || DNS.test(message) || UNREACHABLE.test(message) || CONFIG.test(message) || /ConnectorError/.test(message);
}

/** Classifies a connection failure. Auth is checked first: Atlas reports bad passwords inside timeout errors too. */
export function classifyDatabaseError(error: unknown): DatabaseProblem {
  const message = messageOf(error);
  if (AUTH.test(message)) return "auth_failed";
  if (CONFIG.test(message)) return "config";
  if (DNS.test(message)) return "dns";
  if (UNREACHABLE.test(message)) return "unreachable";
  return "unknown";
}

export const databaseProblemHelp: Record<DatabaseProblem, string> = {
  auth_failed:
    "MongoDB rejected the username/password in DATABASE_URL. In Atlas → Database Access, reset the user's password " +
    "(letters and numbers only is simplest), or URL-encode special characters (@ → %40, : → %3A, / → %2F, # → %23, % → %25). " +
    "Then update DATABASE_URL in Render → Environment and redeploy.",
  unreachable:
    "MongoDB could not be reached. In Atlas → Network Access, allow Render's outbound IPs (or 0.0.0.0/0), " +
    "and check the cluster is not paused.",
  dns: "The MongoDB host name in DATABASE_URL could not be resolved. Copy the connection string again from Atlas → Connect → Drivers.",
  config:
    "DATABASE_URL is not a valid MongoDB connection string. It must look like mongodb+srv://USER:PASSWORD@HOST/DATABASE?retryWrites=true&w=majority — note the /DATABASE name.",
  unknown: "MongoDB returned an unexpected error. See the error above.",
};

/** DATABASE_URL with the password removed, plus obvious mistakes — safe to log. */
export function describeDatabaseUrl(raw: string | undefined): { summary: string; warnings: string[] } {
  const warnings: string[] = [];
  if (!raw) return { summary: "(DATABASE_URL is not set)", warnings: ["DATABASE_URL is empty."] };

  const match = raw.trim().match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
  if (!match) {
    return {
      summary: "(not a mongodb:// or mongodb+srv:// URL)",
      warnings: ["DATABASE_URL must start with mongodb+srv:// (Atlas) or mongodb://."],
    };
  }
  const [, scheme, rest = ""] = match;

  if (/<password>|<db_password>|<username>/i.test(raw)) {
    warnings.push("DATABASE_URL still contains a <password> or <username> placeholder from Atlas.");
  }

  // Split on the LAST "@" so a password containing "@" never leaks into the host part.
  const at = rest.lastIndexOf("@");
  const credentials = at >= 0 ? rest.slice(0, at) : "";
  const location = at >= 0 ? rest.slice(at + 1) : rest;
  const user = credentials.split(":")[0] ?? "";
  const password = credentials.includes(":") ? credentials.slice(credentials.indexOf(":") + 1) : "";

  if (password.includes("@")) {
    warnings.push("The password contains an unencoded '@'. Replace it with %40.");
  }
  if (/[#/?:\s]/.test(password) || /%(?![0-9A-Fa-f]{2})/.test(password)) {
    warnings.push("The password contains characters that must be URL-encoded (# / ? : % or spaces).");
  }

  const host = location.split(/[/?]/)[0] ?? "";
  const database = location.includes("/") ? (location.split("/")[1] ?? "").split("?")[0] ?? "" : "";
  if (!database) {
    warnings.push("No database name after the host (…mongodb.net/DATABASE). Prisma needs it.");
  }

  let safeUser = user;
  try {
    safeUser = decodeURIComponent(user);
  } catch {
    /* keep raw */
  }
  return {
    summary: `${scheme}${safeUser || "(no user)"}@${host || "(no host)"}/${database || "(none)"}`,
    warnings,
  };
}
