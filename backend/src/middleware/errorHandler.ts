import type { ErrorRequestHandler } from "express";
import { config } from "../config/env.js";
import { isDatabaseConnectionError } from "../lib/dbErrors.js";
import { markDatabaseUnavailable } from "../lib/dbHealth.js";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (res.headersSent) return;

  if (isDatabaseConnectionError(err)) {
    markDatabaseUnavailable(err);
    res.status(503).json({
      ok: false,
      error:
        config.NODE_ENV === "production"
          ? "This service is temporarily unavailable. Please try again shortly."
          : "Database is unavailable. Check DATABASE_URL in backend/.env and that MongoDB is running.",
    });
    return;
  }

  // Malformed JSON bodies from body-parser.
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ ok: false, error: "Invalid JSON body" });
    return;
  }
  if (err?.type === "entity.too.large") {
    res.status(413).json({ ok: false, error: "Request body is too large" });
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
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(status).json({ ok: false, error: message });
};
