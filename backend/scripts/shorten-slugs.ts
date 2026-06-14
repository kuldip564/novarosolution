/**
 * Shorten existing slugs to the SEO max length (18 chars) without full reseed.
 * Run: npm run db:shorten-slugs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slugUpdates: Record<
  "post" | "service" | "project",
  Record<string, string>
> = {
  post: {
    "shipping-faster-full-stack-team": "ship-fast-stack",
    "practical-ai-in-production-apps": "ai-prod-apps",
    "technical-seo-that-moves-the-needle": "tech-seo-tips",
  },
  service: {
    "web-app-engineering": "web-app-eng",
    "ai-machine-learning": "ai-machine-ml",
    "cloud-devops-design": "cloud-devops",
  },
  project: {},
};

async function renameSlugs(
  model: "post" | "service" | "project",
  updates: Record<string, string>,
) {
  for (const [oldSlug, newSlug] of Object.entries(updates)) {
    const delegate =
      model === "post"
        ? prisma.post
        : model === "service"
          ? prisma.service
          : prisma.project;

    const existing = await delegate.findUnique({ where: { slug: oldSlug } });
    if (!existing) {
      console.log(`[${model}] No row for "${oldSlug}" — skipped`);
      continue;
    }

    const conflict = await delegate.findUnique({ where: { slug: newSlug } });
    if (conflict && conflict.id !== existing.id) {
      console.log(`[${model}] "${newSlug}" already taken — skipped "${oldSlug}"`);
      continue;
    }

    await delegate.update({
      where: { id: existing.id },
      data: { slug: newSlug },
    });
    console.log(`[${model}] ${oldSlug} → ${newSlug}`);
  }
}

async function main() {
  await renameSlugs("post", slugUpdates.post);
  await renameSlugs("service", slugUpdates.service);
  await renameSlugs("project", slugUpdates.project);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
