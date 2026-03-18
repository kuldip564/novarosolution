import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createServiceAppointment } from '../config/api';
import { getServiceIconComponent, resolveServiceIconKey } from '../config/serviceIcons';
import { useAuth } from '../context/AuthContext';

const defaultServices = [
  {
    iconKey: 'web-development',
    title: 'Web Development',
    badge: 'Most Popular',
    deliveryTime: '4-8 weeks',
    pricing: 'Starting at $3,500',
    description:
      'High-performance web applications built with modern React ecosystems and cloud-native tooling.',
    details: [
      'Scalable architecture planning for long-term growth',
      'Fully responsive frontend with conversion-focused UI',
      'API integration, auth flows, and deployment setup',
    ],
    features: ['Next.js & React', 'Design systems', 'Performance-first'],
  },
  {
    iconKey: 'ui-ux-design',
    title: 'UI / UX Design',
    badge: 'Design Excellence',
    deliveryTime: '2-5 weeks',
    pricing: 'Starting at $1,800',
    description:
      'Product-led design that feels premium, intuitive, and aligned with your brand vision.',
    details: [
      'User journey mapping and flow optimization',
      'High-fidelity screens and interactive prototype delivery',
      'Design system and reusable component language',
    ],
    features: ['User research', 'Interactive prototypes', 'Design systems'],
  },
  {
    iconKey: 'app-development',
    title: 'App Development',
    badge: 'Mobile First',
    deliveryTime: '6-10 weeks',
    pricing: 'Starting at $4,200',
    description:
      'Native-feeling mobile apps using cross-platform stacks that scale with your product.',
    details: [
      'Cross-platform app architecture and reusable codebase',
      'Push notifications, analytics, and third-party integrations',
      'Play Store and App Store release support',
    ],
    features: ['iOS & Android', 'React Native', 'App store launch'],
  },
  {
    iconKey: 'seo-growth',
    title: 'SEO & Growth',
    badge: 'Growth Engine',
    deliveryTime: '3-6 weeks',
    pricing: 'Starting at $1,200',
    description:
      'Technical SEO and growth frameworks that help your product get discovered and adopted.',
    details: [
      'Technical audits to remove ranking blockers',
      'Content and keyword strategy aligned to business goals',
      'Growth dashboards for ongoing optimization',
    ],
    features: ['Technical SEO', 'Content strategy', 'Analytics & reporting'],
  },
];

const normalizeService = (service = {}) => ({
  iconKey: resolveServiceIconKey(service),
  title: service.title || 'Custom Service',
  badge: service.badge || 'Premium',
  deliveryTime: service.deliveryTime || 'Flexible timeline',
  pricing: service.pricing || 'Contact for pricing',
  description: service.description || 'Tailored solution designed around your goals.',
  details: Array.isArray(service.details) ? service.details.filter(Boolean) : [],
  features: Array.isArray(service.features) ? service.features.filter(Boolean) : [],
});

