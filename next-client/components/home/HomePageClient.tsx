'use client';

import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  FaBullhorn,
  FaChartLine,
  FaCloud,
  FaCode,
  FaCogs,
  FaMobileAlt,
  FaPalette,
  FaRocket,
  FaSearch,
  FaServer,
  FaShieldAlt
} from 'react-icons/fa';
import {
  createServiceAppointment,
  submitContactForm
} from '@/lib/api';
import Reveal from '@/components/animations/Reveal';

type AnyRecord = Record<string, any>;
const CreatorFeedPreview = lazy(() => import('./CreatorFeedPreview'));

const defaultStats = [
  { label: 'Projects Delivered', value: '500+', icon: '✨' },
  { label: 'Active Clients', value: '200+', icon: '🤝' },
  { label: 'Years Experience', value: '10+', icon: '🎯' },
  { label: 'Experts on Team', value: '50+', icon: '👨‍💻' }
];

const defaultFeatures = [
  {
    title: 'Fast and SEO-friendly',
    description: 'We optimize performance, structure, and content for better user experience and rankings.',
    icon: '⚡'
  },
  {
    title: 'Secure and stable',
    description: 'Security is built into every layer, from login flows to backend systems.',
    icon: '🔒'
  },
  {
    title: 'Clear communication',
    description: 'You get clear updates, timelines, and direct communication with our team.',
    icon: '💬'
  },
  {
    title: 'Flexible pricing',
    description: 'Choose a service plan that matches your budget and growth stage.',
    icon: '💰'
  }
];

const defaultTestimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    avatar: '👩‍💼',
    content:
      'NovaRo Solution felt like an internal product team. From strategy to launch, the quality bar stayed incredibly high.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Founder, Pixel Labs',
    avatar: '👨‍💻',
    content:
      'They shipped our new platform in record time without compromising on design or performance.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Product, Flowly',
    avatar: '👩‍💻',
    content:
      'Our customers keep telling us how premium everything feels. That is entirely NovaRo’s fingerprint.',
    rating: 5
  }
];

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
      'API integration, auth flows, and deployment setup'
    ],
    features: ['Next.js & React', 'Design systems', 'Performance-first']
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
      'Design system and reusable component language'
    ],
    features: ['User research', 'Interactive prototypes', 'Design systems']
  }
];

const ICON_BY_KEY: Record<string, any> = {
  'web-development': FaCode,
  'ui-ux-design': FaPalette,
  'app-development': FaMobileAlt,
  'seo-growth': FaChartLine,
  'cloud-devops': FaCloud,
  'backend-api': FaServer,
  marketing: FaBullhorn,
  security: FaShieldAlt,
  'search-strategy': FaSearch,
  'product-engineering': FaCogs,
  'launch-support': FaRocket
};

function resolveServiceIconKey(service: AnyRecord) {
  const candidate = String(service.iconKey || service.icon || '').trim().toLowerCase();
  if (candidate && ICON_BY_KEY[candidate]) return candidate;
  const title = String(service.title || '').toLowerCase();
  if (title.includes('web')) return 'web-development';
  if (title.includes('design') || title.includes('ux') || title.includes('ui')) return 'ui-ux-design';
  if (title.includes('app') || title.includes('mobile')) return 'app-development';
  if (title.includes('seo') || title.includes('growth')) return 'seo-growth';
  return 'launch-support';
}

function normalizeService(service: AnyRecord = {}) {
  return {
    iconKey: resolveServiceIconKey(service),
    title: service.title || 'Custom Service',
    badge: service.badge || 'Premium',
    deliveryTime: service.deliveryTime || 'Flexible timeline',
    pricing: service.pricing || 'Contact for pricing',
    description: service.description || 'Tailored solution designed around your goals.',
    details: Array.isArray(service.details) ? service.details.filter(Boolean) : [],
    features: Array.isArray(service.features) ? service.features.filter(Boolean) : []
  };
}

