import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { toCloudinaryAsset } from "../src/types/media.js";
import {
  seedAboutStats,
  seedCapabilities,
  seedContactOptions,
  seedCta,
  seedHero,
  seedHomeStats,
  seedMarqueeItems,
  seedNavLinks,
  seedProcessSteps,
  seedServiceDetails,
  seedServicesGrid,
  seedServicesSection,
  seedSite,
  seedTeam,
  seedTeamSection,
  seedWhyItems,
  seedWhySection,
  seedWorkProjects,
} from "./seed-data.js";
import { seedBlogPosts } from "./seed-blog.js";
import { computeReadingTime } from "../src/utils/blog.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  await prisma.lead.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.clientLogo.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.post.deleteMany();
  await prisma.adminUser.deleteMany();

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@novarosolution.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMeNow!123";

  await prisma.adminUser.create({
    data: {
      email: adminEmail.toLowerCase(),
      hashedPassword: await bcrypt.hash(adminPassword, 12),
    },
  });

  for (const [index, project] of seedWorkProjects.entries()) {
    await prisma.project.create({
      data: {
        slug: project.slug,
        order: index,
        title: project.title,
        category: project.category,
        hook: project.hook,
        body: project.story,
        heroTitle: project.heroTitle,
        coverClass: project.coverClass,
        screens: [],
        results: project.results,
        tags: project.tags,
        published: true,
      },
    });
  }

  for (const [index, detail] of seedServiceDetails.entries()) {
    const grid = seedServicesGrid.find((s) => s.slug === detail.slug);
    await prisma.service.create({
      data: {
        slug: detail.slug,
        order: index,
        name: detail.title,
        title: detail.title,
        description: detail.description,
        shortDescription: grid?.shortDescription ?? detail.description,
        bullets: detail.bullets,
        tags: grid?.tags ?? [],
        icon: grid?.icon ?? null,
        image: detail.image ? toCloudinaryAsset(detail.image) : null,
        imageAlt: detail.imageAlt,
        published: true,
      },
    });
  }

  for (const [index, member] of seedTeam.entries()) {
    await prisma.teamMember.create({
      data: {
        name: member.name,
        role: member.role,
        order: index,
        published: true,
      },
    });
  }

  const siteContentEntries: Array<{ key: string; value: unknown }> = [
    { key: "site", value: seedSite },
    { key: "hero", value: seedHero },
    { key: "cta", value: seedCta },
    { key: "navLinks", value: seedNavLinks },
    { key: "marqueeItems", value: seedMarqueeItems },
    { key: "capabilities", value: seedCapabilities },
    { key: "processSteps", value: seedProcessSteps },
    { key: "homeStats", value: seedHomeStats },
    { key: "aboutStats", value: seedAboutStats },
    { key: "whyItems", value: seedWhyItems },
    { key: "contactOptions", value: seedContactOptions },
    { key: "servicesSection", value: seedServicesSection },
    { key: "whySection", value: seedWhySection },
    { key: "teamSection", value: seedTeamSection },
  ];

  for (const entry of siteContentEntries) {
    await prisma.siteContent.create({
      data: { key: entry.key, value: entry.value as object },
    });
  }

  for (const post of seedBlogPosts) {
    const publishedAt = new Date();
    publishedAt.setDate(publishedAt.getDate() - post.publishedDaysAgo);
    await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.category,
        tags: [...post.tags],
        author: post.author,
        coverImage: post.coverImage ? toCloudinaryAsset(post.coverImage) : null,
        content: post.content.trim(),
        readingTime: computeReadingTime(post.content),
        status: "PUBLISHED",
        publishedAt,
        metaTitle: post.title,
        metaDescription: post.excerpt,
        ogImage: post.coverImage ? toCloudinaryAsset(post.coverImage) : null,
      },
    });
  }

  console.log(`Seeded admin user: ${adminEmail}`);
  console.log(`Default password: ${adminPassword}`);
  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
