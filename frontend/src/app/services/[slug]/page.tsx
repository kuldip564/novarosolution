import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ServiceEngagement } from "@/components/analytics/ServiceEngagement";
import { Reveal } from "@/components/anim/Reveal";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { PageHead } from "@/components/sections/PageHead";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { getAllBlogPosts, type BlogPost } from "@/lib/blog";
import { getPublishedProjects, getPublishedServices, getSiteContent } from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";
import { getServicePageContent, servicePageContent } from "@/lib/service-page-content";
import {
  buildServiceDetails,
  defaultServicesPage,
  normalizeServicesPage,
  type ServiceDetailView,
} from "@/lib/services-content";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { getWorkProjectImages } from "@/lib/work-project-images";
import { breadcrumbJsonLd, LOCAL_BUSINESS_ID } from "@/lib/structured-data";
import "@/styles/service-page.css";
import { jsonLdString } from "@/lib/json-ld";

/** Articles that answer questions about each service (internal links for readers and crawlers). */
const relatedPostSlugs: Record<string, string[]> = {
  "web-app-eng": ["saas-mvp-cost-factors", "web-app-development-expect", "custom-vs-off-the-shelf"],
  "ai-machine-ml": ["ai-prod-apps", "ship-fast-stack", "hire-it-services-company"],
  "digital-marketing": ["tech-seo-tips", "web-app-development-expect", "working-with-us-teams"],
  "cloud-devops": ["ship-fast-stack", "web-app-development-expect", "hire-it-services-company"],
};

