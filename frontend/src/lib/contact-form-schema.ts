import type { Resolver } from "react-hook-form";

/**
 * Contact form validation for the browser. Written by hand so the public bundle doesn't ship a
 * schema library. The API (backend/src/routes/contact.ts) applies the same rules again.
 */
export type ContactFormValues = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  services: string[];
  budget?: string;
  timeline?: string;
  message: string;
  /** Honeypot: hidden from people, often filled by bots. */
  website?: string;
};

export const contactFormFields = [
  "name",
  "email",
  "company",
  "phone",
  "services",
  "budget",
  "timeline",
  "message",
] as const;

export type ContactFormField = (typeof contactFormFields)[number];

export function isContactFormField(key: string): key is ContactFormField {
  return (contactFormFields as readonly string[]).includes(key);
}

export const MESSAGE_MIN = 20;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED = /^[+\d\s().-]*$/;

export const contactMessages = {
  name: "Please enter your name (at least 2 characters).",
  email: "Please enter a valid email address.",
  phone: "Please enter a valid phone or WhatsApp number, including the country code.",
  services: "Please choose the service you need.",
  message: `Please describe your project in a little more detail (at least ${MESSAGE_MIN} characters).`,
  company: "Company name is too long (120 characters max).",
} as const;

export function validateContactForm(values: ContactFormValues) {
  const data: ContactFormValues = {
    name: (values.name ?? "").trim(),
    email: (values.email ?? "").trim(),
    company: (values.company ?? "").trim(),
    phone: (values.phone ?? "").trim(),
    services: Array.isArray(values.services) ? values.services : [],
    budget: values.budget ?? "",
    timeline: values.timeline ?? "",
    message: (values.message ?? "").trim(),
    website: values.website ?? "",
  };
  const errors: Partial<Record<ContactFormField, string>> = {};

  if (data.name.length < 2 || data.name.length > 120) errors.name = contactMessages.name;
  if (!EMAIL.test(data.email) || data.email.length > 254) errors.email = contactMessages.email;
  if ((data.company ?? "").length > 120) errors.company = contactMessages.company;
  if (data.phone) {
    const digits = data.phone.replace(/\D/g, "").length;
    if (!PHONE_ALLOWED.test(data.phone) || digits < 7 || digits > 15 || data.phone.length > 32) {
      errors.phone = contactMessages.phone;
    }
  }
  if (data.services.length === 0) errors.services = contactMessages.services;
  if (data.message.length < MESSAGE_MIN) errors.message = contactMessages.message;
  else if (data.message.length > 5000) errors.message = "Project description is too long (5,000 characters max).";

  return { data, errors };
}

export const contactFormResolver: Resolver<ContactFormValues> = async (values) => {
  const { data, errors } = validateContactForm(values);
  const entries = Object.entries(errors);
  if (!entries.length) return { values: data, errors: {} };
  return {
    values: {},
    errors: Object.fromEntries(
      entries.map(([field, message]) => [field, { type: "validate", message }]),
    ),
  };
};
