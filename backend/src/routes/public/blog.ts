import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { parseCloudinaryAsset } from "../../types/media.js";
import { computeReadingTime, publishedPostWhere, sanitizeRichText } from "../../utils/blog.js";

const router = Router();

function mapPublicPost(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: unknown;
  content: string;
  category: string;
  tags: unknown;
  author: unknown;
  publishedAt: Date | null;
  readingTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  const authorRaw = post.author as { name?: string; avatar?: unknown };
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: parseCloudinaryAsset(post.coverImage),
    content: sanitizeRichText(post.content),
    category: post.category,
    tags: Array.isArray(post.tags) ? post.tags : [],
    author: {
      name: authorRaw?.name ?? "Novaro Team",
      avatar: parseCloudinaryAsset(authorRaw?.avatar),
    },
    publishedAt: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
    readingTime: post.readingTime || computeReadingTime(post.content),
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    ogImage: parseCloudinaryAsset(post.ogImage ?? post.coverImage),
  };
}

router.get("/", async (req, res, next) => {
  try {
    const query = z
      .object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().min(1).max(24).default(9),
        category: z.string().trim().optional(),
      })
      .parse(req.query);

    const where = {
      ...publishedPostWhere(),
      ...(query.category ? { category: query.category } : {}),
    };

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ]);

    const categories = await prisma.post.findMany({
      where: publishedPostWhere(),
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    res.json({
      ok: true,
      data: {
        posts: posts.map(mapPublicPost),
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / query.limit)),
        },
        categories: categories.map((row) => row.category),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: req.params.slug,
        ...publishedPostWhere(),
      },
    });

    if (!post) {
      res.status(404).json({ ok: false, error: "Post not found" });
      return;
    }

    const related = await prisma.post.findMany({
      where: {
        ...publishedPostWhere(),
        category: post.category,
        slug: { not: post.slug },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
    });

    res.json({
      ok: true,
      data: {
        post: mapPublicPost(post),
        related: related.map(mapPublicPost),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
