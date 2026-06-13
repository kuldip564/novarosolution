import type { ErrorRequestHandler } from "express";
import { config } from "../config/env.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
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
