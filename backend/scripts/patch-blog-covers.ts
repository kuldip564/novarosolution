/**
 * Patch existing blog posts with cover images (by slug) without full reseed.
 * Run: npm run db:patch-blog-covers
 */
import { PrismaClient } from "@prisma/client";
import { toCloudinaryAsset } from "../src/types/media.js";

const prisma = new PrismaClient();

const coversBySlug: Record<string, string> = {
  "shipping-faster-full-stack-team": "/images/webapp-dashboard.webp",
  "practical-ai-in-production-apps": "/images/ai-ml-dashboard.webp",
  "technical-seo-that-moves-the-needle": "/images/digital-marketing-dashboard.webp",
};

async function main() {
  for (const [slug, path] of Object.entries(coversBySlug)) {
    const asset = toCloudinaryAsset(path);
    if (!asset) continue;

    const updated = await prisma.post.updateMany({
      where: { slug },
      data: {
        coverImage: asset as object,
        ogImage: asset as object,
      },
    });

    if (updated.count > 0) {
      console.log(`Updated cover for "${slug}"`);
    } else {
      console.log(`No post found for "${slug}" — skipped`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