const toc = [
  { id: "overview", label: "Overview" },
  { id: "problems", label: "Problems we solve" },
  { id: "scope", label: "What's included" },
  { id: "process", label: "Process" },
  { id: "case-studies", label: "Case studies" },
  { id: "faq", label: "FAQ" },
];

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
  const copy = getServicePageContent(service.slug);

  return createPageMetadata({
    title: copy?.seoTitle ?? service.title,
    description: copy?.metaDescription ?? service.description,
    ogEyebrow: "Services",
    ogHeadline: copy?.h1,
    path: `/services/${service.slug}`,
    keywords: copy?.keywords ?? [service.title, ...service.tools],
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await loadService(slug);
  if (!service) notFound();
  const copy = getServicePageContent(service.slug);
  // A service added in the admin without long-form copy still gets a page: the
  // CMS fields render on their own.
  const name = copy?.name ?? service.title;
  const h1 = copy?.h1 ?? service.title;

  const [allPosts, dbProjects] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getPublishedProjects().catch(() => []),
  ]);
  const wanted = relatedPostSlugs[service.slug] ?? [];
  const relatedPosts = [
    ...wanted.map((postSlug) => allPosts.find((post) => post.slug === postSlug)).filter((post): post is BlogPost => Boolean(post)),
    ...allPosts.filter((post) => !wanted.includes(post.slug)),
  ].slice(0, 3);

  const projects = mapDbProjectsToWork(dbProjects);
  const caseStudies = (copy?.caseStudies.items ?? [])
    .map((item) => {
      const project = projects.find((entry) => entry.slug === item.slug);
      return project ? { ...item, project } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const relatedServices = (copy?.related ?? [])
    .map((relatedSlug) => servicePageContent[relatedSlug])
    .filter(Boolean);

  const path = `/services/${service.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${siteBaseUrl()}${path}#service`,
      name: h1,
      serviceType: name,
      description: copy?.metaDescription ?? service.description,
      url: `${siteBaseUrl()}${path}`,
      areaServed: "Worldwide",
      provider: { "@id": LOCAL_BUSINESS_ID },
      ...(copy
        ? {
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: copy.scope.title,
              itemListElement: copy.scope.items.map((item) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: item.title, description: item.body },
              })),
            },
          }
        : {}),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name, path },
    ]),
  ];

  return (
    <main className="svcp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <ServiceEngagement service={service.slug} />
      <PageHead
        eyebrow={copy?.eyebrow ?? "Services"}
        title={h1}
        description={copy?.lede ?? service.description}
        className="svcp-head"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: name },
        ]}
      >
        <Reveal delay={0.26}>
          <div className="svcp-head__actions">
            <Button href={`/contact?service=${service.slug}`}>{copy?.cta.buttonLabel ?? "Start Your Project"}</Button>
            {caseStudies.length > 0 ? (
              <Button href="#case-studies" variant="ghost">
                View Case Studies
              </Button>
            ) : null}
          </div>
        </Reveal>
        {copy ? (
          <nav className="svcp-toc" aria-label="On this page">
            {toc
              .filter((item) => item.id !== "case-studies" || caseStudies.length > 0)
              .map((item) => (
                <a key={item.id} href={`#${item.id}`}>
                  {item.label}
                </a>
              ))}
          </nav>
        ) : null}
      </PageHead>

      {/* 2 · Introduction */}
      <section id="overview" className="svcp-sec svcp-intro" aria-labelledby="svcp-intro-title">
        <div className="wrap svcp-intro__grid">
          <Reveal className="svcp-intro__copy">
            <span className="eyebrow">Overview</span>
            <h2 id="svcp-intro-title" className="svcp-h2">
              {copy?.intro.title ?? name}
            </h2>
            {(copy?.intro.paragraphs ?? [service.description]).map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </Reveal>
          {service.media?.src ? (
            <Reveal delay={0.08}>
              <figure className="svcp-intro__figure">
                {/* Often the largest element on desktop, so it loads eagerly; next/image serves
                    a size that fits the column instead of the full 1280px file. */}
                <Image
                  src={service.media.src}
                  alt={service.media.alt}
                  width={service.media.width}
                  height={service.media.height}
                  loading="eager"
                  sizes="(max-width: 959px) 100vw, 520px"
                  quality={90}
                  unoptimized={!service.media.src.startsWith("/images/")}
                />
              </figure>
            </Reveal>
          ) : null}
        </div>
      </section>

      {copy ? (
        <>
          {/* 3 · Problems  ·  4 · How we solve them */}
          <section id="problems" className="svcp-sec svcp-sec--tint" aria-labelledby="svcp-problems-title">
            <div className="wrap svcp-split">
              <div>
                <header className="svcp-sec-head">
                  <span className="eyebrow">The problem</span>
                  <h2 id="svcp-problems-title" className="svcp-h2">
                    {copy.problems.title}
                  </h2>
                </header>
                <ul className="svcp-list svcp-list--problems">
                  {copy.problems.items.map((item, index) => (
                    <Reveal as="li" key={item.title} delay={0.04 * index} className="svcp-item">
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </Reveal>
                  ))}
                </ul>
              </div>
              <div>
                <header className="svcp-sec-head">
                  <span className="eyebrow">Our approach</span>
                  <h2 className="svcp-h2">{copy.approach.title}</h2>
                </header>
                <ol className="svcp-list svcp-list--approach">
                  {copy.approach.items.map((item, index) => (
                    <Reveal as="li" key={item.title} delay={0.04 * index} className="svcp-item">
                      <span className="svcp-item__num" aria-hidden>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* 5 · Scope  ·  6 · Technologies */}
          <section id="scope" className="svcp-sec" aria-labelledby="svcp-scope-title">
            <div className="wrap">
              <header className="svcp-sec-head">
                <span className="eyebrow">Scope</span>
                <h2 id="svcp-scope-title" className="svcp-h2">
                  {copy.scope.title}
                </h2>
              </header>
              <ul className="svcp-scope">
                {copy.scope.items.map((item, index) => (
                  <Reveal as="li" key={item.title} delay={0.03 * index} className="svcp-scope__item">
                    <span className="svcp-scope__icon" aria-hidden>
                      <Check size={16} strokeWidth={2.4} />
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>

              <div className="svcp-tech">
                <h2 className="svcp-h3">Technologies we use</h2>
                <dl className="svcp-tech__grid">
                  {copy.technologies.map((group) => (
                    <div key={group.group} className="svcp-tech__group">
                      <dt>{group.group}</dt>
                      <dd>
                        <ul>
                          {group.items.map((tool) => (
                            <li key={tool}>{tool}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* 7 · Process */}
          <section id="process" className="svcp-sec svcp-sec--tint" aria-labelledby="svcp-process-title">
            <div className="wrap">
              <header className="svcp-sec-head">
                <span className="eyebrow">Process</span>
                <h2 id="svcp-process-title" className="svcp-h2">
                  {copy.process.title}
                </h2>
              </header>
              <ol className="svcp-steps" style={{ "--steps": copy.process.steps.length } as CSSProperties}>
                {copy.process.steps.map((step, index) => (
                  <Reveal as="li" key={step.title} delay={0.05 * index} className="svcp-step">
                    <span className="svcp-step__num" aria-hidden>
                      {index + 1}
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </Reveal>
                ))}
              </ol>
              <p className="svcp-note">{copy.process.note}</p>
            </div>
          </section>

          {/* 8 · Benefits and practical examples */}
          <section className="svcp-sec" aria-labelledby="svcp-benefits-title">
            <div className="wrap">
              <header className="svcp-sec-head">
                <span className="eyebrow">Benefits</span>
                <h2 id="svcp-benefits-title" className="svcp-h2">
                  {copy.benefits.title}
                </h2>
              </header>
              <ul className="svcp-benefits">
                {copy.benefits.items.map((item, index) => (
                  <Reveal as="li" key={item.title} delay={0.04 * index} className="svcp-card">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </Reveal>
                ))}
              </ul>

              <header className="svcp-sec-head svcp-sec-head--spaced">
                <h2 className="svcp-h3">{copy.examples.title}</h2>
                {copy.examples.lede ? <p>{copy.examples.lede}</p> : null}
              </header>
              <ul className="svcp-examples">
                {copy.examples.items.map((item, index) => (
                  <Reveal as="li" key={item.title} delay={0.04 * index} className="svcp-card svcp-card--example">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    {item.href ? (
                      <Link href={item.href} className="svcp-more">
                        {item.linkLabel}
                        <ArrowRight size={15} aria-hidden />
                      </Link>
                    ) : null}
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>

          {/* 9 · Case studies */}
          {caseStudies.length > 0 ? (
            <section id="case-studies" className="svcp-sec svcp-sec--tint" aria-labelledby="svcp-work-title">
              <div className="wrap">
                <header className="svcp-sec-head">
                  <span className="eyebrow">Case studies</span>
                  <h2 id="svcp-work-title" className="svcp-h2">
                    {copy.caseStudies.title}
                  </h2>
                  {copy.caseStudies.lede ? <p>{copy.caseStudies.lede}</p> : null}
                </header>
                <ul className="svcp-work">
                  {caseStudies.map(({ slug: projectSlug, note, project }, index) => (
                    <Reveal as="li" key={projectSlug} delay={0.05 * index}>
                      <Link href={`/work/${projectSlug}`} className="svcp-work__card">
                        {project.heroImage ? (
                          <CloudinaryImage
                            asset={project.heroImage}
                            alt={getWorkProjectImages(projectSlug)?.heroAlt ?? `${project.title} — ${project.category}`}
                            width={640}
                            height={400}
                            transformWidth={640}
                            className="svcp-work__img"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                          />
                        ) : null}
                        <span className="svcp-work__body">
                          <span className="svcp-work__cat">{project.category}</span>
                          <strong>{project.title}</strong>
                          <span className="svcp-work__note">{note}</span>
                          <span className="svcp-more">
                            Read the case study
                            <ArrowRight size={15} aria-hidden />
                          </span>
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {/* 10 · FAQs (visible content only; no FAQPage markup, see docs/seo-growth.md) */}
          <section id="faq" className="svcp-sec" aria-labelledby="svcp-faq-title">
            <div className="wrap svcp-faq">
              <header className="svcp-sec-head">
                <span className="eyebrow">FAQ</span>
                <h2 id="svcp-faq-title" className="svcp-h2">
                  {copy.faqTitle}
                </h2>
                <p>
                  Something else? <Link href="/contact">Ask us directly</Link>; we reply within one business day.
                </p>
              </header>
              <FaqAccordion
                items={copy.faqs.map((faq, index) => ({ id: `${service.slug}-${index}`, ...faq }))}
              />
            </div>
          </section>

          {/* 11 · Related services */}
          {relatedServices.length > 0 ? (
            <section className="svcp-sec svcp-sec--tint svcp-sec--compact" aria-labelledby="svcp-related-title">
              <div className="wrap">
                <header className="svcp-sec-head">
                  <span className="eyebrow">Related services</span>
                  <h2 id="svcp-related-title" className="svcp-h2">
                    Services that work alongside this one
                  </h2>
                </header>
                <ul className="svcp-related">
                  {relatedServices.map((related) => (
                    <li key={related.slug}>
                      <Link href={`/services/${related.slug}`} className="svcp-related__card">
                        <h3>{related.name}</h3>
                        <p>{related.cardSummary}</p>
                        <ArrowUpRight size={18} className="svcp-related__go" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="svcp-related__all">
                  <Link href="/services">All software, AI and marketing services</Link>
                </p>
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <section className="svcp-sec">
          <div className="wrap">
            <h2 className="svcp-h2">What&apos;s included</h2>
            <ul className="svcp-scope">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="svcp-scope__item">
                  <span className="svcp-scope__icon" aria-hidden>
                    <Check size={16} strokeWidth={2.4} />
                  </span>
                  <div>
                    <p>{bullet}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {relatedPosts.length > 0 ? (
        <section className="svcp-sec svc-reading" aria-labelledby="svc-reading-title">
          <div className="wrap">
            <header className="svc-reading__head">
              <span className="eyebrow">Related reading</span>
              <h2 id="svc-reading-title">Read before you start a project</h2>
            </header>
            <div className="blog-grid compact">
              {relatedPosts.map((post, index) => (
                <BlogPostCard key={post.id} post={post} delay={index * 0.06} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 12 · Contact CTA */}
      <CtaBand
        eyebrow="Let's talk"
        title={copy?.cta.title ?? `Talk to us about ${name}`}
        description={
          copy?.cta.description ??
          "Tell us the problem. We'll reply within one business day with a path, timeline, and team."
        }
        buttonLabel={copy?.cta.buttonLabel ?? "Start Your Project"}
        buttonHref={`/contact?service=${service.slug}`}
      />
    </main>
  );
}
