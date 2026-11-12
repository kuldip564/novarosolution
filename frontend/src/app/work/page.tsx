import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { WorkHeroVisual } from "@/components/work/WorkHeroVisual";
import { WorkIndex } from "@/components/work/WorkIndex";
import { WorkMotion } from "@/components/work/WorkMotion";
import { WorkShowcase } from "@/components/work/WorkShowcase";
import { CAPTURED, caseStudyContent } from "@/lib/case-study-content";
import { getPublishedProjects } from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";
import { workKeywords } from "@/lib/geo-seo";
import { jsonLdString } from "@/lib/json-ld";
import { site } from "@/lib/site-data";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/structured-data";
import { industriesByProject, technologiesByProject, toWorkProjects } from "@/lib/work-portfolio";
import "@/styles/work.css";

export const revalidate = 30;

const path = "/work";
const title = "Software Case Studies & Portfolio";
const description =
  "Case studies of live products Novaro Solution built: Zeevan and KankreG D2C stores on Expo, and the Mr Antidot and Quadrato Cargo platforms on Next.js.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path,
  keywords: [...workKeywords, "e-commerce case study", "Next.js case study", "Expo web app case study"],
  ogEyebrow: "Selected work",
  ogHeadline: "Selected work, built to make an impact",
});

const pad = (value: number) => String(value).padStart(2, "0");

