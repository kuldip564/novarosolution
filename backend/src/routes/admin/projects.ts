import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { applyReorder, nextOrder } from "../../utils/reorder.js";
import {
  cloudinaryAssetSchema,
  cloudinaryAssetArraySchema,
  toPrismaJsonAsset,
  toPrismaJsonAssetArray,
} from "../../types/media.js";
import { SEO_MAX_SLUG_LENGTH, slugifyText } from "../../utils/slug.js";

const router = Router();
router.use(requireAuth);

const jsonArray = z.array(z.string());

const resultMetricSchema = z.object({
  value: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(120),
});

const projectSchema = z.object({
  slug: z.string().trim().min(1).max(SEO_MAX_SLUG_LENGTH),
  title: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(200),
  hook: z.string().trim().min(1),
  body: z.string().trim().min(1),
  heroTitle: z.string().trim().optional().nullable(),
  heroImage: cloudinaryAssetSchema,
  coverClass: z.string().trim().optional().nullable(),
  screens: cloudinaryAssetArraySchema.default([]),
  results: z.array(resultMetricSchema).default([]),
  tags: jsonArray.default([]),
  published: z.boolean().default(true),
});

const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

router.get("/", async (_req, res, next) => {
  try {
    const data = await prisma.project.findMany({ orderBy: { order: "asc" } });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Validation failed", issues: parsed.error.issues });
      return;
    }

    const order = await nextOrder("project");
    const { heroImage, screens, ...rest } = parsed.data;
    const data = await prisma.project.create({
      data: {
        ...rest,
        slug: slugifyText(rest.slug),
        heroImage: toPrismaJsonAsset(heroImage),
        screens: toPrismaJsonAssetArray(screens),
        order,
      },
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
    await applyReorder(prisma.project, parsed.data.ids);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Validation failed", issues: parsed.error.issues });
      return;
    }
    const { heroImage, screens, ...rest } = parsed.data;
    const data = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        slug: slugifyText(rest.slug),
        heroImage: toPrismaJsonAsset(heroImage),
        screens: toPrismaJsonAssetArray(screens),
      },
    });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/published", async (req, res, next) => {
  try {
    const published = z.boolean().parse(req.body.published);
    const data = await prisma.project.update({
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
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
