import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import {
  clearAdminCookie,
  setAdminCookie,
  signAdminToken,
  verifyPassword,
} from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import {
  clearLoginAttempts,
  isLoginLocked,
  recordFailedLogin,
} from "../../middleware/loginLockout.js";
import { requireAuth, type AuthedRequest } from "../../middleware/requireAuth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many login attempts. Try again later." },
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: "Invalid email or password format",
      });
      return;
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    if (isLoginLocked(normalizedEmail)) {
      res.status(429).json({
        ok: false,
        error: "Account temporarily locked due to failed login attempts.",
      });
      return;
    }

    const user = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !(await verifyPassword(password, user.hashedPassword))) {
      recordFailedLogin(normalizedEmail);
      res.status(401).json({ ok: false, error: "Invalid email or password" });
      return;
    }

    clearLoginAttempts(normalizedEmail);
    const token = signAdminToken({ sub: user.id, email: user.email });
    setAdminCookie(res, token);

    res.json({
      ok: true,
      user: { email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (_req, res) => {
  clearAdminCookie(res);
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.json({
    ok: true,
    user: req.admin,
  });
});

export default router;
