'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { submitContactForm } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    if (!form.name.trim() || !isValidEmail(form.email.trim()) || !form.subject.trim() || !form.message.trim()) {
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
      <section className="page-hero-shell space-y-4">
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">{title || 'Contact Us'}</h1>
        <p className="text-slate-300">
          {description || 'Tell us about your project goals and we will get back to you quickly.'}
        </p>
      </section>

      <section className="page-content-card space-y-4">
        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Name"
          />
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
          />
          <input
            value={form.subject}
            onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
            placeholder="Subject"
          />
          <textarea
            rows={5}
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            placeholder="Message"
          />

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

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {status ? <p className="text-sm text-emerald-400">{status}</p> : null}

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
    </main>
  );
}
