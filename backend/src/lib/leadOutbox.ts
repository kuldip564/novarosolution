import { isDatabaseConnectionError } from "./dbErrors.js";
import { isDatabaseAvailable, markDatabaseAvailable, markDatabaseUnavailable } from "./dbHealth.js";
import type { LeadForEmail } from "./mailer.js";
import { prisma } from "./prisma.js";

/**
 * Enquiries that arrived while the database was down. Each one is also written to the server log
 * as a single `[lead-fallback]` JSON line, so nothing is lost even if the server restarts before
 * the database comes back.
 */
const queue: LeadForEmail[] = [];
const MAX_QUEUED = 1_000;
let flushing = false;

export function queueLead(lead: LeadForEmail): void {
  console.warn(`[lead-fallback] ${JSON.stringify(lead)}`);
  if (queue.length >= MAX_QUEUED) {
    console.error("[lead-fallback] queue is full — this enquiry exists only in the log line above");
    return;
  }
  queue.push(lead);
}

export function pendingLeadCount(): number {
  return queue.length;
}

/** Saves queued enquiries; stops at the first database error and keeps the rest. */
export async function flushQueuedLeads(): Promise<number> {
  if (flushing || queue.length === 0) return 0;
  flushing = true;
  let saved = 0;
  try {
    while (queue.length > 0) {
      const lead = queue[0];
      if (!lead) break;
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
        queue.shift();
        saved += 1;
        markDatabaseAvailable();
      } catch (error) {
        if (isDatabaseConnectionError(error)) {
          markDatabaseUnavailable(error);
          break;
        }
        // A lead the database will never accept: keep it in the log, drop it from the queue.
        console.error("[lead-fallback] could not save queued enquiry, dropping from queue:", error);
        queue.shift();
      }
    }
  } finally {
    flushing = false;
  }
  if (saved > 0) console.log(`[lead-fallback] saved ${saved} queued enquir${saved === 1 ? "y" : "ies"} to the database`);
  return saved;
}

export function startLeadOutbox(intervalMs = 60_000): NodeJS.Timeout {
  const timer = setInterval(() => {
    if (queue.length === 0) return;
    void isDatabaseAvailable().then((ok) => (ok ? flushQueuedLeads() : 0));
  }, intervalMs);
  timer.unref();
  return timer;
}
