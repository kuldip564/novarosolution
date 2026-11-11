import { Router } from "express";
import { z } from "zod";
import { isDatabaseConnectionError } from "../lib/dbErrors.js";
import { markDatabaseAvailable, markDatabaseUnavailable } from "../lib/dbHealth.js";
import { leadCreateData } from "../lib/leadData.js";
import { queueLead } from "../lib/leadOutbox.js";
import { sendLeadNotification, type LeadForEmail } from "../lib/mailer.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

/** Strips control characters (except newlines and tabs) and trims. */
function clean(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

/** Missing values become "" (prefault runs the rules on it), so they get the friendly message. */
const text = (max: number, tooLong: string) =>
  z.string().prefault("").transform(clean).pipe(z.string().max(max, tooLong));

const optionalText = (max: number, tooLong: string) =>
  z
    .string()
    .optional()
    .transform((value) => (value ? clean(value) : ""))
    .pipe(z.string().max(max, tooLong))
    .transform((value) => value || null);

const PHONE_ALLOWED = /^[+\d\s().-]*$/;

/** Server-side rules mirror the form's; messages are shown next to the matching field. */
const contactSchema = z.object({
  name: text(120, "Name is too long (120 characters max).").pipe(
    z.string().min(2, "Please enter your name (at least 2 characters)."),
  ),
  email: text(254, "Email is too long.").pipe(z.string().email("Please enter a valid email address.")),
  company: optionalText(120, "Company name is too long (120 characters max)."),
  phone: optionalText(32, "Phone number is too long.").refine(
    (value) => {
      if (!value) return true;
      const digits = value.replace(/\D/g, "").length;
      return PHONE_ALLOWED.test(value) && digits >= 7 && digits <= 15;
    },
    { message: "Please enter a valid phone or WhatsApp number, including the country code." },
  ),
  services: z
    .array(z.string().transform(clean).pipe(z.string().min(1).max(60)))
    .max(12, "Too many services selected.")
    .min(1, "Please choose the service you need.")
    .prefault([]),
  budget: optionalText(60, "Budget value is too long."),
  timeline: optionalText(60, "Timeline value is too long."),
  message: text(5_000, "Project description is too long (5,000 characters max).").pipe(
    z.string().min(20, "Please describe your project in a little more detail (at least 20 characters)."),
  ),
  source: optionalText(200, "Source is too long.").transform((value) =>
    value && value.startsWith("/") ? value : null,
  ),
  // Spam signals, never stored.
  website: z.string().optional(),
  elapsedMs: z.number().finite().nonnegative().optional(),
});

const RECEIVED = "Thanks — we received your enquiry and will reply within one business day.";
/** Humans need a few seconds to fill in the form; scripts post instantly. */
const MIN_FILL_MS = 2_500;
const MAX_LINKS = 6;

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

    res.status(400).json({ ok: false, error: "Please check the highlighted fields.", fields });
    return;
  }

  const { website, elapsedMs, ...data } = parsed.data;

  // Honeypot: a hidden field people never see. Answer like a success so bots learn nothing,
  // but store and email nothing.
  if (website && website.trim()) {
    console.warn("[contact] spam blocked: honeypot field was filled");
    res.status(200).json({ ok: true, message: RECEIVED });
    return;
  }

  if (typeof elapsedMs === "number" && elapsedMs < MIN_FILL_MS) {
    console.warn(`[contact] spam blocked: form sent ${Math.round(elapsedMs)} ms after it loaded`);
    res.status(400).json({
      ok: false,
      error: "That was quicker than we expected. Please check your details and send the form again.",
    });
    return;
  }

  const links = data.message.match(/https?:\/\//gi)?.length ?? 0;
  if (links > MAX_LINKS) {
    res.status(400).json({
      ok: false,
      error: "Please check the highlighted fields.",
      fields: { message: `Please include no more than ${MAX_LINKS} links.` },
    });
    return;
  }

  const lead: LeadForEmail = {
    name: data.name,
    email: data.email,
    company: data.company,
    phone: data.phone,
    services: data.services,
    budget: data.budget,
    timeline: data.timeline,
    message: data.message,
    source: data.source,
    receivedAt: new Date().toISOString(),
  };

  try {
    await prisma.lead.create({ data: leadCreateData(lead) });
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