export default async function WorkPage() {
  const projects = toWorkProjects(mapDbProjectsToWork(await getPublishedProjects()));
  const technologies = technologiesByProject(projects);
  const industries = industriesByProject(projects);
  const frameworks = technologies.filter((tech) => tech.name === "Next.js" || tech.name === "Expo");
  const liveCount = projects.filter((project) => project.liveUrl).length;

  const base = siteBaseUrl();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${base}${path}#collection`,
      name: "Novaro Solution portfolio",
      description,
      url: `${base}${path}`,
      inLanguage: "en",
      publisher: { "@id": ORGANIZATION_ID },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${base}${project.href}`,
          name: caseStudyContent[project.slug]?.h1 ?? `${project.title} case study`,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path },
    ]),
  ];

  return (
    <main className="wk">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <WorkMotion>
        {/* 01 · Hero */}
        <section className="wk-hero" aria-labelledby="wk-hero-title">
          <WorkHeroVisual />
          <div className="wrap wk-hero__inner">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work" }]} className="wk-hero__crumbs" />
            <p className="wk-eyebrow wk-hero__eyebrow">Selected work / 2026</p>
            <h1 id="wk-hero-title" className="wk-hero__title">
              <span className="wk-line" style={{ ["--line" as string]: 0 }}>
                Selected work.
              </span>{" "}
              <span className="wk-line" style={{ ["--line" as string]: 1 }}>
                Built to make
              </span>{" "}
              <span className="wk-line wk-line--accent" style={{ ["--line" as string]: 2 }}>
                an impact.
              </span>
            </h1>
            <div className="wk-hero__foot">
              <p className="wk-hero__intro">
                Case studies of live digital products engineered by {site.name}: two D2C stores, a
                service-booking website and a courier platform, each with the problem, the build and the stack.
              </p>
              <div className="wk-hero__aside">
                <p className="wk-hero__count">
                  <strong>{pad(projects.length)}</strong>
                  <span>
                    live projects
                    <br />
                    {industries.length} industries
                  </span>
                </p>
                <p className="wk-hero__tagline">Strategy. Engineering. Intelligence. Growth.</p>
              </div>
            </div>
            <a href="#selected-work" className="wk-scroll">
              <span className="wk-scroll__line" aria-hidden="true" />
              <span>Scroll to explore</span>
            </a>
          </div>
        </section>

        {/* 02 · Introduction */}
        <section className="wk-intro" aria-labelledby="wk-intro-title">
          <div className="wrap wk-intro__grid">
            <h2 id="wk-intro-title" className="wk-intro__title" data-wk-reveal>
              <span className="wk-mask">
                <span>Ideas</span>
              </span>{" "}
              <span className="wk-mask">
                <span>made real.</span>
              </span>
            </h2>
            <span className="wk-intro__divider" aria-hidden="true" data-wk-reveal />
            <div className="wk-intro__copy" data-wk-reveal>
              <p>
                From ambitious concepts to production-ready digital products, we create technology that solves
                real business problems.
              </p>
              <p className="wk-intro__note">
                Every project below is live on the client&apos;s own domain. Screenshots were captured from the live
                sites in {CAPTURED}.
              </p>
            </div>
          </div>
        </section>

        {/* 03–04 · Featured projects */}
        <section id="selected-work" className="wk-section wk-section--showcase" aria-labelledby="wk-showcase-title">
          <div className="wrap wk-section__head" data-wk-reveal>
            <p className="wk-eyebrow">Featured projects</p>
            <h2 id="wk-showcase-title" className="wk-h2">
              Four products, four different problems.
            </h2>
          </div>
          <WorkShowcase projects={projects} />
        </section>

        {/* 05 · Index with filters */}
        <section className="wk-section wk-section--index" aria-labelledby="wk-index-title">
          <div className="wrap">
            <div className="wk-section__head wk-section__head--row" data-wk-reveal>
              <div>
                <p className="wk-eyebrow">Index</p>
                <h2 id="wk-index-title" className="wk-h2">
                  All work
                </h2>
              </div>
              <p className="wk-section__lede">
                Filter by the kind of product. Each row opens the full case study.
              </p>
            </div>
            <WorkIndex projects={projects} />
          </div>
        </section>

        {/* 08 · Technologies and industries */}
        <section className="wk-section wk-section--stack" aria-labelledby="wk-stack-title">
          <div className="wrap">
            <div className="wk-section__head" data-wk-reveal>
              <p className="wk-eyebrow">Technologies &amp; industries</p>
              <h2 id="wk-stack-title" className="wk-h2">
                What these products run on.
              </h2>
              <p className="wk-section__lede">
                Only technologies confirmed on the live sites, each listed with the projects that use it.
              </p>
            </div>
            <div className="wk-stack">
              <ul className="wk-stack__tech" aria-label="Technologies">
                {technologies.map((tech, index) => (
                  <li key={tech.name} data-wk-reveal style={{ ["--i" as string]: index % 4 }}>
                    <strong>{tech.name}</strong>
                    <span>{tech.projects.join(", ")}</span>
                  </li>
                ))}
              </ul>
              <ul className="wk-stack__industries" aria-label="Industries">
                {industries.map((industry, index) => (
                  <li key={industry.name} data-wk-reveal style={{ ["--i" as string]: index }}>
                    <span className="wk-stack__line" aria-hidden="true" />
                    <strong>{industry.name}</strong>
                    <span>{industry.projects.join(", ")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 09 · Numbers (all counted from the published projects) */}
        <section className="wk-section wk-section--numbers" aria-labelledby="wk-numbers-title">
          <div className="wrap">
            <h2 id="wk-numbers-title" className="sr-only">
              Portfolio in numbers
            </h2>
            <dl className="wk-numbers">
              <div data-wk-reveal style={{ ["--i" as string]: 0 }}>
                <dt>Live client products</dt>
                <dd>{pad(liveCount)}</dd>
              </div>
              <div data-wk-reveal style={{ ["--i" as string]: 1 }}>
                <dt>Industries</dt>
                <dd>{pad(industries.length)}</dd>
              </div>
              <div data-wk-reveal style={{ ["--i" as string]: 2 }}>
                <dt>Frameworks in production</dt>
                <dd>
                  {pad(frameworks.length)}
                  <small>{frameworks.map((tech) => tech.name).join(" & ")}</small>
                </dd>
              </div>
              <div data-wk-reveal style={{ ["--i" as string]: 3 }}>
                <dt>Facts checked on the live sites</dt>
                <dd className="wk-numbers__text">Every one</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* 10 · Closing */}
        <section className="wk-closing" aria-labelledby="wk-closing-title">
          <span className="wk-closing__glow wk-closing__glow--a" aria-hidden="true" />
          <span className="wk-closing__glow wk-closing__glow--b" aria-hidden="true" />
          <div className="wrap wk-closing__inner" data-wk-reveal>
            <p className="wk-eyebrow wk-eyebrow--light">Start a project</p>
            <h2 id="wk-closing-title" className="wk-closing__title">
              Have an idea
              <br />
              worth building?
            </h2>
            <p className="wk-closing__lede">Let&apos;s turn your next big idea into a powerful digital product.</p>
            <div className="wk-closing__actions">
              <Button href="/contact">Start Your Project</Button>
              <p className="wk-closing__talk">
                <span>Let&apos;s talk:</span> <a href={`mailto:${site.email}`}>{site.email}</a>
                <span aria-hidden="true">·</span>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              </p>
            </div>
          </div>
        </section>
      </WorkMotion>
    </main>
  );
}
