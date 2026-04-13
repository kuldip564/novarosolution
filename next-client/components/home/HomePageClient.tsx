'use client';

import { Suspense, lazy, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  FaAward,
  FaBullhorn,
  FaChartLine,
  FaCloud,
  FaCode,
  FaCogs,
  FaComments,
  FaMobileAlt,
  FaPalette,
  FaRocket,
  FaSearch,
  FaServer,
  FaShieldAlt,
  FaStar,
  FaUsers
} from 'react-icons/fa';
import {
  createServiceAppointment,
  submitContactForm
} from '@/lib/api';
import Reveal from '@/components/animations/Reveal';
import { useAuth } from '@/context/AuthContext';

type AnyRecord = Record<string, any>;
const CreatorFeedPreview = lazy(() => import('./CreatorFeedPreview'));
const FuturisticThreeHero = dynamic(() => import('./FuturisticThreeHero'), {
  ssr: false
});

const defaultStats = [
  { label: 'Projects Delivered', value: '500+', iconKey: 'projects' },
  { label: 'Active Clients', value: '200+', iconKey: 'clients' },
  { label: 'Years Experience', value: '10+', iconKey: 'experience' },
  { label: 'Experts on Team', value: '50+', iconKey: 'team' }
];

const defaultFeatures = [
  {
    title: 'Fast and SEO-friendly',
    description: 'We optimize performance, structure, and content for better user experience and rankings.',
    iconKey: 'speed'
  },
  {
    title: 'Secure and stable',
    description: 'Security is built into every layer, from login flows to backend systems.',
    iconKey: 'security'
  },
  {
    title: 'Clear communication',
    description: 'You get clear updates, timelines, and direct communication with our team.',
    iconKey: 'communication'
  }
];

const defaultTestimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    content:
      'NovaRo Solution felt like an internal product team. From strategy to launch, the quality bar stayed incredibly high.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Founder, Pixel Labs',
    content:
      'They shipped our new platform in record time without compromising on design or performance.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Product, Flowly',
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

const STATS_ICON_BY_KEY: Record<string, any> = {
  projects: FaAward,
  clients: FaUsers,
  experience: FaChartLine,
  team: FaCogs
};

