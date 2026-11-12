import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  Cloud,
  Database,
  Gauge,
  Palette,
  Plug,
  Shield,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/Button";
import { ServicesHeroVisual } from "@/components/services/ServicesHeroVisual";
import { StudioProcess } from "@/components/studio/StudioProcess";
import { StudioSectionHead } from "@/components/studio/StudioSectionHead";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { CapabilityItem, ProcessStepView, ServiceDetailView, ServicesPageContent } from "@/lib/services-content";
import type { WorkProject } from "@/lib/work-portfolio";

/* ───────────────────────── 01 · Hero ───────────────────────── */

export function ServicesHero({
  services,
  lede,
  liveProducts,
}: {
  services: ServiceDetailView[];
  lede: string;
  liveProducts: number;
}) {
  const lines = ["Software, AI", "& marketing,", "built to ship."];
  return (
    <section className="st-hero sv-hero" aria-labelledby="sv-hero-title" data-cta-location="services-hero">
      <ServicesHeroVisual />
      <div className="wrap st-hero__inner">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} className="st-hero__crumbs" />
        <p className="st-eyebrow st-hero__eyebrow">Services · {services.length} practices</p>
        <h1 id="sv-hero-title" className="st-hero__title">
          {lines.map((line, index) => (
            <span key={line} className={`st-mask${index === lines.length - 1 ? " st-mask--accent" : ""}`}>
              <span style={{ ["--line" as string]: index }}>{line}</span>
              {index < lines.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p className="st-hero__lede">{lede}</p>
        <div className="st-hero__actions">
          <Button href="/contact">Start Your Project</Button>
          <Button href="/work" variant="ghost">
            View Case Studies
          </Button>
        </div>
        <div className="st-hero__foot">
          <nav className="sv-hero__practices" aria-label="Jump to a practice">
            {services.map((service) => (
              <a key={service.slug} href={`#service-${service.slug}`}>
                <span>{service.no}</span>
                {service.title}
              </a>
            ))}
          </nav>
          <dl className="st-stats sv-hero__stats">
            <div>
              <dt>Core practices</dt>
              <dd>{String(services.length).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Live client products</dt>
              <dd>{String(liveProducts).padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Reply time on new enquiries</dt>
              <dd>
                1<small>day</small>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 02 · Practices ───────────────────────── */

function Practice({
  service,
  index,
  proof,
}: {
  service: ServiceDetailView;
  index: number;
  proof: WorkProject[];
}) {
  const titleId = `service-title-${service.slug}`;
  // Case studies already appear under "Proof in production"; other links are further reading.
  const reading = service.relatedLinks.filter((link) => !link.href.startsWith("/work"));
  return (
    <article
      id={`service-${service.slug}`}
      className={`sv-practice${index % 2 === 1 ? " sv-practice--flip" : ""}`}
      aria-labelledby={titleId}
      data-cta-location={`services-${service.slug}`}
    >
      <div className="sv-practice__media" data-st-reveal>
        <figure className="sv-practice__frame">
          {service.media ? (
            <Image
              src={service.media.src}
              alt={service.imageAlt ?? service.media.alt}
              width={service.media.width}
              height={service.media.height}
              sizes="(max-width: 1023px) 100vw, 46vw"
            />
          ) : (
            <span className="sv-practice__placeholder" aria-hidden="true">
              {service.no}
            </span>
          )}
        </figure>
        <span className="sv-practice__no" aria-hidden="true">
          {service.no}
        </span>
      </div>

      <div className="sv-practice__copy">
        <p className="sv-practice__meta" data-st-reveal>
          <span>{service.no}</span> Practice
        </p>
        <h2 id={titleId} className="st-h2 sv-practice__title" data-st-reveal>
          <span className="st-mask">
            <span>{service.title}</span>
          </span>
        </h2>
        <p className="sv-practice__desc" data-st-reveal>
          {service.description}
        </p>

        <div className="sv-practice__cols" data-st-reveal>
          {service.bullets.length ? (
            <div>
              <h3 className="sv-label">What&apos;s included</h3>
              <ul className="sv-checks">
                {service.bullets.map((bullet) => (
                  <li key={bullet}>
                    <Check size={16} strokeWidth={2.4} aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {service.outcomes.length ? (
            <div>
              <h3 className="sv-label">Outcomes you can expect</h3>
              <ul className="sv-outcomes">
                {service.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {service.tools.length ? (
          <div className="sv-practice__block" data-st-reveal>
            <h3 className="sv-label">Tools &amp; stack</h3>
            <ul className="st-tags">
              {service.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {proof.length ? (
          <div className="sv-practice__block" data-st-reveal>
            <h3 className="sv-label">Proof in production</h3>
            <ul className="sv-proof">
              {proof.map((project) => (
                <li key={project.slug}>
                  <Link href={project.href}>
                    <strong>{project.title}</strong>
                    <span>{project.projectType}</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {reading.length ? (
          <div className="sv-practice__block" data-st-reveal>
            <h3 className="sv-label">Related</h3>
            <ul className="sv-reading">
              {reading.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="st-text-link">
                    {link.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="sv-practice__actions" data-st-reveal>
          <Button href={`/services/${service.slug}`}>
            Explore this practice<span className="sr-only">: {service.title}</span>
          </Button>
          <Link href={`/contact?service=${service.slug}`} className="st-text-link">
            Discuss your requirements
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ServicesPractices({
  services,
  proofFor,
}: {
  services: ServiceDetailView[];
  proofFor: Record<string, WorkProject[]>;
}) {
  return (
    <section className="st-section sv-practices" aria-labelledby="sv-practices-title">
      <div className="wrap">
        <StudioSectionHead
          eyebrow="Our practices"
          id="sv-practices-title"
          title={"From first release\nto steady growth."}
          align="split"
          lede="Each practice can run on its own or alongside the others, with one team accountable for the whole product."
        />
        <div className="sv-practices__list">
          {services.map((service, index) => (
            <Practice key={service.slug} service={service} index={index} proof={proofFor[service.slug] ?? []} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── 03 · Capabilities ───────────────────────── */

const capabilityIcons: Record<string, LucideIcon> = {
  cloud: Cloud,
  palette: Palette,
  database: Database,
  plug: Plug,
  shield: Shield,
  gauge: Gauge,
  chart: BarChart3,
  smartphone: Smartphone,
};

export function ServicesCapabilityGrid({ content }: { content: ServicesPageContent["capabilities"] }) {
  return (
    <section className="st-section st-section--alt sv-caps" aria-labelledby="sv-caps-title">
      <div className="wrap">
        <StudioSectionHead
          eyebrow={content.eyebrow}
          id="sv-caps-title"
          title={content.title}
          align="split"
          lede={content.lede}
        />
        <ul className="sv-caps__grid">
          {content.items.map((item: CapabilityItem, index) => {
            const Icon = capabilityIcons[item.icon] ?? Sparkles;
            return (
              <li key={item.title} className="sv-cap" data-st-reveal style={{ ["--i" as string]: index % 4 }}>
                <span className="sv-cap__icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.7} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── 04 · Process ───────────────────────── */

export function ServicesProcessSection({
  content,
  steps,
}: {
  content: ServicesPageContent["process"];
  steps: ProcessStepView[];
}) {
  return (
    <section className="st-section sv-process" aria-labelledby="sv-process-title">
      <div className="wrap">
        <StudioSectionHead eyebrow={content.eyebrow} id="sv-process-title" title={content.title} align="split" lede={content.lede} />
        <StudioProcess
          onWhite
          stages={steps.map((step) => ({ marker: step.num, title: step.title, body: step.description }))}
        />
      </div>
    </section>
  );
}

/* ───────────────────────── 05 · Proof ───────────────────────── */

export function ServicesProof({
  projects,
  practicesFor,
}: {
  projects: WorkProject[];
  practicesFor: Record<string, string[]>;
}) {
  if (!projects.length) return null;
  return (
    <section className="st-section st-section--alt sv-work" aria-labelledby="sv-work-title" data-cta-location="services-work">
      <div className="wrap">
        <StudioSectionHead
          eyebrow="Selected work"
          id="sv-work-title"
          title={"Proof in\nproduction."}
          align="split"
          lede="Every product below is live today, and each case study lists the practices behind it."
          action={
            <Link href="/work" className="st-text-link">
              All case studies
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          }
        />
        <ol className="sv-work__list">
          {projects.map((project, index) => (
            <li key={project.slug} data-st-reveal style={{ ["--i" as string]: index }}>
              <Link href={project.href} className="sv-work__row">
                <span className="sv-work__num">{project.number}</span>
                <span className="sv-work__title">{project.title}</span>
                <span className="sv-work__type">{project.projectType}</span>
                <span className="sv-work__practices">{(practicesFor[project.slug] ?? []).join(" · ")}</span>
                <ArrowUpRight className="sv-work__go" size={20} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
