import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { getPublishedServices, getSiteContent } from "@/lib/content";
import {
  buildServiceDetails,
  defaultServicesPage,
  normalizeServicesPage,
  type ServiceDetailView,
} from "@/lib/services-content";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { breadcrumbJsonLd, LOCAL_BUSINESS_ID } from "@/lib/structured-data";

const searchTitle: Record<string, string> = {
  "web-app-eng": "Web App Development Company",
  "ai-machine-ml": "AI Development Company",
  "digital-marketing": "Digital Marketing and SEO Company",
  "cloud-devops": "Cloud and DevOps Company",
};

const serviceSections: Record<
  string,
  Array<{ title: string; body: string; href?: string; linkLabel?: string }>
> = {
  "web-app-eng": [
    {
      title: "SaaS MVP",
      body: "The first release is the workflow people repeat: accounts, the main screens, and one admin view. Extra roles and integrations wait until that loop is in use. You get a working build every week.",
      href: "/blog/saas-mvp-cost-factors",
      linkLabel: "What changes the cost",
    },
    {
      title: "Mobile apps",
      body: "When the phone is the product — camera, offline use, or push — we ship a store app. When the workflow is still changing, a responsive web app ships first and the store build follows.",
    },
    {
      title: "Ecommerce",
      body: "A storefront is a catalog, a checkout, and the product story. Zeevan and KankreG are the D2C examples. A booking or logistics product is a web app, not a theme.",
    },
  ],
  "ai-machine-ml": [
    {
      title: "AI in a business workflow",
      body: "Start with one job the team already does by hand. Document extraction, search over your own files, or a review queue. A person stays in the loop when the model is unsure.",
    },
  ],
  "digital-marketing": [
    {
      title: "Technical SEO",
      body: "Unique titles, one canonical URL, crawlable links, and a page that loads. Campaigns start after that.",
      href: "/blog/tech-seo-tips",
      linkLabel: "Technical SEO checklist",
    },
  ],
  "cloud-devops": [
    {
      title: "Cloud and infrastructure",
      body: "AWS or GCP, the pipeline that ships the app, and logs you can read when something fails. Cost comes down when unused environments and oversized instances go away — after the app has real traffic.",
    },
  ],
};

const serviceLead: Record<string, string> = {
  "web-app-eng":
    "Software people can log into, not a prototype. SaaS dashboards, mobile apps, and the APIs behind them — with a working build every week.",
  "ai-machine-ml":
    "A feature with a job, a measure, and a fallback. Document extraction, search over your own content, and review queues. A person stays in the loop when the model is unsure.",
  "digital-marketing":
    "Search, landing pages, and campaigns aimed at a product that actually loads. The page and the app can live in one codebase.",
  "cloud-devops":
    "AWS or GCP, the pipeline that deploys it, and a design system the next screen can reuse.",
};

type Props = { params: Promise<{ slug: string }> };

async function loadService(slug: string): Promise<ServiceDetailView | null> {
  const [services, pageContent] = await Promise.all([
    getPublishedServices(),
    getSiteContent("servicesPage", defaultServicesPage),
  ]);
  const details = buildServiceDetails(services, normalizeServicesPage(pageContent));
  return details.find((service) => service.slug === slug) ?? null;
}

export const revalidate = 30;

export async function generateStaticParams() {
  const services = await getPublishedServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await loadService(slug);
  if (!service) return { title: "Service" };

  return createPageMetadata({
    title: searchTitle[service.slug] ?? service.title,
    description: serviceLead[service.slug] ?? service.description,
    path: `/services/${service.slug}`,
    keywords: [
      service.title,
      "software development company USA",
      "custom software development",
      ...service.tools,
    ],
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await loadService(slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.description,
      url: `${siteBaseUrl()}${path}`,
      areaServed: "Worldwide",
      provider: { "@id": LOCAL_BUSINESS_ID },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.title, path },
    ]),
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHead
        eyebrow="Services · Worldwide"
        title={service.title}
        description={serviceLead[service.slug] ?? service.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />
      <section className="sec detail">
        <div className="wrap">
          {service.media?.src && (
            <figure className="detail-figure">
              {/* Local webp already sized for the card; Next/Image adds a wrapper we don't need. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.media.src}
                alt={service.media.alt}
                width={service.media.width}
                height={service.media.height}
              />
            </figure>
          )}
          <div className="detail-grid">
          <div className="detail-panel">
            <h2>What&apos;s included</h2>
            <ul className="detail-points">
              {service.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
          <div className="detail-panel">
            {service.outcomes.length > 0 && (
              <>
                <h2>Outcomes</h2>
                <ul className="detail-points">
                  {service.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="detail-links">
              {service.relatedLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <Link href="/it-services">IT services worldwide</Link>
            </div>
          </div>
          </div>
          {(serviceSections[service.slug] ?? []).length > 0 && (
            <div className="detail-grid">
              {serviceSections[service.slug].map((section) => (
                <div className="detail-panel" key={section.title}>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                  {section.href && (
                    <p>
                      <Link href={section.href}>{section.linkLabel}</Link>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <CtaBand
        eyebrow="Let's talk"
        title={`Start a ${service.title} project`}
        description="Tell us the problem. We'll reply within one business day with a path, timeline, and team."
      />
    </main>
  );
}
