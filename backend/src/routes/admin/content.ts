import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { applyReorder, nextOrder } from "../../utils/reorder.js";
import { cloudinaryAssetSchema, toPrismaJsonAsset, type CloudinaryAsset } from "../../types/media.js";

const router = Router();
router.use(requireAuth);

const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

type AssetField = "avatar" | "photo" | "image";

function mapAssetPayload<T extends Record<string, unknown>>(
  data: T,
  assetField?: AssetField,
): T {
  if (!assetField || !(assetField in data)) return data;
  const { [assetField]: asset, ...rest } = data;
  return {
    ...rest,
    [assetField]: toPrismaJsonAsset(asset as CloudinaryAsset | null | undefined),
  } as T;
}

function crudRouter<T extends z.ZodType>(
  schema: T,
  model: "testimonial" | "teamMember" | "clientLogo" | "faq",
  assetField?: AssetField,
) {
  const r = Router();

  r.get("/", async (_req, res, next) => {
    try {
      const data = await (prisma[model] as typeof prisma.testimonial).findMany({
        orderBy: { order: "asc" },
      });
      res.json({ ok: true, data });
    } catch (error) {
      next(error);
    }
  });

  r.post("/", async (req, res, next) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ ok: false, error: "Validation failed", issues: parsed.error.issues });
        return;
      }
      const order = await nextOrder(model);
      const data = await (prisma[model] as typeof prisma.testimonial).create({
        data: { ...mapAssetPayload(parsed.data, assetField), order },
      });
      res.status(201).json({ ok: true, data });
    } catch (error) {
      next(error);
    }
  });

  r.put("/reorder", async (req, res, next) => {
    try {
      const parsed = reorderSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ ok: false, error: "Invalid reorder payload" });
        return;
      }
      await applyReorder(prisma[model] as typeof prisma.testimonial, parsed.data.ids);
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  r.put("/:id", async (req, res, next) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ ok: false, error: "Validation failed", issues: parsed.error.issues });
        return;
      }
      const data = await (prisma[model] as typeof prisma.testimonial).update({
        where: { id: req.params.id },
        data: mapAssetPayload(parsed.data, assetField),
      });
      res.json({ ok: true, data });
    } catch (error) {
      next(error);
    }
  });

  r.patch("/:id/published", async (req, res, next) => {
    try {
      const published = z.boolean().parse(req.body.published);
      const data = await (prisma[model] as typeof prisma.testimonial).update({
        where: { id: req.params.id },
        data: { published },
      });
      res.json({ ok: true, data });
    } catch (error) {
      next(error);
    }
  });

  r.delete("/:id", async (req, res, next) => {
    try {
      await (prisma[model] as typeof prisma.testimonial).delete({
        where: { id: req.params.id },
      });
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  return r;
}

export const testimonialsRouter = crudRouter(
  z.object({
    quote: z.string().trim().min(1),
    name: z.string().trim().min(1),
    role: z.string().trim().min(1),
    avatar: cloudinaryAssetSchema,
    rating: z.number().int().min(1).max(5).default(5),
    published: z.boolean().default(true),
  }),
  "testimonial",
  "avatar",
);

export const teamRouter = crudRouter(
  z.object({
    name: z.string().trim().min(1),
    role: z.string().trim().min(1),
    photo: cloudinaryAssetSchema,
    published: z.boolean().default(true),
  }),
  "teamMember",
  "photo",
);

export const logosRouter = crudRouter(
  z.object({
    name: z.string().trim().min(1),
    image: cloudinaryAssetSchema,
    published: z.boolean().default(true),
  }),
  "clientLogo",
  "image",
);

export const faqRouter = crudRouter(
  z.object({
    question: z.string().trim().min(1),
    answer: z.string().trim().min(1),
    published: z.boolean().default(true),
  }),
  "faq",
);