const Services = ({ data, settings }) => {
  const { isAuthenticated, token } = useAuth();
  const title = data?.title || 'Services built for modern teams';
  const description =
    data?.description ||
    'From zero to one, or one to one hundred - NovaRo Solution is your full-stack product partner.';
  const services =
    (data?.items?.length ? data.items : defaultServices).map((service) => normalizeService(service));
  const maintenanceMode = settings?.maintenanceMode ?? false;
  const maintenanceMessage =
    settings?.maintenanceMessage ||
    'Platform updates are in progress. Some actions are temporarily unavailable. Please try again soon.';
  const allowServiceAppointments = (settings?.allowServiceAppointments ?? true) && !maintenanceMode;
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    notes: '',
  });

  const openBookingModal = (serviceTitle) => {
    if (!isAuthenticated) {
      setStatus({
        type: 'error',
        message: 'Please login first to request service appointment.',
      });
      return;
    }
    if (!allowServiceAppointments) {
      setStatus({
        type: 'error',
        message: 'Service appointment booking is currently disabled by admin.',
      });
      return;
    }
    setSelectedService(serviceTitle);
    setStatus({ type: '', message: '' });
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setSelectedService('');
    setStatus({ type: '', message: '' });
    setForm({
      name: '',
      email: '',
      phone: '',
      preferredDate: '',
      notes: '',
    });
  };

  const openServiceDetails = (service) => {
    setActiveService(service);
  };

  const closeServiceDetails = () => {
    setActiveService(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookAppointment = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);
    try {
      await createServiceAppointment({
        serviceTitle: selectedService,
        ...form,
      }, token);
      setStatus({
        type: 'success',
        message: 'Contact request sent successfully. Our team will contact you shortly.',
      });
      setForm({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        notes: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to submit contact request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="services" className="services-section-bg w-full px-4 py-18 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative services-heading-wrap text-center mb-14 md:mb-16">
          <div className="services-heading-glow pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 blur-3xl" />
          <span className="services-heading-badge relative z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
            Services
          </span>
          <h2 className="relative z-10 mt-5 section-title text-3xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto">
            {title}
          </h2>
          <p className="services-heading-description relative z-10 mt-4 text-sm md:text-base text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          <div className="services-heading-line relative z-10 mt-6 h-1 w-28 rounded-full bg-linear-to-r from-red-500 via-pink-500 to-purple-500 mx-auto" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = getServiceIconComponent(service.iconKey);
            return (
            <article
              key={`${service.title}-${service.iconKey}`}
              className="premium-card services-card group relative overflow-hidden rounded-3xl p-6 md:p-8 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => openServiceDetails(service)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openServiceDetails(service);
                }
              }}
            >
              <div className="services-card-overlay absolute inset-0 bg-linear-to-br from-red-500/10 via-pink-500/10 to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="services-card-icon text-2xl md:text-3xl">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-pink-200">
                      <Icon />
                    </span>
                  </div>
                  <div className="services-card-chip h-10 w-10 rounded-2xl bg-linear-to-tr from-red-500/40 via-pink-500/40 to-purple-500/40 opacity-70 group-hover:opacity-100" />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="services-detail-chip rounded-full border border-pink-400/30 bg-pink-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-pink-200">
                    {service.badge}
                  </span>
                  <span className="services-detail-chip rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold text-slate-200">
                    {service.deliveryTime}
                  </span>
                  <span className="services-detail-chip rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold text-slate-200">
                    {service.pricing}
                  </span>
                </div>
                <h3 className="mt-6 text-xl md:text-2xl font-semibold text-slate-50">
                  {service.title}
                </h3>
                <p className="services-card-description mt-3 text-sm md:text-base text-slate-300 leading-relaxed">
                  {service.description}
                </p>
                {service.details.length > 0 && (
                  <ul className="mt-4 space-y-2 text-xs md:text-sm text-slate-200/95">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-pink-400" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <ul className="mt-5 space-y-2 text-xs md:text-sm text-slate-200">
                  {service.features.map((feature) => (
                    <li key={feature} className="services-feature-item flex items-center gap-2">
                      <span className="services-feature-dot inline-flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-tr from-red-500 to-pink-500 text-[10px] font-bold text-white">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openBookingModal(service.title);
                    }}
                disabled={!allowServiceAppointments || !isAuthenticated}
                    className="services-primary-btn inline-flex items-center rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-lg shadow-pink-500/25"
                  >
                {!isAuthenticated ? 'Login Required' : allowServiceAppointments ? 'Contact Us' : 'Contact Disabled'}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openServiceDetails(service);
                    }}
                    className="services-secondary-link inline-flex items-center text-sm font-semibold text-pink-300 transition-colors hover:text-pink-200"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </article>
            )
          })}
        </div>
      </div>

      {activeService && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 py-10">
          <div className="w-full max-w-3xl rounded-3xl border border-white/12 bg-slate-950/95 p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className="services-card-icon text-2xl md:text-3xl">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-pink-200">
                    {React.createElement(getServiceIconComponent(activeService.iconKey))}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Service Details</p>
                  <h3 className="mt-2 text-xl md:text-3xl font-semibold text-white">{activeService.title}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="services-detail-chip rounded-full border border-pink-400/30 bg-pink-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-pink-200">
                      {activeService.badge}
                    </span>
                    <span className="services-detail-chip rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold text-slate-200">
                      {activeService.deliveryTime}
                    </span>
                    <span className="services-detail-chip rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold text-slate-200">
                      {activeService.pricing}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={closeServiceDetails}
                className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10"
                aria-label="Close service details"
              >
                ✕
              </button>
            </div>

            <p className="mt-5 text-sm md:text-base text-slate-300 leading-relaxed">
              {activeService.description}
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">What is included</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200/95">
                  {activeService.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-pink-400" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Core capabilities</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {activeService.features.map((feature) => (
                    <li key={feature} className="services-feature-item flex items-center gap-2">
                      <span className="services-feature-dot inline-flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-tr from-red-500 to-pink-500 text-[10px] font-bold text-white">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  openBookingModal(activeService.title);
                  closeServiceDetails();
                }}
                className="services-primary-btn inline-flex items-center rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Contact Us
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
                onClick={closeServiceDetails}
              >
                Talk to Team
              </Link>
            </div>
          </div>
        </div>
      )}

      {!allowServiceAppointments && (
        <div className="mx-auto mt-5 max-w-6xl rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          {maintenanceMode
            ? maintenanceMessage
            : 'Service contact requests are currently disabled by admin.'}
        </div>
      )}
      {!isAuthenticated && (
        <div className="mx-auto mt-5 max-w-6xl rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Login is required to book service appointments.{' '}
          <Link to="/login" className="underline text-pink-200">
            Go to Login
          </Link>
        </div>
      )}

      {isBookingOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 py-10">
          <div className="w-full max-w-xl rounded-3xl border border-white/12 bg-slate-950/95 p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Contact Us</p>
                <h3 className="mt-2 text-xl md:text-2xl font-semibold text-white">{selectedService}</h3>
              </div>
              <button
                type="button"
                onClick={closeBookingModal}
                className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10"
                aria-label="Close appointment form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="mt-6 grid gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full rounded-xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email address"
                className="w-full rounded-xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <input
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
              </div>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us project details (optional)"
                className="w-full rounded-xl border border-white/12 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
              />

              {status.message && (
                <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {status.message}
                </p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="inline-flex items-center rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;

