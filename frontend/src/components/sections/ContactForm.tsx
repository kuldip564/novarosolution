"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import { MediaPlaceholder } from "@/components/sections/MediaPlaceholder";
import { Badge } from "@/components/ui/Badge";
import { Field, Input, Select, TextArea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/api";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/contact-form-schema";
import {
  budgetRanges,
  contactServices,
  site,
} from "@/lib/site-data";

export function ContactFormInner() {
  const { push } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      services: [],
      budget: "",
      message: "",
    },
    mode: "onBlur",
  });

  const selectedServices = watch("services") ?? [];

  function toggleService(service: string) {
    const next = selectedServices.includes(service)
      ? selectedServices.filter((item) => item !== service)
      : [...selectedServices, service];
    setValue("services", next, { shouldValidate: true });
  }

  async function onSubmit(values: ContactFormValues) {
    setServerError(null);

    try {
      const response = await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
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
        if (result.fields) {
          for (const [key, message] of Object.entries(result.fields)) {
            if (key in contactFormSchema.shape) {
              setError(key as keyof ContactFormValues, { message });
            }
          }
        }
        throw new Error(result.error || "Something went wrong.");
      }

      push(result.message || "Message sent. We'll reply within one business day.", "success");
      reset();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not send your message. Please try again.";
      setServerError(message);
      push(message, "error");
    }
  }

  return (
    <section className="sec contact-sec">
      <div className="wrap">
        <div className="contact-grid">
          <Reveal>
            <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Field id="name" label="Name" error={errors.name?.message}>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  error={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...register("name")}
                />
              </Field>

              <Field id="email" label="Email" error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  error={Boolean(errors.email)}
                  {...register("email")}
                />
              </Field>

              <Field
                id="services"
                label="What do you need?"
                hint="Select all that apply."
                error={errors.services?.message}
              >
                <div className="chips" role="group" aria-label="Services needed">
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
              </Field>

              <Field id="budget" label="Budget range">
                <Select id="budget" {...register("budget")}>
                  <option value="">Select a range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                id="message"
                label="Project details"
                hint="Share goals, timeline, and what success looks like."
                error={errors.message?.message}
              >
                <TextArea
                  id="message"
                  rows={5}
                  placeholder="What are you building, and what does success look like?"
                  error={Boolean(errors.message)}
                  {...register("message")}
                />
              </Field>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send message"}
              </Button>

              {serverError ? (
                <p className="formnote formnote-error" role="alert">
                  {serverError}
                </p>
              ) : (
                <p className="formnote">We reply within one business day.</p>
              )}
            </form>
          </Reveal>

          <Reveal delay={0.1} className="contact-info">
            <Badge variant="accent" className="contact-badge">
              Gandhinagar · Gujarat · India
            </Badge>
            <div className="info-card">
              <div className="ic" aria-hidden="true">
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
              <div className="ic" aria-hidden="true">
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
              <div className="ic" aria-hidden="true">
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
