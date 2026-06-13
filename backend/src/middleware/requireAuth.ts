import type { NextFunction, Request, Response } from "express";
import { ADMIN_COOKIE, verifyAdminToken } from "../lib/auth.js";

export type AuthedRequest = Request & {
  admin?: {
    id: string;
    email: string;
  };
};

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[ADMIN_COOKIE];

  if (!token || typeof token !== "string") {
    res.status(401).json({ ok: false, error: "Authentication required" });
    return;
  }

  try {
    const payload = verifyAdminToken(token);
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401).json({ ok: false, error: "Invalid or expired session" });
  }
}
