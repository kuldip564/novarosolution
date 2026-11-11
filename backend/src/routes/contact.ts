import { Router } from "express";
import { z } from "zod";
import { isDatabaseConnectionError } from "../lib/dbErrors.js";
import { markDatabaseAvailable, markDatabaseUnavailable } from "../lib/dbHealth.js";
import { queueLead } from "../lib/leadOutbox.js";
import { sendLeadNotification, type LeadForEmail } from "../lib/mailer.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120, "Name is too long"),
  email: z.string().trim().max(254, "Email is too long").email("Please provide a valid email"),
  services: z.array(z.string().trim().min(1).max(60)).max(12).default([]),
  budget: z.string().trim().max(60).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5_000, "Message is too long (5,000 characters max)"),
});

const RECEIVED = "Thanks — we received your message and will reply within one business day.";

router.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fields[key]) {
        fields[key] = issue.message;
      }
    }

    res.status(400).json({ ok: false, error: "Validation failed", fields });
    return;
  }

  const { name, email, services, budget, message } = parsed.data;
  const lead: LeadForEmail = {
    name,
    email,
    services,
    budget: budget || null,
    message,
    receivedAt: new Date().toISOString(),
  };

  try {
    await prisma.lead.create({
      data: {
        name: lead.name,
        email: lead.email,
        services: lead.services,
        budget: lead.budget,
        message: lead.message,
        status: "NEW",
        createdAt: new Date(lead.receivedAt),
      },
    });
    markDatabaseAvailable();
    void sendLeadNotification(lead, true);
    res.status(201).json({ ok: true, message: RECEIVED });
  } catch (error) {
    // Never lose an enquiry. Whatever stopped the save (database down, wrong credentials, or an
    // unexpected driver error), queue it and log it, email it if SMTP is set, and tell the visitor
    // it was received — it is saved automatically as soon as the database accepts writes again.
    if (isDatabaseConnectionError(error)) {
      markDatabaseUnavailable(error);
    } else {
      console.error("[contact] could not save enquiry — queued instead:", error);
    }
    queueLead(lead);
    void sendLeadNotification(lead, false);
    res.status(202).json({ ok: true, message: RECEIVED });
  }
});

export default router;
