import nodemailer, { type Transporter } from "nodemailer";
import { config, isMailConfigured } from "../config/env.js";

export type LeadForEmail = {
  name: string;
  email: string;
  services: string[];
  budget: string | null;
  message: string;
  receivedAt: string;
};

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (!transporter) {
    const port = config.SMTP_PORT ?? 587;
    transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port,
      secure: config.SMTP_SECURE ?? port === 465,
      auth: config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASS ?? "" } : undefined,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return transporter;
}

function oneLine(value: string, max: number): string {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

/**
 * Emails the team about a new enquiry. Never throws — a mail problem must not break the contact form.
 * `stored` says whether the lead is already in the database (admin → Leads).
 */
export async function sendLeadNotification(lead: LeadForEmail, stored: boolean): Promise<boolean> {
  const transport = getTransporter();
  if (!transport) return false;

  const status = stored
    ? "Saved in the admin panel (Leads)."
    : "NOT saved yet — the database is unavailable. It is queued on the server and in the server log, and will be saved automatically when the database is back. Keep this email until then.";

  try {
    await transport.sendMail({
      from: config.MAIL_FROM ?? config.SMTP_USER ?? config.MAIL_TO,
      to: config.MAIL_TO,
      replyTo: lead.email,
      subject: `New enquiry from ${oneLine(lead.name, 80)}${stored ? "" : " (not yet saved)"}`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Services: ${lead.services.length ? lead.services.join(", ") : "—"}`,
        `Budget: ${lead.budget ?? "—"}`,
        `Received: ${lead.receivedAt}`,
        "",
        lead.message,
        "",
        "—",
        status,
      ].join("\n"),
    });
    return true;
  } catch (error) {
    console.error("Lead email failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

export async function verifyMailer(): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    console.log("Email: not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS and MAIL_TO to get an email for every enquiry");
    return;
  }
  try {
    await transport.verify();
    console.log(`Email: ready — enquiries are emailed to ${config.MAIL_TO}`);
  } catch (error) {
    console.error("Email: SMTP login failed —", error instanceof Error ? error.message : error);
  }
}
