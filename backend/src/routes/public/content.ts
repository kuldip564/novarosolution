import { Router } from "express";
import { prisma } from "../../lib/prisma.js";

const router = Router();

router.get("/projects", async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    res.json({ ok: true, data: projects });
  } catch (error) {
    next(error);
  }
});

router.get("/services", async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    res.json({ ok: true, data: services });
  } catch (error) {
    next(error);
  }
});

router.get("/team", async (_req, res, next) => {
  try {
    const team = await prisma.teamMember.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    res.json({ ok: true, data: team });
  } catch (error) {
    next(error);
  }
});

router.get("/testimonials", async (_req, res, next) => {
  try {
    const data = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.get("/logos", async (_req, res, next) => {
  try {
    const data = await prisma.clientLogo.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.get("/faq", async (_req, res, next) => {
  try {
    const data = await prisma.faq.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.get("/site/:key", async (req, res, next) => {
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: req.params.key },
    });
    if (!row) {
      res.status(404).json({ ok: false, error: "Content not found" });
      return;
    }
    res.json({ ok: true, data: row.value });
  } catch (error) {
    next(error);
  }
});

router.get("/site", async (_req, res, next) => {
  try {
    const rows = await prisma.siteContent.findMany();
    const data = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
