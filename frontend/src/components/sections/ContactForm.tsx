"use client";

import { FormEvent, memo, useState } from "react";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import { MediaPlaceholder } from "@/components/sections/MediaPlaceholder";
import { apiFetch } from "@/lib/api";
import {
  budgetRanges,
  contactServices,
  site,
} from "@/lib/site-data";

export function ContactFormInner() {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState("We reply within one business day.");
  const [loading, setLoading] = useState(false);

  function toggleService(service: string) {
    setSelected((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setLoading(true);
    setStatus("Sending…");

    try {
      const response = await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          services: selected,
          budget: data.get("budget"),
          message: data.get("message"),
        }),
      });

      let result: {
        ok?: boolean;
        message?: string;
        error?: string;
        fields?: Record<string, string>;
      } = {};

      try {
        result = (await response.json()) as typeof result;
      } catch {
        if (!response.ok) {
          throw new Error(
            "Cannot reach the server. Run npm run dev from the project root so the API starts on port 5001.",
          );
        }
      }

      if (!response.ok || !result.ok) {
        const fieldMsg = result.fields
          ? Object.values(result.fields)[0]
          : undefined;
        throw new Error(fieldMsg || result.error || "Something went wrong.");
      }

      setStatus(result.message || "Thanks — we'll be in touch soon.");
      form.reset();
      setSelected([]);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Could not send your message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="sec contact-sec">
      <div className="wrap">
        <div className="contact-grid">
          <Reveal>
            <form className="form" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="Your name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div className="field">
                <label>What do you need?</label>
                <div className="chips">
                  {contactServices.map((service) => (
                    <button
                      key={service}
                      type="button"
                      className={`chip ${selected.includes(service) ? "on" : ""}`}
                      onClick={() => toggleService(service)}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label htmlFor="budget">Budget range</label>
                <select id="budget" name="budget" defaultValue="">
                  <option value="">Select a range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="message">Project details</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="What are you building, and what does success look like?"
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending…" : "Send message"}
              </Button>
              <p className="formnote">{status}</p>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="contact-info">
            <div className="info-card">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </div>
              <div>
                <h4>Email</h4>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </div>
            <div className="info-card">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
                </svg>
              </div>
              <div>
                <h4>Phone</h4>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              </div>
            </div>
            <div className="info-card">
              <div className="ic">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>
              <div>
                <h4>Studio</h4>
                <p>{site.location}</p>
              </div>
            </div>
            <div className="contact-map">
              <MediaPlaceholder
                title="Map / studio photo"
                hint="Embed a map or drop an image"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export const ContactForm = memo(ContactFormInner);
