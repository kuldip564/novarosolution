'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { submitContactForm } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import FAQSection from '@/components/shared/FAQSection';
import AdPlaceholder from '@/components/ads/AdPlaceholder';

type ContactPageClientProps = {
  title?: string;
  description?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
  allowContactSubmissions?: boolean;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ContactPageClient({
  title,
  description,
  maintenanceMode = false,
  maintenanceMessage = '',
  allowContactSubmissions = true
}: ContactPageClientProps) {
  const { token } = useAuth();
  const contactAllowed = allowContactSubmissions && !maintenanceMode;
  const effectiveMaintenanceMessage =
    maintenanceMessage ||
    'Platform updates are in progress. Some actions are temporarily unavailable. Please try again soon.';
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const faqItems = [
    {
      question: 'How quickly can I expect a response?',
      answer:
        'Most inquiries receive an initial response within one to two business days. Complex project requests may require additional review before timeline and scope are shared.'
    },
    {
      question: 'Can I request both design and development support?',
      answer:
        'Yes. We support end-to-end engagements, including discovery, UI/UX, web/mobile development, launch readiness, and post-release support.'
    },
    {
      question: 'What should I include in my message?',
      answer:
        'Include your business goal, target users, preferred platform, timeline expectation, and any existing references. This helps us provide a faster and more accurate response.'
    }
  ];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    if (website.trim()) {
      setError('Unable to submit request. Please try again.');
      return;
    }
    if (
      !form.name.trim() ||
      !isValidEmail(form.email.trim()) ||
      form.subject.trim().length < 3 ||
      form.message.trim().length < 20
    ) {
      setError('Please fill all fields with valid details.');
      return;
    }
    if (!contactAllowed) {
      setError(
        maintenanceMode ? effectiveMaintenanceMessage : 'Contact form submissions are currently disabled by admin.'
      );
      return;
    }
    setSubmitting(true);
    setError('');
    setStatus('');
    try {
      await submitContactForm(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim()
        },
        token
      );
      setForm({ name: '', email: '', subject: '', message: '' });
      setStatus('Message sent successfully.');
    } catch (err: any) {
      setError(err?.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="app-page-shell">
      <section className="premium-page-hero space-y-3">
        <p className="premium-eyebrow">Contact</p>
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">{title || 'Contact us'}</h1>
        <p className="max-w-2xl text-slate-300">
          {description || 'Tell us about your project goals and we will get back to you quickly.'}
        </p>
      </section>

      <section className="page-content-card space-y-5">
        <p className="text-sm text-slate-400">
          Prefer email?{' '}
          <a className="font-medium text-cyan-300/90 underline-offset-2 hover:underline" href="mailto:chaudharykuldip453@gmail.com">
            chaudharykuldip453@gmail.com
          </a>
        </p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder="Website"
            autoComplete="off"
            tabIndex={-1}
            className="sr-only"
            aria-hidden="true"
          />
          <div>
            <label className="form-label-premium" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="form-label-premium" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="form-label-premium" htmlFor="contact-subject">
              Subject
            </label>
            <input
              id="contact-subject"
              value={form.subject}
              onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
              placeholder="What is this about?"
            />
          </div>
          <div>
            <label className="form-label-premium" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              rows={5}
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              placeholder="Project goals, timeline, stack…"
            />
          </div>

          {!token ? (
            <p className="text-sm text-amber-300">
              Login is required to submit contact requests.{' '}
              <Link href="/login" className="underline">
                Go to Login
              </Link>
            </p>
          ) : null}
          {!contactAllowed ? (
            <p className="text-sm text-amber-300">
              {maintenanceMode
                ? effectiveMaintenanceMessage
                : 'Contact form submissions are currently disabled by admin.'}
            </p>
          ) : null}

          {error ? <p className="premium-alert premium-alert--error text-sm">{error}</p> : null}
          {status ? <p className="premium-alert premium-alert--success text-sm">{status}</p> : null}

          <button className="btn" type="submit" disabled={submitting || !token || !contactAllowed}>
            {submitting
              ? 'Sending...'
              : !token
                ? 'Login Required'
                : contactAllowed
                  ? 'Send Message'
                  : 'Currently Disabled'}
          </button>
        </form>
      </section>

      <AdPlaceholder slotName="Contact Page" />
      <FAQSection
        items={faqItems}
        intro="These common questions help you prepare a stronger project inquiry."
      />
    </main>
  );
}
