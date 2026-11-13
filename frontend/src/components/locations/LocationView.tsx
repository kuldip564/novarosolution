import Link from "next/link";
import { ArrowUpRight, Check, MapPin, ShieldCheck, Users } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import { MarketCard } from "@/components/locations/LocationCard";
import { TimezoneOverlap } from "@/components/locations/TimezoneOverlap";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { LocalPresence } from "@/components/sections/LocalPresence";
import { PageHead } from "@/components/sections/PageHead";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import type { TestimonialView } from "@/components/sections/TestimonialsSection";
import type { WorkProjectView } from "@/lib/content-mappers";
import { googleMapsUrl } from "@/lib/geo-seo";
import { markets, type LocationEntry } from "@/lib/locations";
import { site } from "@/lib/site-data";
import { siteBaseUrl } from "@/lib/site-metadata";
import {
  areasServed,
  breadcrumbJsonLd,
  LOCAL_BUSINESS_ID,
  ORGANIZATION_ID,
  webPageJsonLd,
} from "@/lib/structured-data";
import { jsonLdString } from "@/lib/json-ld";

const serviceLinks = [
  { href: "/services/web-app-eng", label: "Web & app development" },
  { href: "/services/ai-machine-ml", label: "AI & machine learning" },
  { href: "/services/digital-marketing", label: "Digital marketing & SEO" },
  { href: "/services/cloud-devops", label: "Cloud & DevOps" },
  { href: "/work", label: "Case studies" },
];

function areaServedJsonLd(location: LocationEntry) {
  if (location.kind === "city") {
    // Each local page names its own city (Gandhinagar's includes GIFT City, which sits within it).
    const names = location.slug === "gandhinagar" ? ["Gandhinagar", "GIFT City"] : [location.name];
    return areasServed.filter((area) => names.includes(area.name));
  }
  if (location.kind === "region") return { "@type": "Place", name: location.name };
  return { "@type": "Country", name: location.name, identifier: location.isoCode };
}

function locationJsonLd(location: LocationEntry, path: string) {
  const url = `${siteBaseUrl()}${path}`;
  return [
    webPageJsonLd({
      path,
      name: location.seoTitle,
      description: location.seoDescription,
      about: LOCAL_BUSINESS_ID,
    }),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: location.h1,
      serviceType: "Custom software development",
      description: location.seoDescription,
      url,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: areaServedJsonLd(location),
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${siteBaseUrl()}/contact`,
        servicePhone: site.phone.replace(/\s/g, ""),
        availableLanguage: ["English", "Hindi", "Gujarati"],
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Services for ${location.name}`,
        itemListElement: serviceLinks.slice(0, 4).map((service) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service.label, url: `${siteBaseUrl()}${service.href}` },
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Locations", path: "/locations" },
      { name: location.name, path },
    ]),
  ];
}

/** Orders testimonials so those whose role mentions one of `preferred` (e.g. "Gujarat") come first. */
export function pickTestimonials(items: TestimonialView[], preferred: string[]): TestimonialView[] {
  const score = (item: TestimonialView) =>
    preferred.findIndex((word) => item.role.toLowerCase().includes(word.toLowerCase()));
  return [...items].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    return (sa === -1 ? 99 : sa) - (sb === -1 ? 99 : sb);
  });
}

type LocationViewProps = {
  location: LocationEntry;
  /** URL path of the page rendering this view (used for schema and breadcrumbs). */
  path: string;
  /** Real case studies from the portfolio. */
  projects?: WorkProjectView[];
  /** Real client testimonials already published on the site (shown as quotes; no review markup). */
  testimonials?: TestimonialView[];
};

