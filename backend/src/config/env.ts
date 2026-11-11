import dotenv from "dotenv";
import { z } from "zod";

// override: true so backend/.env is authoritative for this process even when a
// parent dev-tooling process (e.g. a shared `concurrently` launcher) has already
// set vars like PORT for a sibling process — otherwise dotenv silently keeps the
// inherited value and the server can crash trying to bind someone else's port.
// No-op in production: Render (etc.) injects env vars directly, no .env file exists.
dotenv.config({ override: true });

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5001),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:3000,http://localhost:3001"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  ADMIN_EMAIL: z.string().email().default("admin@novarosolution.com"),
  ADMIN_PASSWORD: z
    .string()
    .min(8)
    .default("ChangeMeNow!123"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  /** Proxy hops in front of Express (Render = 1). "false" disables. Defaults to 1 in production. */
  TRUST_PROXY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  /** true for port 465 (implicit TLS); false/empty for 587 (STARTTLS). */
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((value) => (value ? ["1", "true", "yes"].includes(value.toLowerCase()) : undefined)),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_TO: z.string().email().optional(),
  MAIL_FROM: z.string().email().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  for (const issue of parsed.error.issues) {
    const path = issue.path.join(".") || "env";
    console.error(`  - ${path}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = parsed.data;

export function getCorsOrigins(): string[] {
  return config.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/** Express "trust proxy" value: hop count behind the load balancer, or false. */
export function getTrustProxy(): number | boolean {
  const raw = config.TRUST_PROXY?.trim().toLowerCase();
  if (!raw) return config.NODE_ENV === "production" ? 1 : false;
  if (raw === "false" || raw === "0") return false;
  if (raw === "true") return true;
  const hops = Number(raw);
  return Number.isInteger(hops) && hops > 0 ? hops : 1;
}

export function isMailConfigured(): boolean {
  return Boolean(config.SMTP_HOST && config.MAIL_TO);
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    config.CLOUDINARY_CLOUD_NAME &&
      config.CLOUDINARY_API_KEY &&
      config.CLOUDINARY_API_SECRET,
  );
}

export type AppConfig = typeof config;
