import { Router } from "express";
import { config } from "../../config/env.js";
import { syncAdminFromEnv } from "../../lib/syncAdmin.js";
import { hashPassword, verifyPassword } from "../../lib/auth.js";
import { prisma } from "../../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../../middleware/requireAuth.js";
import { z } from "zod";

const router = Router();
router.use(requireAuth);

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    data: {
      adminEmail: config.ADMIN_EMAIL,
      envManaged: true,
      note: "Admin email and password are managed via ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env",
    },
  });
});

router.post("/sync-admin", async (_req, res, next) => {
  try {
    await syncAdminFromEnv();
    res.json({ ok: true, message: "Admin credentials synced from environment variables." });
  } catch (error) {
    next(error);
  }
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

router.post("/change-password", async (req: AuthedRequest, res, next) => {
  try {
    const parsed = passwordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Invalid password payload" });
      return;
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: req.admin!.id },
    });

    if (!user || !(await verifyPassword(parsed.data.currentPassword, user.hashedPassword))) {
      res.status(401).json({ ok: false, error: "Current password is incorrect" });
      return;
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { hashedPassword: await hashPassword(parsed.data.newPassword) },
    });

    res.json({ ok: true, message: "Password updated. Note: restarting the server syncs from env again." });
  } catch (error) {
    next(error);
  }
});

export default router;
