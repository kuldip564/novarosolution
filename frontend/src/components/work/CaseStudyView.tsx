import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import {
  CAPTURED,
  caseStudyContent,
  type CaseStudyContent,
  type CaseStudyScreenshot,
} from "@/lib/case-study-content";
import type { WorkProjectView } from "@/lib/content-mappers";
import { projectDomain } from "@/lib/project-domain";
import { getWorkProjectImages } from "@/lib/work-project-images";

type Props = {
  content: CaseStudyContent;
  project: WorkProjectView;
  moreProjects: WorkProjectView[];
};

const toc = [
  { id: "overview", label: "Overview" },
  { id: "challenge", label: "Challenge" },
  { id: "approach", label: "Approach" },
  { id: "features", label: "Features" },
  { id: "architecture", label: "Architecture" },
  { id: "screenshots", label: "Screenshots" },
  { id: "outcomes", label: "Outcomes" },
];

function Screenshot({ shot, domain }: { shot: CaseStudyScreenshot; domain: string }) {
  return (
    <figure className={`cs-shot cs-shot--${shot.device}`}>
      <div className={`cs-frame cs-frame--${shot.device}`}>
        {shot.device === "desktop" ? (
          <div className="cs-frame__bar" aria-hidden>
            <span />
            <span />
            <span />
            <em>{domain}</em>
          </div>
        ) : null}
        {/* Local WebP captures, already sized; Next/Image adds a wrapper we don't need. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption>{shot.caption}</figcaption>
    </figure>
  );
}

export function CaseStudyView({ content: c, project, moreProjects }: Props) {
  const domain = projectDomain(c.liveUrl) ?? c.liveUrl;
  const desktopShots = c.screenshots.filter((shot) => shot.device === "desktop");
  const mobileShots = c.screenshots.filter((shot) => shot.device === "mobile");

  return (
    <>
      <PageHead
        eyebrow={`Case study · ${c.industry}`}
        title={c.h1}
        description={c.summary}
        className="cs-head"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/work" },
          { label: c.client },
        ]}
      >
        <Reveal delay={0.26}>
          <div className="cs-head__actions">
            <a href={c.liveUrl} target="_blank" rel="noopener noreferrer" className="cs-live">
              Visit {domain}
              <ArrowUpRight size={16} aria-hidden />
            </a>
            <Button href="/contact" variant="ghost">
              Discuss Your Requirements
            </Button>
          </div>
        </Reveal>
        <nav className="cs-toc" aria-label="On this page">
          {toc.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>
      </PageHead>

      {/* 1 · Project overview */}
      <section id="overview" className="cs-sec" aria-labelledby="cs-overview-title">
        <div className="wrap cs-overview">
          {project.heroImage ? (
            <Reveal className="cs-overview__media">
              <figure className="cs-hero">
                <CloudinaryImage
                  asset={project.heroImage}
                  alt={getWorkProjectImages(project.slug)?.heroAlt ?? `${c.client} — ${c.projectType}`}
                  width={1024}
                  height={1024}
                  transformWidth={1024}
                  className="cs-hero__img"
                  priority
                  sizes="(max-width: 959px) 100vw, 520px"
                />
              </figure>
            </Reveal>
          ) : null}
          <div className="cs-overview__copy">
            <span className="eyebrow">Project overview</span>
            <h2 id="cs-overview-title" className="cs-h2">
              What we built for {c.client}
            </h2>
            {c.overview.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="cs-lead">
                {paragraph}
              </p>
            ))}
            <dl className="cs-facts">
              <div>
                <dt>Client</dt>
                <dd>{c.client}</dd>
              </div>
              <div>
                <dt>Industry</dt>
                <dd>{c.industry}</dd>
              </div>
              <div>
                <dt>Project type</dt>
                <dd>{c.projectType}</dd>
              </div>
              <div>
                <dt>Platform</dt>
                <dd>{c.platform}</dd>
              </div>
              <div>
                <dt>Live site</dt>
                <dd>
                  <a href={c.liveUrl} target="_blank" rel="noopener noreferrer">
                    {domain}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Services</dt>
                <dd className="cs-facts__links">
                  {c.services.map((service) => (
                    <Link key={service.href} href={service.href}>
                      {service.label}
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 2 · Client background  ·  3 · Business challenge */}
      <section id="challenge" className="cs-sec cs-sec--tint" aria-labelledby="cs-challenge-title">
        <div className="wrap cs-split">
          <div>
            <span className="eyebrow">Client background</span>
            <h2 className="cs-h2">About {c.client}</h2>
            {c.clientBackground.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="cs-text">
                {paragraph}
              </p>
            ))}
            <p className="cs-source">Source: the client&apos;s public website, {c.clientBackground.source}.</p>
          </div>
          <div>
            <span className="eyebrow">Business challenge</span>
            <h2 id="cs-challenge-title" className="cs-h2">
              The problem to solve
            </h2>
            {c.challenge.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="cs-text">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Objectives  ·  5 · Approach  ·  6 · Solution */}
      <section id="approach" className="cs-sec" aria-labelledby="cs-approach-title">
        <div className="wrap">
          <div className="cs-split cs-split--wide">
            <div>
              <span className="eyebrow">Project objectives</span>
              <h2 className="cs-h2">What the build had to do</h2>
              <ol className="cs-objectives">
                {c.objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ol>
            </div>
            <div>
              <span className="eyebrow">Our approach</span>
              <h2 id="cs-approach-title" className="cs-h2">
                How we approached it
              </h2>
              <ul className="cs-cards">
                {c.approach.map((item, index) => (
                  <Reveal as="li" key={item.title} delay={0.04 * index} className="cs-card">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
          <div className="cs-solution">
            <span className="eyebrow">The solution</span>
            <p>{c.solution}</p>
          </div>
        </div>
      </section>

      {/* 7 · Main features */}
      <section id="features" className="cs-sec cs-sec--tint" aria-labelledby="cs-features-title">
        <div className="wrap">
          <header className="cs-sec-head">
            <span className="eyebrow">Main features</span>
            <h2 id="cs-features-title" className="cs-h2">
              What&apos;s in the product
            </h2>
          </header>
          <ul className="cs-features">
            {c.features.map((feature, index) => (
              <Reveal as="li" key={feature.title} delay={0.03 * index} className="cs-feature">
                <span className="cs-feature__icon" aria-hidden>
                  <Check size={16} strokeWidth={2.4} />
                </span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 · Technical architecture  ·  9 · Development process */}
      <section id="architecture" className="cs-sec" aria-labelledby="cs-arch-title">
        <div className="wrap cs-split cs-split--wide">
          <div>
            <span className="eyebrow">Technical architecture</span>
            <h2 id="cs-arch-title" className="cs-h2">
              How it&apos;s built
            </h2>
            <dl className="cs-arch">
              {c.architecture.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="cs-source">Checked against the live site in {CAPTURED}.</p>
          </div>
          <div>
            <span className="eyebrow">Development process</span>
            <h2 className="cs-h2">How the work was organised</h2>
            <ol className="cs-steps">
              {c.process.map((step, index) => (
                <li key={step.title} className="cs-step">
                  <span className="cs-step__num" aria-hidden>
                    {index + 1}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 10 · Screenshots */}
      <section id="screenshots" className="cs-sec cs-sec--tint" aria-labelledby="cs-shots-title">
        <div className="wrap">
          <header className="cs-sec-head">
            <span className="eyebrow">Screenshots</span>
            <h2 id="cs-shots-title" className="cs-h2">
              {c.client} on desktop and mobile
            </h2>
            <p>Captured from the live site in {CAPTURED}.</p>
          </header>
          <div className={`cs-gallery${mobileShots.length ? " cs-gallery--with-phone" : ""}`}>
            <div className="cs-gallery__desktop">
              {desktopShots.map((shot) => (
                <Screenshot key={shot.src} shot={shot} domain={domain} />
              ))}
            </div>
            {mobileShots.length ? (
              <div className="cs-gallery__mobile">
                {mobileShots.map((shot) => (
                  <Screenshot key={shot.src} shot={shot} domain={domain} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 11 · Technologies  ·  12 · Verified outcomes  ·  13 · Lessons */}
      <section id="outcomes" className="cs-sec" aria-labelledby="cs-outcomes-title">
        <div className="wrap cs-split cs-split--wide">
          <div>
            <span className="eyebrow">Technologies</span>
            <h2 className="cs-h2">Stack</h2>
            <ul className="cs-tech">
              {c.technologies.map((tech) => (
                <li key={tech.name}>
                  <strong>{tech.name}</strong>
                  <span>{tech.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow">Verified outcomes</span>
            <h2 id="cs-outcomes-title" className="cs-h2">
              What you can check today
            </h2>
            <p className="cs-text">
              We don&apos;t publish sales, traffic or conversion figures without the client&apos;s permission. These
              are the results anyone can verify on the live site.
            </p>
            <ul className="cs-outcomes">
              {c.outcomes.map((outcome) => (
                <li key={outcome}>
                  <Check size={16} strokeWidth={2.4} aria-hidden />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
            {c.lessons?.length ? (
              <>
                <h3 className="cs-h3">Lessons learned</h3>
                <ul className="cs-outcomes">
                  {c.lessons.map((lesson) => (
                    <li key={lesson}>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Related services and other case studies (internal links) */}
      {moreProjects.length > 0 ? (
        <section className="cs-sec cs-sec--tint" aria-labelledby="cs-more-title">
          <div className="wrap">
            <header className="cs-sec-head cs-sec-head--row">
              <div>
                <span className="eyebrow">More case studies</span>
                <h2 id="cs-more-title" className="cs-h2">
                  Other products we&apos;ve shipped
                </h2>
              </div>
              <Link href="/work" className="cs-more-link">
                All work <ArrowRight size={15} aria-hidden />
              </Link>
            </header>
            <ul className="case-more__grid">
              {moreProjects.map((item) => (
                <li key={item.slug}>
                  <Link href={`/work/${item.slug}`} className="case-more__card">
                    {item.heroImage ? (
                      <CloudinaryImage
                        asset={item.heroImage}
                        alt={getWorkProjectImages(item.slug)?.heroAlt ?? item.title}
                        width={640}
                        height={480}
                        transformWidth={640}
                        className="case-more__img"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      />
                    ) : null}
                    <span className="case-more__meta">
                      <span className="case-more__cat">{item.category}</span>
                      <strong>{item.title}</strong>
                      <span className="case-more__hook">{caseStudyContent[item.slug]?.summary ?? item.hook}</span>
                      <span className="case-more__go">
                        View case study <ArrowUpRight size={15} aria-hidden />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 14 · CTA */}
      <CtaBand
        eyebrow="Work with us"
        title={`Planning something like ${c.client}?`}
        description="Tell us what you're building. We reply within one business day with questions, a suggested first release and a timeline."
        buttonLabel="Discuss Your Requirements"
      />
    </>
  );
}
