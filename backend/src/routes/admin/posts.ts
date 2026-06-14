import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  cloudinaryAssetSchema,
  parseCloudinaryAsset,
  toPrismaJsonAsset,
} from "../../types/media.js";
import {
  computeReadingTime,
  sanitizeRichText,
  slugifyPostTitle,
} from "../../utils/blog.js";
import { SEO_MAX_SLUG_LENGTH } from "../../utils/slug.js";

const router = Router();
router.use(requireAuth);

const jsonArray = z.array(z.string());

const authorSchema = z.object({
  name: z.string().trim().min(1).max(120),
  avatar: cloudinaryAssetSchema,
});

const postInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(SEO_MAX_SLUG_LENGTH),
  excerpt: z.string().trim().min(1).max(500),
  coverImage: cloudinaryAssetSchema,
  content: z.string().min(1),
  category: z.string().trim().min(1).max(80),
  tags: jsonArray.default([]),
  author: authorSchema,
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).default("DRAFT"),
  publishedAt: z.string().datetime().nullable().optional(),
  metaTitle: z.string().trim().max(200).optional().nullable(),
  metaDescription: z.string().trim().max(320).optional().nullable(),
  ogImage: cloudinaryAssetSchema,
});

function mapAdminPost(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: unknown;
  content: string;
  category: string;
  tags: unknown;
  author: unknown;
  status: string;
  publishedAt: Date | null;
  readingTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...post,
    coverImage: parseCloudinaryAsset(post.coverImage),
    ogImage: parseCloudinaryAsset(post.ogImage),
    author: (() => {
      const raw = post.author as { name?: string; avatar?: unknown };
      return {
        name: raw?.name ?? "Novaro Team",
        avatar: parseCloudinaryAsset(raw?.avatar),
      };
    })(),
    tags: Array.isArray(post.tags) ? post.tags : [],
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

function resolvePublishedAt(
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED",
  publishedAt?: string | null,
): Date | null {
  if (status === "DRAFT") return publishedAt ? new Date(publishedAt) : null;
  if (status === "SCHEDULED") {
    if (!publishedAt) throw new Error("Scheduled posts require a publish date");
    return new Date(publishedAt);
  }
  return publishedAt ? new Date(publishedAt) : new Date();
}

function buildPostData(parsed: z.infer<typeof postInputSchema>) {
  const content = sanitizeRichText(parsed.content);
  const readingTime = computeReadingTime(content);
  let publishedAt: Date | null;

  try {
    publishedAt = resolvePublishedAt(parsed.status, parsed.publishedAt);
  } catch {
    throw new Error("Scheduled posts require a publish date");
  }

  const { coverImage, ogImage, author, ...rest } = parsed;

  return {
    ...rest,
    slug: slugifyPostTitle(parsed.slug) || slugifyPostTitle(parsed.title),
    content,
    readingTime,
    publishedAt,
    coverImage: toPrismaJsonAsset(coverImage),
    ogImage: toPrismaJsonAsset(ogImage),
    author: {
      name: author.name,
      avatar: author.avatar,
    },
  };
}

router.get("/", async (req, res, next) => {
  try {
    const query = z
      .object({
        status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).optional(),
        q: z.string().trim().optional(),
      })
      .parse(req.query);

    const posts = await prisma.post.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.q
          ? {
              OR: [
                { title: { contains: query.q } },
                { slug: { contains: query.q } },
                { category: { contains: query.q } },
              ],
            }
          : {}),
      },
      orderBy: [{ updatedAt: "desc" }],
    });

    res.json({ ok: true, data: posts.map(mapAdminPost) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) {
      res.status(404).json({ ok: false, error: "Post not found" });
      return;
    }
    res.json({ ok: true, data: mapAdminPost(post) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/preview", async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) {
      res.status(404).json({ ok: false, error: "Post not found" });
      return;
    }

    const authorRaw = post.author as { name?: string; avatar?: unknown };
    res.json({
      ok: true,
      data: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        content: sanitizeRichText(post.content),
        category: post.category,
        tags: Array.isArray(post.tags) ? post.tags : [],
        author: {
          name: authorRaw?.name ?? "Novaro Team",
          avatar: authorRaw?.avatar ?? null,
        },
        publishedAt: post.publishedAt?.toISOString() ?? new Date().toISOString(),
        readingTime: post.readingTime,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        ogImage: post.ogImage ?? post.coverImage,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = postInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Validation failed", issues: parsed.error.issues });
      return;
    }

    let data;
    try {
      data = buildPostData(parsed.data);
    } catch (err) {
      res.status(400).json({
        ok: false,
        error: err instanceof Error ? err.message : "Invalid publish settings",
      });
      return;
    }

    const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
    if (existing) {
      res.status(409).json({ ok: false, error: "Slug already in use" });
      return;
    }

    const post = await prisma.post.create({ data });
    res.status(201).json({ ok: true, data: mapAdminPost(post) });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const parsed = postInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Validation failed", issues: parsed.error.issues });
      return;
    }

    let data;
    try {
      data = buildPostData(parsed.data);
    } catch (err) {
      res.status(400).json({
        ok: false,
        error: err instanceof Error ? err.message : "Invalid publish settings",
      });
      return;
    }

    const conflict = await prisma.post.findFirst({
      where: { slug: data.slug, id: { not: req.params.id } },
    });
    if (conflict) {
      res.status(409).json({ ok: false, error: "Slug already in use" });
      return;
    }

    const post = await prisma.post.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ ok: true, data: mapAdminPost(post) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
