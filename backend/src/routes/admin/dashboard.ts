import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (_req, res, next) => {
  try {
    const [
      projects,
      services,
      posts,
      publishedPosts,
      testimonials,
      team,
      logos,
      faqs,
      newLeads,
      totalLeads,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.testimonial.count(),
      prisma.teamMember.count(),
      prisma.clientLogo.count(),
      prisma.faq.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count(),
    ]);

    const recentLeads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const recentPosts = await prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        coverImage: true,
        updatedAt: true,
      },
    });

    res.json({
      ok: true,
      data: {
        counts: {
          projects,
          services,
          posts,
          publishedPosts,
          testimonials,
          team,
          logos,
          faqs,
          newLeads,
          totalLeads,
        },
        recentLeads,
        recentPosts,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
