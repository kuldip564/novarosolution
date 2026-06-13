import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { applyReorder, nextOrder } from "../../utils/reorder.js";
import { cloudinaryAssetSchema, toPrismaJsonAsset } from "../../types/media.js";

const router = Router();
router.use(requireAuth);

const jsonArray = z.array(z.string());

const serviceSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1),
  shortDescription: z.string().trim().optional().nullable(),
  bullets: jsonArray.default([]),
  tags: jsonArray.default([]),
  icon: z.string().trim().optional().nullable(),
  image: cloudinaryAssetSchema,
  imageAlt: z.string().trim().optional().nullable(),
  published: z.boolean().default(true),
});

const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

router.get("/", async (_req, res, next) => {
  try {
    const data = await prisma.service.findMany({ orderBy: { order: "asc" } });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Validation failed", issues: parsed.error.issues });
      return;
    }
    const order = await nextOrder("service");
    const { image, ...rest } = parsed.data;
    const data = await prisma.service.create({
      data: { ...rest, image: toPrismaJsonAsset(image), order },
    });
    res.status(201).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.put("/reorder", async (req, res, next) => {
  try {
    const parsed = reorderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Invalid reorder payload" });
      return;
    }
    await applyReorder(prisma.service, parsed.data.ids);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Validation failed", issues: parsed.error.issues });
      return;
    }
    const { image, ...rest } = parsed.data;
    const data = await prisma.service.update({
      where: { id: req.params.id },
      data: { ...rest, image: toPrismaJsonAsset(image) },
    });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/published", async (req, res, next) => {
  try {
    const published = z.boolean().parse(req.body.published);
    const data = await prisma.service.update({
      where: { id: req.params.id },
      data: { published },
    });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