const FEATURE_ICON_BY_KEY: Record<string, any> = {
  speed: FaRocket,
  security: FaShieldAlt,
  communication: FaComments,
  value: FaChartLine
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

function parseCounterValue(value: string | number) {
  const text = String(value ?? '0');
  const numeric = Number(text.replace(/[^\d.]/g, ''));
  const suffix = text.replace(/[\d.\s]/g, '');
  return { numeric: Number.isFinite(numeric) ? numeric : 0, suffix };
}

function CountUpValue({ value }: { value: string | number }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const { numeric, suffix } = parseCounterValue(value);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const durationMs = 900;
    const start = performance.now();
    let raf = 0;
    const step = (time: number) => {
      const progress = Math.min((time - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(numeric * eased));
      if (progress < 1) raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [inView, numeric]);

  return (
    <p ref={ref} className="home-stat-value">
      {display}
      {suffix}
    </p>
  );
}

export default function HomePageClient({ data }: { data: AnyRecord }) {
  const reduceMotion = useReducedMotion();
  const { token, isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState('');
  const [focusedService, setFocusedService] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [formError, setFormError] = useState('');
  const [contactError, setContactError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', preferredDate: '', notes: '' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const hoverRafRef = useRef<number | null>(null);
  const hoverPointerRef = useRef<{ target: HTMLElement | null; x: number; y: number }>({
    target: null,
    x: 0,
    y: 0
  });
  const serviceRectMapRef = useRef(new WeakMap<HTMLElement, DOMRect>());
  const maintenanceMode = Boolean(data?.systemSettings?.maintenanceMode);
  const maintenanceMessage =
    String(data?.systemSettings?.maintenanceMessage || '').trim() ||
    'Platform updates are in progress. Some actions are temporarily unavailable. Please try again soon.';
  const allowContactSubmissions = Boolean(data?.systemSettings?.allowContactSubmissions ?? true) && !maintenanceMode;

  const services: Array<ReturnType<typeof normalizeService>> = (data?.services?.items?.length
    ? data.services.items
    : defaultServices
  ).map(normalizeService);
  const activeService = useMemo(
    () => services.find((item) => item.title === focusedService) || services[0] || null,
    [focusedService, services]
  );

  useEffect(() => {
    if (!focusedService && services.length) {
      setFocusedService(services[0].title);
    }
  }, [focusedService, services]);

  useEffect(() => {
    return () => {
      if (hoverRafRef.current) {
        window.cancelAnimationFrame(hoverRafRef.current);
      }
    };
  }, []);

  function updateServicePointerEffect() {
    hoverRafRef.current = null;
    const target = hoverPointerRef.current.target;
    if (!target) return;
    const rect = serviceRectMapRef.current.get(target);
    if (!rect) return;
    const x = hoverPointerRef.current.x - rect.left;
    const y = hoverPointerRef.current.y - rect.top;
    target.style.setProperty('--mx', `${x}px`);
    target.style.setProperty('--my', `${y}px`);
  }

  function handleServiceMouseEnter(event: MouseEvent<HTMLElement>, title: string) {
    setFocusedService(title);
    serviceRectMapRef.current.set(event.currentTarget, event.currentTarget.getBoundingClientRect());
  }

  function handleServiceMouseMove(event: MouseEvent<HTMLElement>) {
    hoverPointerRef.current.target = event.currentTarget;
    hoverPointerRef.current.x = event.clientX;
    hoverPointerRef.current.y = event.clientY;
    if (hoverRafRef.current) return;
    hoverRafRef.current = window.requestAnimationFrame(updateServicePointerEffect);
  }

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
    if (!allowContactSubmissions) {
      setContactError(
        maintenanceMode ? maintenanceMessage : 'Contact form submissions are currently disabled by admin.'
      );
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
    <div className="home-premium home-page-prime w-full text-(--text)">
      <Reveal>
        <section className="hero-mesh relative flex min-h-[82vh] w-full items-center justify-center px-4 py-28">
        <FuturisticThreeHero />
        <div className="relative z-1 mx-auto max-w-6xl text-center">
          <p className="home-hero-badge">
            <span className="home-hero-badge-dot" aria-hidden />
            {hero.badge}
          </p>
          <h1 className="mt-8 text-4xl font-black tracking-tighter md:text-6xl lg:text-8xl">
            <span className="home-hero-title-main block">{hero.titleMain}</span>
            <span className="home-hero-gradient mt-3 block">{hero.titleGradient}</span>
          </h1>
          <p className="home-hero-lead">{hero.description}</p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/#contact-form" className="btn px-8 py-3">
              {hero.primaryCta}
            </Link>
            <Link href="/services" className="btn-secondary px-8 py-3">
              {hero.secondaryCta}
            </Link>
          </div>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="w-full px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item: AnyRecord, index: number) => {
            const StatIcon = STATS_ICON_BY_KEY[String(item.iconKey || '').toLowerCase()] || FaAward;
            return (
            <motion.article
              key={item.label}
              initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              className="home-stat-card p-5 text-center"
            >
              <div className="home-icon-chip h-11 w-11 text-lg">
                <StatIcon />
              </div>
              <CountUpValue value={item.value} />
              <p className="text-sm home-text-muted">{item.label}</p>
            </motion.article>
          );
          })}
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="w-full px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="home-section-kicker">Services</p>
          <h2 className="home-section-heading mb-4 text-center text-3xl md:text-5xl">
            {data?.services?.title ||
              'UI/UX design, web development, and mobile app development services'}
          </h2>
          <p className="home-section-intro">
            {data?.services?.description ||
              'One team for design and development. We build simple, fast, and user-friendly digital products.'}
          </p>
          <div className="grid grid-cols-12 gap-6">
            {services.map((service: AnyRecord, index: number) => {
              const Icon = ICON_BY_KEY[service.iconKey] || FaRocket;
              const bentoClass =
                index % 4 === 0
                  ? 'col-span-12 lg:col-span-7'
                  : index % 4 === 1
                    ? 'col-span-12 lg:col-span-5'
                    : index % 4 === 2
                      ? 'col-span-12 lg:col-span-5'
                      : 'col-span-12 lg:col-span-7';
              return (
                <motion.article
                  key={service.title}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  onMouseMove={handleServiceMouseMove}
                  onMouseEnter={(event) => handleServiceMouseEnter(event, service.title)}
                  className={`service-bento-card rounded-3xl p-6 ${bentoClass}`}
                >
                  <span className="home-icon-chip h-12 w-12 rounded-2xl text-xl">
                    <Icon />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-2 home-text-body">{service.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="home-pill home-pill--accent">{service.badge}</span>
                    <span className="home-pill">{service.deliveryTime}</span>
                    <span className="home-pill">{service.pricing}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={!isAuthenticated}
                      onClick={() => setSelectedService(service.title)}
                      className="btn btn-sm service-contact-btn disabled:opacity-60"
                    >
                      {!isAuthenticated ? 'Login Required' : 'Contact Us'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFocusedService(service.title)}
                      className="btn btn-sm btn-ghost"
                    >
                      Quick View
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            {activeService ? (
              <motion.article
                key={activeService.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="service-spotlight-card mt-5"
              >
                <p className="text-xs uppercase tracking-[0.2em] home-text-muted">Service Spotlight</p>
                <h3 className="mt-2 text-2xl font-semibold">{activeService.title}</h3>
                <p className="mt-2 home-text-body">{activeService.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(activeService.features || []).map((feature: string) => (
                    <span
                      key={`${activeService.title}-${feature}`}
                      className="home-pill"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.article>
            ) : null}
          </AnimatePresence>
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
          <div className="home-service-modal mx-auto max-w-3xl">
            <div className="home-service-modal__head">
              <h3 className="text-xl font-semibold">Contact Us for {selectedService}</h3>
              <button type="button" onClick={() => setSelectedService('')} className="home-modal-close" aria-label="Close">
                ×
              </button>
            </div>
            <form onSubmit={onServiceSubmit} className="mt-5 grid gap-4">
              <input className="premium-field-input" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="premium-field-input" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="premium-field-input" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="premium-field-input" type="date" required value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
              <textarea className="premium-field-input" rows={4} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              {formError ? <p className="text-sm text-amber-300">{formError}</p> : null}
              <button disabled={isSubmittingService} className="btn px-5 py-2.5">
                {isSubmittingService ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </motion.section>
      ) : null}
      </AnimatePresence>

      <Reveal>
        <section className="w-full px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="home-section-kicker">Why NovaRo</p>
          <h2 className="home-section-heading mb-10 text-center text-3xl md:text-5xl">
            {data?.features?.title || 'Why businesses choose NovaRo Solution'}
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature: AnyRecord, index: number) => {
              const FeatureIcon =
                FEATURE_ICON_BY_KEY[String(feature.iconKey || '').toLowerCase()] || FaRocket;
              return (
              <motion.article
                key={feature.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="home-mini-card p-6"
              >
                <div className="home-icon-chip h-11 w-11 rounded-2xl">
                  <FeatureIcon />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm home-text-body">{feature.description}</p>
              </motion.article>
            );
            })}
          </div>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="w-full px-4 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="home-section-kicker">Testimonials</p>
          <h2 className="home-section-heading mb-10 text-center text-3xl md:text-5xl">
            {data?.testimonials?.title || 'Teams that ship with confidence'}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t: AnyRecord, index: number) => (
              <motion.article
                key={t.name}
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
                whileHover={reduceMotion ? undefined : { y: -3 }}
                className="home-mini-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="home-testimonial-avatar text-sm">
                    {String(t.name || 'N')
                      .split(' ')
                      .map((part: string) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <FaStar key={i} size={12} />
                    ))}
                  </div>
                </div>
                <p className="home-quote">{t.content}</p>
                <p className="mt-4 font-semibold">{t.name}</p>
                <p className="text-xs home-text-muted">{t.role}</p>
              </motion.article>
            ))}
          </div>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="w-full px-4 py-20 md:py-24">
        <div className="home-cta-strip mx-auto max-w-5xl p-8 text-center md:p-10">
          <h2 className="home-cta-title">
            {data?.cta?.title || 'Ready to ship your next product?'}
          </h2>
          <p className="home-cta-subtitle">{data?.cta?.description || 'Partner with NovaRo Solution and build with confidence.'}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#contact-form" className="btn px-8 py-3">
              {data?.cta?.primaryLabel || 'Start a project'}
            </Link>
            <Link href="/contact" className="btn-secondary px-8 py-3">
              {data?.cta?.secondaryLabel || 'Contact'}
            </Link>
          </div>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="contact-form" className="w-full px-4 py-20 md:py-24">
        <div className="home-contact-shell mx-auto max-w-5xl p-6 md:p-10">
          <h2 className="home-section-heading text-center text-3xl md:text-5xl">
            {data?.contactForm?.title || "Let's talk about your roadmap"}
          </h2>
          <p className="mt-3 text-center home-text-muted">
            {data?.contactForm?.description || 'Share your goals and timelines. We will follow up quickly.'}
          </p>
          <form onSubmit={onContactSubmit} className="mt-8 space-y-4">
            <input placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
            <input placeholder="Email" type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
            <input placeholder="Subject" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} />
            <textarea rows={5} placeholder="Message" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
            {contactError ? <p className="text-sm text-amber-300">{contactError}</p> : null}
            {!isAuthenticated ? (
              <p className="text-sm text-amber-300">
                Login is required to submit contact requests. <Link href="/login" className="underline">Go to Login</Link>
              </p>
            ) : null}
            {!allowContactSubmissions ? (
              <p className="text-sm text-amber-300">
                {maintenanceMode ? maintenanceMessage : 'Contact form submissions are currently disabled by admin.'}
              </p>
            ) : null}
            {status.message ? (
              <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {status.message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isSubmittingContact || !isAuthenticated || !allowContactSubmissions}
              className="btn w-full px-8 py-3 disabled:opacity-60"
            >
              {isSubmittingContact
                ? 'Sending...'
                : !isAuthenticated
                  ? 'Login Required'
                  : allowContactSubmissions
                    ? 'Send Message'
                    : 'Currently Disabled'}
            </button>
          </form>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="w-full px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <p className="home-section-kicker home-section-kicker--start">Feed</p>
          <h2 className="home-feed-section-title">Latest Creator Feed</h2>
          <p className="mt-2 mb-4 text-sm home-text-muted">Client-cached updates powered by React Query.</p>
          <Suspense
            fallback={
              <div className="page-content-card py-10 text-center text-sm home-text-muted">Loading latest feed…</div>
            }
          >
            <CreatorFeedPreview />
          </Suspense>
        </div>
        </section>
      </Reveal>
    </div>
  );
}
