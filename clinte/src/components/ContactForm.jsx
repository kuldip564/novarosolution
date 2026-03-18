import React, { useState } from 'react';
import { submitContactForm } from '../config/api';

const ContactForm = ({ content, settings }) => {
  const title = content?.title || "Let's talk about your roadmap";
  const description =
    content?.description ||
    "Share a bit about your product, timelines, and what success looks like. We'll follow up within one business day.";
  const submitText = content?.submitText || 'Send Message';
  const successMessage = content?.successMessage || 'Message sent successfully.';
  const maintenanceMode = settings?.maintenanceMode ?? false;
  const maintenanceMessage =
    settings?.maintenanceMessage ||
    'Platform updates are in progress. Some actions are temporarily unavailable. Please try again soon.';
  const allowContactSubmissions = (settings?.allowContactSubmissions ?? true) && !maintenanceMode;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({
    type: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    if (!trimmedData.name || !trimmedData.email || !trimmedData.subject || !trimmedData.message) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    if (!allowContactSubmissions) {
      setStatus({
        type: 'error',
        message: maintenanceMode
          ? maintenanceMessage
          : 'Contact form submissions are currently disabled by admin.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitContactForm(trimmedData);
      setStatus({ type: 'success', message: result.message || successMessage });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to send message.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full px-4 py-18 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="section-title text-3xl md:text-5xl font-bold">
            {title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            {description}
          </p>
          <div className="mt-5 h-1 w-24 rounded-full bg-linear-to-r from-red-500 via-pink-500 to-purple-500 mx-auto" />
        </div>

        <div className="premium-card overflow-hidden rounded-3xl p-6 md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-medium text-slate-200">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors focus:border-pink-500 focus:bg-slate-900"
                  placeholder="Alex Johnson"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors focus:border-pink-500 focus:bg-slate-900"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-medium text-slate-200">
                Subject
              </label>
              <input
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors focus:border-pink-500 focus:bg-slate-900"
                placeholder="New product build, redesign, or growth"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-medium text-slate-200">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-colors focus:border-pink-500 focus:bg-slate-900"
                placeholder="Tell us about your product, timelines, and goals..."
              />
            </div>

            {status.message && (
              <p
                className={`text-sm ${
                  status.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {status.message}
              </p>
            )}
            {!allowContactSubmissions && (
              <p className="text-sm text-amber-300">
                {maintenanceMode
                  ? maintenanceMessage
                  : 'Contact form submissions are currently disabled by admin.'}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !allowContactSubmissions}
              className="group inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-8 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-red-500/40 transition-transform duration-200 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? 'Sending...' : allowContactSubmissions ? submitText : 'Currently Disabled'}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

