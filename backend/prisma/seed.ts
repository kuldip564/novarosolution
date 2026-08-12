import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { toCloudinaryAsset, toPrismaJsonAssetArray } from "../src/types/media.js";
import {
  seedAboutPage,
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
  seedServicesPage,
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
        heroImage: toCloudinaryAsset(project.heroImage),
        coverClass: project.coverClass,
        screens: toPrismaJsonAssetArray(
          project.screens
            .map((screen) => toCloudinaryAsset(screen))
            .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset)),
        ),
        results: project.results,
        tags: project.tags,
        externalUrl: project.externalUrl,
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

  const seedTestimonials = [
    {
      quote:
        "Novaro shipped our logistics platform in weeks, not months. Booking, tracking, and admin flows went live together — and the codebase held up as we scaled past 10K deliveries.",
      name: "Product Lead",
      role: "Logistics · Gujarat",
      rating: 5,
    },
    {
      quote:
        "They rebuilt our D2C storefront with Next.js and tied Meta ads to real conversions. Page speed improved, checkout friction dropped, and we finally had attribution we could trust.",
      name: "Brand Founder",
      role: "Premium D2C · India",
      rating: 5,
    },
    {
      quote:
        "What stood out was ownership — one team handled engineering, design, and SEO without the usual agency hand-offs. Weekly demos kept us in the loop from day one.",
      name: "Operations Director",
      role: "Services · Healthcare",
      rating: 5,
    },
  ] as const;

  for (const [index, testimonial] of seedTestimonials.entries()) {
    await prisma.testimonial.create({
      data: {
        ...testimonial,
        order: index,
        published: true,
      },
    });
  }

  const seedFaqs = [
    {
      question: "What types of projects do you take on?",
      answer:
        "Web and mobile products, SaaS dashboards, AI/ML features, e-commerce storefronts, service booking platforms, marketing sites, and full-stack platforms — from MVP through scale-up. Recent work spans logistics, D2C, healthcare services, and fintech.",
    },
    {
      question: "How do engagements usually start?",
      answer:
        "Share your brief via our contact form or email. We schedule a 30-minute discovery call, then send a scoped proposal with timeline, squad composition, milestones, and a fixed or phased budget — usually within 2–3 business days.",
    },
    {
      question: "Do you work with startups and enterprises?",
      answer:
        "Yes. For early-stage founders we run lean MVP sprints with weekly shipping cadence. For established brands we embed a dedicated squad and integrate with your existing tools, processes, and compliance requirements.",
    },
    {
      question: "What is a typical project timeline?",
      answer:
        "Marketing sites and landing pages: 3–6 weeks. MVPs and web apps: 8–14 weeks. Full platforms with AI, admin panels, and integrations: 12–20 weeks. Timelines depend on scope — we always share a week-by-week plan before kickoff.",
    },
    {
      question: "Do you provide support after launch?",
      answer:
        "Yes. Every project includes a post-launch handover with documentation and training. We also offer monthly retainers for bug fixes, feature iterations, performance monitoring, SEO, and campaign optimization.",
    },
    {
      question: "Where is your team based?",
      answer:
        "Our studio is in Gandhinagar, Gujarat, India. We work with clients across India and internationally — remote-first collaboration with shared Slack channels, weekly video standups, and async updates in your timezone.",
    },
    {
      question: "What technologies do you use?",
      answer:
        "Next.js, React, TypeScript, Node.js, Express, MongoDB, PostgreSQL, Prisma, Cloudinary, AWS/GCP, and modern AI stacks (OpenAI, LangChain, custom ML pipelines). We pick tools for longevity and your team's ability to maintain them.",
    },
    {
      question: "How is pricing structured?",
      answer:
        "Fixed-scope projects are quoted after discovery. Larger builds are phased — MVP first, then growth sprints. Budget ranges start from ₹5L for focused builds. Every proposal breaks down deliverables, timeline, and payment milestones with no hidden fees.",
    },
  ] as const;

  for (const [index, faq] of seedFaqs.entries()) {
    await prisma.faq.create({
      data: {
        ...faq,
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
    { key: "aboutPage", value: seedAboutPage },
    { key: "whyItems", value: seedWhyItems },
    { key: "contactOptions", value: seedContactOptions },
    { key: "servicesSection", value: seedServicesSection },
    { key: "servicesPage", value: seedServicesPage },
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
