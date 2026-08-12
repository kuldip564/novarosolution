import { Router } from "express";
import { isDatabaseAvailable, markDatabaseUnavailable } from "../../lib/dbHealth.js";
import { prisma } from "../../lib/prisma.js";

const router = Router();

router.use(async (_req, res, next) => {
  if (await isDatabaseAvailable()) {
    next();
    return;
  }
  res.status(503).json({
    ok: false,
    error: "Database unavailable — using site fallbacks.",
  });
});

function onDbError(error: unknown, next: (error: unknown) => void) {
  markDatabaseUnavailable();
  next(error);
}

router.get("/projects", async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    res.json({ ok: true, data: projects });
  } catch (error) {
    onDbError(error, next);
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
    onDbError(error, next);
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
    onDbError(error, next);
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
    onDbError(error, next);
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
    onDbError(error, next);
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
    onDbError(error, next);
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
    onDbError(error, next);
  }
});

router.get("/site", async (_req, res, next) => {
  try {
    const rows = await prisma.siteContent.findMany();
    const data = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    res.json({ ok: true, data });
  } catch (error) {
    onDbError(error, next);
  }
});

export default router;