/** Full location landing page — shared by /locations/[slug] and /software-development-usa. */
export function LocationView({ location, path, projects = [], testimonials = [] }: LocationViewProps) {
  const isLocal = location.group === "india" && location.kind === "city";
  const inName = location.inName ?? location.name;
  const otherMarkets = markets.filter((market) => market.href !== path).slice(0, 4);
  const faqItems = location.faqs.map((faq, index) => ({ id: `${location.slug}-faq-${index}`, ...faq }));
  return (
    <main className="loc-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(locationJsonLd(location, path)) }}
      />
      <PageHead
        eyebrow={location.eyebrow}
        title={location.h1}
        description={location.lede}
        className="loc-head"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Locations", href: "/locations" },
          { label: location.name },
        ]}
      >
        <Reveal delay={0.25} className="loc-head__actions">
          <Button href="/contact">Book a Consultation</Button>
          <Button href="/work" variant="ghost">
            View Case Studies
          </Button>
        </Reveal>
      </PageHead>

      <section className="sec loc-sec" aria-label={`${location.name} at a glance`}>
        <div className="wrap">
          <ul className="loc-facts">
            {location.facts.map((fact, index) => (
              <Reveal as="li" key={fact.label} delay={0.04 * index} className="loc-fact">
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </Reveal>
            ))}
          </ul>

          {location.localContext ? (
            <Reveal className="loc-card loc-card--context">
              <h2 className="loc-card__title">{location.localContext.title}</h2>
              <p className="loc-card__body">{location.localContext.body}</p>
            </Reveal>
          ) : null}

          {location.localServices?.length ? (
            <div className="loc-services">
              <header className="loc-section-head loc-section-head--left">
                <span className="eyebrow">Services</span>
                <h2>Services for {location.name} businesses</h2>
              </header>
              <ul className="loc-services__grid">
                {location.localServices.map((service, index) => (
                  <Reveal as="li" key={service.title} delay={0.04 * index}>
                    <Link href={service.href} className="loc-service">
                      <h3>{service.title}</h3>
                      <p>{service.body}</p>
                      <span className="loc-service__more">
                        Learn more <ArrowUpRight size={14} aria-hidden />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="loc-grid">
            <Reveal className="loc-card">
              <header className="loc-card__head">
                <span className="loc-card__icon" aria-hidden>
                  <Users size={20} strokeWidth={1.8} />
                </span>
                <h2 className="loc-card__title">How we work with {location.kind === "city" ? `${location.name} teams` : `teams in ${inName}`}</h2>
              </header>
              <ol className="loc-steps">
                {location.howWeWork.map((step, index) => (
                  <li key={step}>
                    <span className="loc-steps__no">{String(index + 1).padStart(2, "0")}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.08} className="loc-card">
              <header className="loc-card__head">
                <span className="loc-card__icon" aria-hidden>
                  <Check size={20} strokeWidth={1.8} />
                </span>
                <h2 className="loc-card__title">What {location.kind === "city" ? `${location.name} companies` : `companies in ${inName}`} hire us for</h2>
              </header>
              <ul className="loc-checks">
                {location.hireUsFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <nav className="loc-links" aria-label="Related services">
                {serviceLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </Reveal>
          </div>

          {location.timezone ? (
            <Reveal>
              <TimezoneOverlap timezone={location.timezone} />
            </Reveal>
          ) : null}

          {projects.length > 0 ? (
            <div className="loc-work">
              <header className="loc-section-head loc-section-head--left">
                <span className="eyebrow">Our work</span>
                <h2>Products we&apos;ve shipped</h2>
              </header>
              <ul className="loc-work__grid">
                {projects.slice(0, 4).map((project, index) => (
                  <Reveal as="li" key={project.slug} delay={0.04 * index}>
                    <Link href={`/work/${project.slug}`} className="loc-work__card">
                      {project.heroImage ? (
                        <CloudinaryImage
                          asset={project.heroImage}
                          alt={`${project.title} — ${project.category}`}
                          width={480}
                          height={360}
                          transformWidth={480}
                          className="loc-work__img"
                          sizes="(max-width: 640px) 50vw, 280px"
                        />
                      ) : null}
                      <span className="loc-work__meta">
                        <span className="loc-card__eyebrow">{project.category}</span>
                        <strong>{project.title}</strong>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </div>
          ) : null}

          {testimonials.length > 0 ? (
            <div className="loc-quotes">
              <header className="loc-section-head loc-section-head--left">
                <span className="eyebrow">Client voices</span>
                <h2>What clients say</h2>
              </header>
              <ul className="loc-quotes__grid">
                {testimonials.slice(0, 2).map((item) => (
                  <Reveal as="li" key={item.id} className="loc-quote">
                    <blockquote>{item.quote}</blockquote>
                    <p className="loc-quote__by">
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </p>
                  </Reveal>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="loc-grid">
            <Reveal className="loc-card loc-card--accent">
              <header className="loc-card__head">
                <span className="loc-card__icon" aria-hidden>
                  <ShieldCheck size={20} strokeWidth={1.8} />
                </span>
                <h2 className="loc-card__title">{location.data.title}</h2>
              </header>
              <p className="loc-card__body">{location.data.body}</p>
              <Link href="/privacy-policy" className="loc-card__more">
                Read our privacy policy <ArrowUpRight size={15} aria-hidden />
              </Link>
            </Reveal>

            <Reveal delay={0.08} className="loc-card">
              <header className="loc-card__head">
                <span className="loc-card__icon" aria-hidden>
                  <MapPin size={20} strokeWidth={1.8} />
                </span>
                <h2 className="loc-card__title">
                  {location.kind === "city" ? `Areas we cover around ${location.name}` : `Where we work in ${inName}`}
                </h2>
              </header>
              <ul className="loc-pills" aria-label={`Areas served in ${inName}`}>
                {location.areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
              {location.inPerson ? (
                <p className="loc-card__body loc-card__body--small">{location.inPerson}</p>
              ) : (
                <p className="loc-card__body loc-card__body--small">
                  We work remotely from our studio in {site.geo.addressLocality}, Gujarat, India. No local office —
                  just one accountable team, a shared channel, and a working build every week.
                </p>
              )}
              {isLocal ? (
                <a href={googleMapsUrl()} className="loc-card__more" target="_blank" rel="noopener noreferrer">
                  Directions to the studio <ArrowUpRight size={15} aria-hidden />
                </a>
              ) : null}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec loc-faq" aria-labelledby="loc-faq-title">
        <div className="wrap">
          <header className="loc-section-head">
            <span className="eyebrow center">FAQ</span>
            <h2 id="loc-faq-title">Questions from {location.kind === "city" ? `${location.name} teams` : `teams in ${inName}`}</h2>
          </header>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {isLocal ? <LocalPresence variant="contact" /> : null}

      <section className="sec loc-related" aria-labelledby="loc-related-title">
        <div className="wrap">
          <header className="loc-section-head">
            <span className="eyebrow center">Where else we work</span>
            <h2 id="loc-related-title">Teams across India and abroad</h2>
          </header>
          <ul className="loc-cards">
            {otherMarkets.map((market) => (
              <li key={market.slug}>
                <MarketCard market={market} />
              </li>
            ))}
          </ul>
          <p className="loc-related__all">
            <Link href="/locations">See every market we serve</Link>
          </p>
        </div>
      </section>

      <CtaBand
        eyebrow={location.name}
        title={`Tell us what you need built`}
        description={`A short brief is enough. We reply within one business day with a time for a call${location.timezone ? ` that suits ${location.timezone.city}` : ""}.`}
        buttonLabel="Book a Consultation"
        buttonHref="/contact"
      />
    </main>
  );
}