export default function HomePageClient({ data }: { data: AnyRecord }) {
  const reduceMotion = useReducedMotion();
  const [token, setToken] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [formError, setFormError] = useState('');
  const [contactError, setContactError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', preferredDate: '', notes: '' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  useEffect(() => {
    setToken(window.localStorage.getItem('novaro_auth_token') || '');
  }, []);

  const isAuthenticated = Boolean(token);
  const services = (data?.services?.items?.length ? data.services.items : defaultServices).map(normalizeService);
  const stats = data?.stats?.items?.length ? data.stats.items : defaultStats;
  const features = data?.features?.items?.length ? data.features.items : defaultFeatures;
  const testimonials = data?.testimonials?.items?.length ? data.testimonials.items : defaultTestimonials;

  const hero = useMemo(
    () => ({
      badge: data?.hero?.badge || 'Trusted digital partner',
      titleMain: data?.hero?.titleMain || 'NovaRo Solution',
      titleGradient:
        data?.hero?.titleGradient ||
        'UI/UX design, web development, and mobile app development',
      description:
        data?.hero?.description ||
        'We help businesses with UI/UX design, web development, and mobile app development in one clear process.',
      primaryCta: data?.hero?.primaryCta || 'Get Started',
      secondaryCta: data?.hero?.secondaryCta || 'Explore Services',
      highlights: data?.hero?.highlights?.length
        ? data.hero.highlights
        : ['Enterprise-grade quality', 'Battle-tested infrastructure', 'Dedicated product team']
    }),
    [data]
  );

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function onServiceSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!token || !selectedService) return;
    if (!form.name.trim() || !form.phone.trim() || !form.preferredDate || !isValidEmail(form.email.trim())) {
      setFormError('Please enter valid name, email, phone, and preferred date.');
      return;
    }
    setIsSubmittingService(true);
    setFormError('');
    setStatus({ type: '', message: '' });
    try {
      await createServiceAppointment({ serviceTitle: selectedService, ...form }, token);
      setStatus({ type: 'success', message: 'Contact request sent successfully.' });
      setForm({ name: '', email: '', phone: '', preferredDate: '', notes: '' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error?.message || 'Unable to submit request.' });
    } finally {
      setIsSubmittingService(false);
    }
  }

  async function onContactSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!token) return;
    if (
      !contactForm.name.trim() ||
      !isValidEmail(contactForm.email.trim()) ||
      !contactForm.subject.trim() ||
      !contactForm.message.trim()
    ) {
      setContactError('Please fill all fields with valid details.');
      return;
    }
    setIsSubmittingContact(true);
    setContactError('');
    setStatus({ type: '', message: '' });
    try {
      await submitContactForm(
        {
          name: contactForm.name.trim(),
          email: contactForm.email.trim(),
          subject: contactForm.subject.trim(),
          message: contactForm.message.trim()
        },
        token
      );
      setStatus({ type: 'success', message: 'Message sent successfully.' });
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error?.message || 'Failed to send message.' });
    } finally {
      setIsSubmittingContact(false);
    }
  }

  return (
    <div className="w-full text-(--text)">
      <Reveal>
        <section className="relative w-full min-h-[80vh] flex items-center justify-center px-4 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {hero.badge}
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tight">
            <span className="block">{hero.titleMain}</span>
            <span className="mt-2 block bg-linear-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              {hero.titleGradient}
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-slate-300 max-w-3xl mx-auto">{hero.description}</p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-8 py-3 font-semibold transition-transform duration-200 hover:-translate-y-0.5">
              {hero.primaryCta}
            </Link>
            <Link href="/services" className="rounded-xl border border-white/20 bg-white/10 px-8 py-3 font-semibold transition-colors duration-200 hover:bg-white/15">
              {hero.secondaryCta}
            </Link>
          </div>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="contact-form" className="w-full px-4 py-18 md:py-24">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item: AnyRecord, index: number) => (
            <motion.article
              key={item.label}
              initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
            >
              <div className="text-2xl">{item.icon}</div>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
              <p className="text-sm text-slate-400">{item.label}</p>
            </motion.article>
          ))}
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="w-full px-4 py-18 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
            {data?.services?.title ||
              'UI/UX design, web development, and mobile app development services'}
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-center text-slate-300">
            {data?.services?.description ||
              'One team for design and development. We build simple, fast, and user-friendly digital products.'}
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service: AnyRecord, index: number) => {
              const Icon = ICON_BY_KEY[service.iconKey] || FaRocket;
              return (
                <motion.article
                  key={service.title}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-pink-200">
                    <Icon />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-2 text-slate-300">{service.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-pink-400/30 bg-pink-500/15 px-3 py-1 text-xs">{service.badge}</span>
                    <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs">{service.deliveryTime}</span>
                    <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs">{service.pricing}</span>
                  </div>
                  <button
                    type="button"
                    disabled={!isAuthenticated}
                    onClick={() => setSelectedService(service.title)}
                    className="mt-5 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {!isAuthenticated ? 'Login Required' : 'Contact Us'}
                  </button>
                </motion.article>
              );
            })}
          </div>
          {!isAuthenticated ? (
            <p className="mt-4 text-sm text-amber-300">
              Login is required to book service appointments. <Link href="/login" className="underline">Go to Login</Link>
            </p>
          ) : null}
        </div>
        </section>
      </Reveal>

      <AnimatePresence>
      {selectedService ? (
        <motion.section
          className="w-full px-4 py-8"
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
        >
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Contact Us for {selectedService}</h3>
              <button type="button" onClick={() => setSelectedService('')} className="rounded-lg px-2 py-1 hover:bg-white/10">x</button>
            </div>
            <form onSubmit={onServiceSubmit} className="mt-5 grid gap-4">
              <input className="rounded-xl border border-white/12 bg-slate-900 px-4 py-3" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="rounded-xl border border-white/12 bg-slate-900 px-4 py-3" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="rounded-xl border border-white/12 bg-slate-900 px-4 py-3" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="rounded-xl border border-white/12 bg-slate-900 px-4 py-3" type="date" required value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
              <textarea className="rounded-xl border border-white/12 bg-slate-900 px-4 py-3" rows={4} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              {formError ? <p className="text-sm text-amber-300">{formError}</p> : null}
              <button disabled={isSubmittingService} className="rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-5 py-2.5 font-semibold">
                {isSubmittingService ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </motion.section>
      ) : null}
      </AnimatePresence>

      <Reveal>
        <section className="w-full px-4 py-18 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
            {data?.features?.title || 'Why businesses choose NovaRo Solution'}
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature: AnyRecord, index: number) => (
              <motion.article
                key={feature.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-3 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="w-full px-4 py-18 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">{data?.testimonials?.title || 'Teams that ship with confidence'}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t: AnyRecord, index: number) => (
              <motion.article
                key={t.name}
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{t.avatar}</div>
                  <div className="text-amber-400">{Array.from({ length: t.rating || 5 }).map((_, i) => <span key={i}>★</span>)}</div>
                </div>
                <p className="mt-4 text-slate-200">{t.content}</p>
                <p className="mt-4 font-semibold">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </motion.article>
            ))}
          </div>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="w-full px-4 py-18 md:py-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/20 bg-linear-to-br from-red-600/40 via-pink-600/40 to-purple-700/40 p-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold">{data?.cta?.title || 'Ready to ship your next product?'}</h2>
          <p className="mt-3 text-slate-300">{data?.cta?.description || 'Partner with NovaRo Solution and build with confidence.'}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="rounded-xl bg-black/90 px-8 py-3 font-semibold">Start a Project</Link>
            <Link href="/contact" className="rounded-xl border border-white/30 bg-white/10 px-8 py-3 font-semibold">Schedule a Call</Link>
          </div>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="w-full px-4 py-18 md:py-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center">{data?.contactForm?.title || "Let's talk about your roadmap"}</h2>
          <p className="mt-3 text-center text-slate-400">
            {data?.contactForm?.description || 'Share your goals and timelines. We will follow up quickly.'}
          </p>
          <form onSubmit={onContactSubmit} className="mt-8 space-y-4">
            <input className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3" placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
            <input className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3" placeholder="Email" type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
            <input className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3" placeholder="Subject" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} />
            <textarea className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3" rows={5} placeholder="Message" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
            {contactError ? <p className="text-sm text-amber-300">{contactError}</p> : null}
            {!isAuthenticated ? (
              <p className="text-sm text-amber-300">
                Login is required to submit contact requests. <Link href="/login" className="underline">Go to Login</Link>
              </p>
            ) : null}
            {status.message ? (
              <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {status.message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isSubmittingContact || !isAuthenticated}
              className="w-full rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-8 py-3 font-semibold disabled:opacity-60"
            >
              {isSubmittingContact ? 'Sending...' : !isAuthenticated ? 'Login Required' : 'Send Message'}
            </button>
          </form>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="w-full px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Creator Feed</h2>
          <p className="mt-2 mb-4 text-sm text-slate-400">Client-cached updates powered by React Query.</p>
          <Suspense fallback={<div className="card">Loading latest feed...</div>}>
            <CreatorFeedPreview />
          </Suspense>
        </div>
        </section>
      </Reveal>
    </div>
  );
}
