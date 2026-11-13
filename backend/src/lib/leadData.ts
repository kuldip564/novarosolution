import type { LeadForEmail } from "./mailer.js";

/** One place that maps an enquiry to the database record (used by the form and the outbox). */
export function leadCreateData(lead: LeadForEmail) {
  return {
    name: lead.name,
    email: lead.email,
    company: lead.company ?? null,
    phone: lead.phone ?? null,
    services: lead.services,
    budget: lead.budget,
    timeline: lead.timeline ?? null,
    message: lead.message,
    source: lead.source ?? null,
    status: "NEW" as const,
    createdAt: new Date(lead.receivedAt),
  };
}
