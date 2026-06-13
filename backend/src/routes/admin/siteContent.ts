import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (_req, res, next) => {
  try {
    const rows = await prisma.siteContent.findMany({ orderBy: { key: "asc" } });
    res.json({ ok: true, data: rows });
  } catch (error) {
    next(error);
  }
});

router.get("/:key", async (req, res, next) => {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key: req.params.key } });
    if (!row) {
      res.status(404).json({ ok: false, error: "Content key not found" });
      return;
    }
    res.json({ ok: true, data: row });
  } catch (error) {
    next(error);
  }
});

router.put("/:key", async (req, res, next) => {
  try {
    const value = z.unknown().parse(req.body.value);
    const data = await prisma.siteContent.upsert({
      where: { key: req.params.key },
      update: { value: value as object },
      create: { key: req.params.key, value: value as object },
    });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
