import { Router } from "express";
import { isCloudinaryConfigured, isMailConfigured } from "../config/env.js";
import { getDatabaseState, isDatabaseAvailable } from "../lib/dbHealth.js";
import { pendingLeadCount } from "../lib/leadOutbox.js";

const router = Router();

/**
 * Liveness + status for Render's health check and quick debugging.
 * Always 200 while the process is up (the public site works without the database);
 * `database` says whether the CMS/admin and lead storage are working. No secrets are exposed.
 */
router.get("/", async (_req, res) => {
  await isDatabaseAvailable();
  res.set("Cache-Control", "no-store");
  res.json({
    ok: true,
    uptime: Math.round(process.uptime()),
    database: getDatabaseState(),
    queuedLeads: pendingLeadCount(),
    email: isMailConfigured() ? "configured" : "off",
    media: isCloudinaryConfigured() ? "cloudinary" : "local",
    commit: process.env.RENDER_GIT_COMMIT?.slice(0, 7) ?? null,
  });
});

export default router;
