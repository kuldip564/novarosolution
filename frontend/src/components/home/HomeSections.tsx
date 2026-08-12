"use client";

import Link from "next/link";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { Counter } from "@/components/anim/Counter";
import { Reveal } from "@/components/anim/Reveal";
import { SplitText } from "@/components/anim/SplitText";
import { Tilt } from "@/components/anim/Tilt";
import { Button } from "@/components/Button";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { LocalPresence } from "@/components/sections/LocalPresence";
import { mapDbLogos, type LogoView } from "@/components/sections/LogoStrip";
import { mapDbTestimonials, type TestimonialView } from "@/components/sections/TestimonialsSection";
import type { DbClientLogo, DbProject, DbService, DbTestimonial } from "@/lib/content";
import {
  mapDbProjectsToHomeGrid,
  mapDbServicesToGrid,
  type HomeProjectView,
  type ServiceGridView,
} from "@/lib/content-mappers";
import { isExternalProjectHref } from "@/lib/project-link";
import { useMotionSettings } from "@/lib/motion-provider";
import { capabilities, homeStats, processSteps } from "@/lib/site-data";
import type { HomeSectionsContent } from "@/lib/page-content-defaults";
import type { FaqItem } from "@/components/sections/FaqSection";

type HomeSectionsProps = {
  projects: DbProject[];
  services: DbService[];
  stats: typeof homeStats;
  cta: { title: string; description: string };
  marquee: readonly string[];
  steps: typeof processSteps;
  testimonials: DbTestimonial[];
  logos: DbClientLogo[];
  faqs: FaqItem[];
  sections: HomeSectionsContent;
};

function ServiceIcon({ type }: { type: string }) {
  if (type === "monitor") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M3 5h18v12H3z" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    );
  }
  if (type === "ai") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      </svg>
    );
  }
  if (type === "cloud") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M7 18h11a4 4 0 000-8 5 5 0 00-9.9-1.1A3.5 3.5 0 007 18z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M3 17l5-5 4 4 8-9" />
      <path d="M21 7v5h-5" />
    </svg>
  );
}

