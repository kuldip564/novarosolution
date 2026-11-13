import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = Router();
router.use(requireAuth);

const statusSchema = z.enum(["NEW", "READ", "ARCHIVED"]);

router.get("/", async (req, res, next) => {
  try {
    const status = req.query.status
      ? statusSchema.safeParse(String(req.query.status))
      : null;

    const data = await prisma.lead.findMany({
      where: status?.success ? { status: status.data } : undefined,
      orderBy: { createdAt: "desc" },
    });

    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

/**
 * CSV cell. Text that starts with = + - @ (or a tab/CR) would run as a formula in Excel or
 * Sheets, so it is prefixed with an apostrophe. Visitors control these fields.
 */
function csvCell(value: unknown): string {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

router.get("/export", async (_req, res, next) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    const header = [
      "id",
      "name",
      "email",
      "company",
      "phone",
      "services",
      "budget",
      "timeline",
      "message",
      "source",
      "status",
      "createdAt",
    ];
    const rows = leads.map((lead) =>
      [
        lead.id,
        lead.name,
        lead.email,
        lead.company ?? "",
        lead.phone ?? "",
        lead.services.join("; "),
        lead.budget ?? "",
        lead.timeline ?? "",
        lead.message,
        lead.source ?? "",
        lead.status,
        lead.createdAt.toISOString(),
      ]
        .map(csvCell)
        .join(","),
    );

    const csv = [header.join(","), ...rows].join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="novaro-leads.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!data) {
      res.status(404).json({ ok: false, error: "Lead not found" });
      return;
    }
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const parsed = statusSchema.safeParse(req.body.status);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Invalid status" });
      return;
    }
    const data = await prisma.lead.update({
      where: { id: req.params.id },
      data: { status: parsed.data },
    });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
