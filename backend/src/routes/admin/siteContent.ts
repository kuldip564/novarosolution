import { Router } from "express";
import { z } from "zod";
import { updateOrCreate } from "../../lib/mongo-write.js";
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
    const key = req.params.key;
    const value = z.unknown().parse(req.body.value) as object;
    const data = await updateOrCreate({
      find: () => prisma.siteContent.findUnique({ where: { key } }),
      update: () =>
        prisma.siteContent.update({
          where: { key },
          data: { value },
        }),
      create: () => prisma.siteContent.create({ data: { key, value } }),
    });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