function ServiceCard({
  service,
  index,
  tilt,
}: {
  service: ServiceGridView;
  index: number;
  tilt: boolean;
}) {
  const card = (
    <article className="home-svc-card">
      {service.imageAsset ? (
        <div className="home-svc-card__media">
          <CloudinaryImage
            asset={service.imageAsset}
            alt={service.title}
            width={640}
            height={360}
            transformWidth={640}
            className="home-svc-card__img"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      <div className="home-svc-card__body">
        <div className="home-svc-card__top">
          <div className="home-svc-card__icon">
            <ServiceIcon type={service.icon} />
          </div>
          <span className="home-svc-card__no">{service.id}</span>
        </div>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <div className="home-svc-card__tags">
          {service.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );

  return (
    <Reveal delay={0.08 + index * 0.08} className="home-svc-grid__cell">
      {tilt ? <Tilt className="home-svc-card-wrap">{card}</Tilt> : card}
    </Reveal>
  );
}

export function HomeSections({
  projects,
  services,
  stats,
  cta,
  marquee,
  steps,
  testimonials,
  logos,
  faqs,
  sections,
}: HomeSectionsProps) {
  const { reducedMotion, performanceTier } = useMotionSettings();
  const cinematic = !reducedMotion && performanceTier === "high";
  const tilt = cinematic && performanceTier === "high";

  const serviceItems = mapDbServicesToGrid(services);
  const projectItems = mapDbProjectsToHomeGrid(projects);
  const logoItems = mapDbLogos(logos);
  const testimonialItems = mapDbTestimonials(testimonials);
  const marqueeTrack = marquee.length ? [...marquee, ...marquee] : [];
  const practiceLabel =
    serviceItems.length === 1
      ? sections.services.practiceSingular
      : sections.services.practicePlural.replace("{count}", String(serviceItems.length));
  const servicesTitle = `${practiceLabel}\n${sections.services.titleSuffix}`;

  return (
    <>
      {marqueeTrack.length > 0 && (
        <div className="home-scene home-marquee" aria-hidden>
          <div className="home-marquee__track">
            {marqueeTrack.map((item, index) => (
              <span key={`${item}-${index}`} className="home-marquee__item">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {logoItems.length > 0 && (
        <section
          id="social-proof"
          className="home-scene home-logos light"
          aria-label="Trusted by"
        >
          <div className="wrap">
            <Reveal>
              <p className="home-logos__label">{sections.logos.label}</p>
            </Reveal>
            <div className="home-logos__strip">
              {logoItems.map((item: LogoView, index) => (
                <Reveal key={item.id} delay={0.04 + index * 0.05}>
                  <div className="home-logos__item">
                    {item.image && (
                      <CloudinaryImage
                        asset={item.image}
                        alt={item.name}
                        width={120}
                        height={48}
                        transformWidth={240}
                        className="home-logos__img"
                      />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-scene home-services" id="services">
        <div className="wrap">
          <header className="home-section-head">
            <Reveal>
              <span className="eyebrow">{sections.services.eyebrow}</span>
            </Reveal>
            <SplitText
              text={servicesTitle}
              as="h2"
              className="home-section-head__title"
            />
            <Reveal delay={0.08}>
              <p className="home-section-head__lede">{sections.services.description}</p>
            </Reveal>
          </header>

          <div className="home-svc-grid">
            {serviceItems.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} tilt={tilt} />
            ))}
          </div>

          <div className="home-cap-strip" role="list" aria-label="Additional capabilities">
            {capabilities.slice(0, 6).map((cap, index) => (
              <Reveal key={cap} delay={0.06 + index * 0.04}>
                <span className="home-cap-pill" role="listitem">
                  {cap}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal className="home-section-foot">
            <Button href="/services" variant="ghost">
              Explore all services
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="home-scene home-work" id="work-preview">
        <div className="wrap">
          <header className="home-section-head">
            <Reveal>
              <span className="eyebrow">{sections.work.eyebrow}</span>
            </Reveal>
            <SplitText
              text={sections.work.title}
              as="h2"
              className="home-section-head__title"
            />
            <Reveal delay={0.08}>
              <p className="home-section-head__lede">{sections.work.description}</p>
            </Reveal>
          </header>

          <div className="home-work-grid">
            {projectItems.map((project: HomeProjectView, index) => (
              <Reveal key={project.title} delay={0.08 + index * 0.07}>
                {isExternalProjectHref(project.href) ? (
                  <a
                    href={project.href}
                    className="home-work-card"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.imageAsset?.secureUrl ? (
                      <div className="home-work-card__cover home-work-card__cover--photo">
                        <CloudinaryImage
                          asset={project.imageAsset}
                          alt={project.title}
                          width={800}
                          height={560}
                          transformWidth={640}
                          className="home-work-card__img"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                          priority={index === 0}
                        />
                      </div>
                    ) : (
                      <div className={`home-work-card__cover ${project.cover}`}>
                        <div className="home-work-card__mesh" />
                      </div>
                    )}
                    <div className="home-work-card__arrow" aria-hidden>
                      <svg viewBox="0 0 24 24">
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="home-work-card__meta">
                      <span className="home-work-card__cat">{project.category}</span>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                  </a>
                ) : (
                  <Link href={project.href} className="home-work-card">
                    {project.imageAsset?.secureUrl ? (
                      <div className="home-work-card__cover home-work-card__cover--photo">
                        <CloudinaryImage
                          asset={project.imageAsset}
                          alt={project.title}
                          width={800}
                          height={560}
                          transformWidth={640}
                          className="home-work-card__img"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                          priority={index === 0}
                        />
                      </div>
                    ) : (
                      <div className={`home-work-card__cover ${project.cover}`}>
                        <div className="home-work-card__mesh" />
                      </div>
                    )}
                    <div className="home-work-card__arrow" aria-hidden>
                      <svg viewBox="0 0 24 24">
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="home-work-card__meta">
                      <span className="home-work-card__cat">{project.category}</span>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                  </Link>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal className="home-section-foot">
            <Button href="/work" variant="ghost">
              View full portfolio
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="home-scene home-stats light" aria-label="Studio stats">
        <div className="wrap">
          <div className="home-stats-grid">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={0.06 + index * 0.06}>
                <div className="home-stat">
                  <Counter value={stat.value} suffix={stat.suffix} className="home-stat__value" />
                  <span className="home-stat__label">{stat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-scene home-testimonials" aria-labelledby="home-testimonials-title">
        <div className="wrap">
          <header className="home-section-head home-section-head--center">
            <Reveal>
              <span className="eyebrow center">{sections.testimonials.eyebrow}</span>
            </Reveal>
            <SplitText
              text={sections.testimonials.title}
              as="h2"
              className="home-section-head__title"
            />
            <Reveal delay={0.08}>
              <p className="home-section-head__lede">{sections.testimonials.description}</p>
            </Reveal>
          </header>

          <div className="home-testimonials-grid">
            {testimonialItems.map((item: TestimonialView, index) => (
              <Reveal key={item.id} delay={0.08 + index * 0.08}>
                <article className="home-testimonial">
                  <div className="home-testimonial__stars" aria-label={`${item.rating} out of 5 stars`}>
                    {"★".repeat(Math.min(5, Math.max(1, item.rating)))}
                  </div>
                  <blockquote>{item.quote}</blockquote>
                  <footer>
                    {item.avatar?.secureUrl ? (
                      <CloudinaryImage
                        asset={item.avatar}
                        alt=""
                        width={44}
                        height={44}
                        transformWidth={88}
                        className="home-testimonial__avatar"
                      />
                    ) : (
                      <span className="home-testimonial__avatar-fallback">{item.name.charAt(0)}</span>
                    )}
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </div>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-scene home-process light" aria-labelledby="home-process-title">
        <div className="wrap">
          <header className="home-section-head home-section-head--center">
            <Reveal>
              <span className="eyebrow center">{sections.process.eyebrow}</span>
            </Reveal>
            <SplitText
              text={sections.process.title}
              as="h2"
              className="home-section-head__title"
            />
            <Reveal delay={0.08}>
              <p className="home-section-head__lede">{sections.process.description}</p>
            </Reveal>
          </header>

          <ol className="home-process-grid">
            {steps.map((step, index) => (
              <Reveal key={step.num} delay={0.08 + index * 0.07}>
                <li className="home-process-step">
                  <span className="home-process-step__num">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <LocalPresence variant="home" />

      {faqs.length > 0 && (
        <section className="home-scene home-faq" aria-labelledby="home-faq-title">
          <div className="wrap">
            <header className="home-section-head home-section-head--center">
              <Reveal>
                <span className="eyebrow center">{sections.faq.eyebrow}</span>
              </Reveal>
              <SplitText
                text={sections.faq.title}
                as="h2"
                className="home-section-head__title"
              />
              <Reveal delay={0.08}>
                <p className="home-section-head__lede">{sections.faq.description}</p>
              </Reveal>
            </header>
            <FaqAccordion items={faqs} />
          </div>
        </section>
      )}

      <section className="home-scene home-cta" aria-labelledby="home-cta-title">
        <div className="wrap">
          <Reveal>
            <div className="home-cta__band">
              <div className="home-cta__mesh" aria-hidden />
              <div className="home-cta__grid" aria-hidden />
              <div className="home-cta__inner">
                <span className="eyebrow center">{sections.cta.eyebrow}</span>
                <SplitText text={cta.title} as="h2" className="home-cta__title" />
                <p>{cta.description}</p>
                <Button href="/contact">{sections.cta.buttonLabel}</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
