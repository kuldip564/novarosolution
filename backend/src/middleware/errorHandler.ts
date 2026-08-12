import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { config } from "../config/env.js";
import { markDatabaseUnavailable } from "../lib/dbHealth.js";

function isDatabaseUnavailable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return (
    message.includes("server selection timeout") ||
    message.includes("connection refused") ||
    message.includes("econnrefused") ||
    (error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2010")
  );
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (isDatabaseUnavailable(err)) {
    markDatabaseUnavailable();
    res.status(503).json({
      ok: false,
      error:
        "Database is unavailable. Check DATABASE_URL in backend/.env and ensure MongoDB is running.",
    });
    return;
  }

  const status =
    typeof err.status === "number" && err.status >= 400 && err.status < 600
      ? err.status
      : 500;

  const message =
    status === 500 && config.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  if (status >= 500) {
    console.error("[error]", err);
  }

  res.status(status).json({
    ok: false,
    error: message,
  });
};
