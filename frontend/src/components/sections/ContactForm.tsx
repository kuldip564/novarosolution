"use client";

import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import { Badge } from "@/components/ui/Badge";
import { Field, Input, Select, TextArea } from "@/components/ui/Field";
import { track } from "@/lib/analytics";
import { apiFetch } from "@/lib/api";
import {
  contactFormResolver,
  isContactFormField,
  MESSAGE_MIN,
  type ContactFormValues,
} from "@/lib/contact-form-schema";
import {
  budgetRanges,
  contactServiceBySlug,
  contactServices,
  contactTimelines,
  site,
} from "@/lib/site-data";
import "@/styles/contact-form.css";

type SentState = { name: string };

/** ids for aria-describedby: the hint (if any) and the error (when shown). */
function describedBy(id: string, hint: boolean, error: boolean): string | undefined {
  return [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
}

export function ContactFormInner() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState<SentState | null>(null);
  const startedAt = useRef<number | null>(null);
  const started = useRef(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: contactFormResolver,
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      services: [],
      budget: "",
      timeline: "",
      message: "",
      website: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const selectedServices = watch("services") ?? [];

  useEffect(() => {
    startedAt.current = performance.now();
    // Links like /contact?service=web-app-eng pre-select the matching service.
    const slug = new URLSearchParams(window.location.search).get("service");
    const preset = slug ? contactServiceBySlug[slug] : undefined;
    if (preset) setValue("services", [preset]);
  }, [setValue]);

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  function toggleService(service: string) {
    const next = selectedServices.includes(service)
      ? selectedServices.filter((item) => item !== service)
      : [...selectedServices, service];
    setValue("services", next, { shouldValidate: Boolean(errors.services) });
  }

  function onFirstFocus() {
    if (started.current) return;
    started.current = true;
    track("form_start", { form_id: "contact" });
  }

  function onInvalid(fieldErrors: FieldErrors<ContactFormValues>) {
    track("form_validation_error", {
      form_id: "contact",
      fields: Object.keys(fieldErrors).join(","),
    });
  }

  const fallbackContact = `email ${site.email} or call ${site.phone}`;
  const unreachableMessage = `We couldn't reach our server just now. Please try again in a minute, or ${fallbackContact}. We reply within one business day.`;

  async function onSubmit(values: ContactFormValues) {
    setServerError(null);
    const source = `${window.location.pathname}${
      new URLSearchParams(window.location.search).get("service")
        ? `?service=${new URLSearchParams(window.location.search).get("service")}`
        : ""
    }`;

    // The form passed browser validation and is being sent. This is an attempt, not a lead:
    // the lead is `generate_lead`, after the server confirms it.
    track("form_submit", { form_id: "contact", page_path: window.location.pathname });

    try {
      const response = await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          source,
          elapsedMs: startedAt.current == null ? undefined : Math.round(performance.now() - startedAt.current),
        }),
      });

      let result: { ok?: boolean; message?: string; error?: string; fields?: Record<string, string> } = {};
      try {
        result = (await response.json()) as typeof result;
      } catch {
        if (!response.ok) throw new Error(unreachableMessage);
      }

      if (!response.ok || !result.ok) {
        let fieldErrors = 0;
        for (const [key, message] of Object.entries(result.fields ?? {})) {
          if (isContactFormField(key)) {
            setError(key, { message }, { shouldFocus: fieldErrors === 0 });
            fieldErrors += 1;
          }
        }
        track("form_submit_error", {
          form_id: "contact",
          reason: response.status === 429 ? "rate_limited" : fieldErrors ? "server_validation" : "server",
        });
        // Server-side failures (5xx) always offer email and phone, whatever text the API sent:
        // the visitor must never be left without a way to reach us.
        const serverMessage =
          response.status >= 500
            ? `${(result.error || "Something went wrong on our side.").replace(/\.?\s*$/, ".")} Please try again in a minute, or ${fallbackContact}.`
            : result.error || `Something went wrong. Please try again, or ${fallbackContact}.`;
        throw new Error(
          response.status === 429
            ? `You've sent several messages in a short time. Please wait a minute and try again, or ${fallbackContact}.`
            : serverMessage,
        );
      }

      // The only conversion event: the server has confirmed it stored (201) or queued (202) the
      // enquiry. Blocked spam gets a plain 200, so it is never counted as a lead.
      if (response.status === 201 || response.status === 202) {
        track("generate_lead", {
          form_id: "contact",
          page_path: window.location.pathname,
          service: values.services.join(", "),
          budget: values.budget || "not_given",
          timeline: values.timeline || "not_given",
          stored: response.status === 201 ? "saved" : "queued",
        });
      }
      setSent({ name: values.name.trim().split(/\s+/)[0] ?? "" });
      reset();
      started.current = false;
    } catch (error) {
      // A network failure (offline, server asleep) surfaces as a TypeError from fetch.
      if (error instanceof TypeError) track("form_submit_error", { form_id: "contact", reason: "network" });
      const message =
        error instanceof TypeError
          ? unreachableMessage
          : error instanceof Error
            ? error.message
            : `Could not send your enquiry. Please try again, or ${fallbackContact}.`;
      setServerError(message);
    }
  }

  return (
    <section className="sec contact-sec">
      <div className="wrap">
        <div className="contact-grid">
          <Reveal>
            {sent ? (
              <div className="form-success" role="status">
                <span className="form-success__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <h2 ref={successRef} tabIndex={-1} className="form-success__title">
                  Thanks{sent.name ? `, ${sent.name}` : ""} — your enquiry is in.
                </h2>
                <p>
                  We reply within one business day, usually by email. If your project is urgent, call us on{" "}
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>.
                </p>
                <ol className="form-success__steps">
                  <li>We read your brief and come back with any questions.</li>
                  <li>A 30-minute call to understand goals, users and deadlines.</li>
                  <li>A scoped proposal with timeline, team and budget.</li>
                </ol>
                <div className="form-success__actions">
                  <Link href="/work">View Case Studies</Link>
                  <button type="button" className="form-success__again" onClick={() => setSent(null)}>
                    Send another enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="form contact-form"
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                onFocusCapture={onFirstFocus}
                noValidate
                aria-describedby="contact-form-note"
              >
                <p id="contact-form-note" className="form-required-note">
                  Fields marked <span aria-hidden="true">*</span>
                  <span className="sr-only">with an asterisk</span> are required. Everything else is optional.
                </p>

                <div className="form-row">
                  <Field id="name" label="Name *" error={errors.name?.message}>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      required
                      aria-required="true"
                      error={Boolean(errors.name)}
                      aria-describedby={describedBy("name", false, Boolean(errors.name))}
                      {...register("name")}
                    />
                  </Field>

                  <Field id="email" label="Business email *" error={errors.email?.message}>
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      required
                      aria-required="true"
                      error={Boolean(errors.email)}
                      aria-describedby={describedBy("email", false, Boolean(errors.email))}
                      {...register("email")}
                    />
                  </Field>
                </div>

                <div className="form-row">
                  <Field id="company" label="Company (optional)" error={errors.company?.message}>
                    <Input
                      id="company"
                      type="text"
                      autoComplete="organization"
                      error={Boolean(errors.company)}
                      aria-describedby={describedBy("company", false, Boolean(errors.company))}
                      {...register("company")}
                    />
                  </Field>

                  <Field
                    id="phone"
                    label="Phone or WhatsApp (optional)"
                    hint="Include the country code, e.g. +1 or +91."
                    error={errors.phone?.message}
                  >
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      error={Boolean(errors.phone)}
                      aria-describedby={describedBy("phone", true, Boolean(errors.phone))}
                      {...register("phone")}
                    />
                  </Field>
                </div>

                <fieldset
                  className={`field field-group${errors.services ? " field-error" : ""}`}
                  aria-describedby={describedBy("services", true, Boolean(errors.services))}
                >
                  <legend>What do you need help with? *</legend>
                  <div className="chips">
                    {contactServices.map((service) => {
                      const active = selectedServices.includes(service);
                      return (
                        <button
                          key={service}
                          type="button"
                          className={`chip ${active ? "on" : ""}`}
                          aria-pressed={active}
                          onClick={() => toggleService(service)}
                        >
                          {service}
                        </button>
                      );
                    })}
                  </div>
                  <p id="services-hint" className="field-hint">
                    Pick one or more.
                  </p>
                  {errors.services?.message ? (
                    <p id="services-error" className="field-error-msg" role="alert">
                      {errors.services.message}
                    </p>
                  ) : null}
                </fieldset>

                <div className="form-row">
                  <Field id="budget" label="Budget range (optional)">
                    <Select id="budget" {...register("budget")}>
                      <option value="">Not sure yet</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field id="timeline" label="Timeline (optional)">
                    <Select id="timeline" {...register("timeline")}>
                      <option value="">Not sure yet</option>
                      {contactTimelines.map((timeline) => (
                        <option key={timeline} value={timeline}>
                          {timeline}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <Field
                  id="message"
                  label="Project description *"
                  hint="What are you building, who is it for, and what would make it a success?"
                  error={errors.message?.message}
                >
                  <TextArea
                    id="message"
                    rows={5}
                    required
                    aria-required="true"
                    minLength={MESSAGE_MIN}
                    error={Boolean(errors.message)}
                    aria-describedby={describedBy("message", true, Boolean(errors.message))}
                    {...register("message")}
                  />
                </Field>

                {/* Honeypot: hidden from people and screen readers; bots tend to fill it in. */}
                <div className="form-hp" aria-hidden="true">
                  <label htmlFor="website">Leave this field empty</label>
                  <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
                </div>

                <Button type="submit" disabled={isSubmitting} magnetic={false}>
                  {isSubmitting ? "Sending…" : "Send enquiry"}
                </Button>

                {serverError ? (
                  <p className="formnote formnote-error" role="alert">
                    {serverError}
                  </p>
                ) : null}

                <p className="formnote form-privacy">
                  We use these details only to reply to your enquiry and prepare a proposal. We never sell them
                  or add you to a mailing list. See our <Link href="/privacy-policy">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </Reveal>

          <Reveal delay={0.1} className="contact-info">
            <Badge variant="accent" className="contact-badge">
              Worldwide · Studio in Gandhinagar
            </Badge>
            <div className="info-card">
              <div className="ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </div>
              <div>
                <strong className="info-card__title">Email</strong>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </div>
            <div className="info-card">
              <div className="ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
                </svg>
              </div>
              <div>
                <strong className="info-card__title">Phone</strong>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              </div>
            </div>
            <div className="info-card">
              <div className="ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>
              <div>
                <strong className="info-card__title">Studio</strong>
                <p>{site.location}</p>
              </div>
            </div>
            <div className="info-card">
              <div className="ic" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <div>
                <strong className="info-card__title">Business hours</strong>
                <p>{site.businessHours}</p>
              </div>
            </div>
            <div className="contact-expect">
              <h2 className="contact-expect__title">What happens next</h2>
              <ol>
                <li>We review your brief within one business day.</li>
                <li>A 30-minute discovery call to understand goals and constraints.</li>
                <li>A scoped proposal with timeline, team, and budget options.</li>
              </ol>
              <p className="contact-industries">
                <strong>Industries we have shipped for:</strong> {site.industries.join(" · ")}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export const ContactForm = memo(ContactFormInner);
