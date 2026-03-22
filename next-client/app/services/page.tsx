import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';
import { fetchSiteContent } from '@/lib/api';
import ServicesExplorer from '@/components/services/ServicesExplorer';

const FuturisticThreePanel = dynamic(() => import('@/components/shared/FuturisticThreePanel'));

export const metadata: Metadata = buildMetadata({
  title: 'Services | Novaro Solution',
  description: 'UI/UX design, web development, and mobile app development services by Novaro Solution.',
  keywords: ['ui ux services', 'web development services', 'mobile app development services'],
  path: '/services'
});

type ServiceItem = {
  title?: string;
  description?: string;
  badge?: string;
  deliveryTime?: string;
  pricing?: string;
  iconKey?: string;
  details?: string[];
  features?: string[];
};

const defaultServices: ServiceItem[] = [
  {
    iconKey: 'web-development',
    title: 'Web Development',
    badge: 'Most Popular',
    deliveryTime: '4-8 weeks',
    pricing: 'Starting at $3,500',
    description: 'We build fast, secure, and SEO-friendly websites and web apps for your business.',
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
    description: 'We design clean and easy interfaces that help users understand your product quickly.',
    details: [
      'User journey mapping and flow optimization',
      'High-fidelity screens and interactive prototype delivery',
      'Design system and reusable component language'
    ],
    features: ['User research', 'Interactive prototypes', 'Design systems']
  }
];

function normalizeService(service: ServiceItem) {
  const title = String(service?.title || 'Custom Service');
  return {
    title,
    description: String(service?.description || 'Tailored solution designed around your goals.'),
    badge: String(service?.badge || 'Premium'),
    deliveryTime: String(service?.deliveryTime || 'Flexible timeline'),
    pricing: String(service?.pricing || 'Contact for pricing'),
    iconKey: String(service?.iconKey || '').toLowerCase(),
    details: Array.isArray(service?.details) ? service.details.filter(Boolean) : [],
    features: Array.isArray(service?.features) ? service.features.filter(Boolean) : []
  };
}

export default async function ServicesPage() {
  const content = await fetchSiteContent({ revalidate: 180 }).catch(() => ({} as any));
  const servicesPage = (content as any)?.servicesPage || {};
  const services: Array<ReturnType<typeof normalizeService>> = (
    Array.isArray((content as any)?.services?.items) && (content as any).services.items.length
      ? (content as any).services.items
      : defaultServices
  ).map(normalizeService);

  return (
    <main className="app-page-shell">
      <section className="page-hero-shell space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          {servicesPage?.eyebrow || 'Services'}
        </p>
        <h1 className="section-title text-3xl font-extrabold md:text-5xl">
          {servicesPage?.title || 'Everything you need to launch and grow online.'}
        </h1>
        <p className="text-slate-300">
          {servicesPage?.description ||
            'From idea to launch, we provide UI/UX design, web development, mobile app development, and SEO in one service.'}
        </p>
        <div className="services-future-preview">
          <div className="services-future-copy">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Futuristic Product Layer</p>
            <p className="text-sm text-slate-300">
              Interactive 3D visual systems can be integrated in your website, dashboard, or SaaS onboarding to improve engagement and brand recall.
              Try the panel controls to test interaction, speed, and reset behavior.
            </p>
          </div>
          <div className="services-future-canvas">
            <FuturisticThreePanel />
          </div>
        </div>
      </section>
      <ServicesExplorer services={services} />
    </main>
  );
}

