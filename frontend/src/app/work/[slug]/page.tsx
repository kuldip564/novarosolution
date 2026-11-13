import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import { getPublishedProjects } from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { projectDomain } from "@/lib/project-domain";
import { breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/structured-data";
import { getWorkProjectImages } from "@/lib/work-project-images";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { CaseStudyView } from "@/components/work/CaseStudyView";
import { getCaseStudyContent } from "@/lib/case-study-content";
import "@/styles/case-study.css";
import { jsonLdString } from "@/lib/json-ld";

type Props = { params: Promise<{ slug: string }> };

async function loadProjects() {
  return mapDbProjectsToWork(await getPublishedProjects());
}

async function loadProject(slug: string) {
  const projects = await loadProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

function caseStudyDescription(hook: string, category: string): string {
  const base = hook.trim().replace(/\.?$/, ".");
  const long = ` A ${category} case study by Novaro Solution: scope, stack and results.`;
  const short = " Case study by Novaro Solution: scope, stack and results.";
  if (base.length + long.length <= 160) return `${base}${long}`;
  return base.length + short.length <= 160 ? `${base}${short}` : base;
}

export const revalidate = 30;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return { title: "Project" };

  const content = getCaseStudyContent(project.slug);

  return createPageMetadata({
    title: content?.seoTitle ?? `${project.title} case study | ${project.category}`,
    description: content?.description ?? caseStudyDescription(project.hook, project.category),
    ogEyebrow: `Case study · ${content?.industry ?? project.category}`,
    ogHeadline: content?.h1,
    path: `/work/${project.slug}`,
    keywords: [
      `${project.title} case study`,
      content?.projectType ?? project.category,
      ...(content?.technologies.map((tech) => tech.name) ?? project.tags),
      "software development company",
    ],
  });
}

export default async function WorkCasePage({ params }: Props) {
  const { slug } = await params;
  const projects = await loadProjects();
  const project = projects.find((item) => item.slug === slug) ?? null;
  if (!project) notFound();
  const moreProjects = projects.filter((item) => item.slug !== project.slug).slice(0, 3);
  const domain = projectDomain(project.externalUrl);

  const content = getCaseStudyContent(project.slug);
  const path = `/work/${project.slug}`;
  const base = siteBaseUrl();
  const absolute = (url: string) => (url.startsWith("http") ? url : `${base}${url}`);
  const heroUrl = project.heroImage?.secureUrl;
  const images = [
    ...(heroUrl ? [absolute(heroUrl)] : []),
    ...(content?.screenshots.map((shot) => absolute(shot.src)) ?? []),
  ];
  const clientUrl = content?.liveUrl ?? project.externalUrl ?? undefined;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${base}${path}#case-study`,
      name: content?.h1 ?? `${project.title} — ${project.category}`,
      headline: content?.h1 ?? `How we built ${project.title}`,
      description: content?.description ?? project.story,
      abstract: content?.summary,
      url: `${base}${path}`,
      mainEntityOfPage: `${base}${path}`,
      image: images.length ? images : undefined,
      genre: content?.projectType ?? project.category,
      keywords: (content?.technologies.map((tech) => tech.name) ?? [...project.tags]).join(", "),
      inLanguage: "en",
      creator: { "@id": ORGANIZATION_ID },
      isPartOf: { "@id": `${base}/work#collection` },
      ...(clientUrl
        ? { about: { "@type": "Organization", name: content?.client ?? project.title, url: clientUrl } }
        : {}),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
      { name: content?.client ?? project.title, path },
    ]),
  ];

  if (content) {
    return (
      <main className="cs">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
        <TrackEvent event="project_view" params={{ project: project.slug, project_type: content?.projectType ?? project.category }} />
        <CaseStudyView content={content} project={project} moreProjects={moreProjects} />
      </main>
    );
  }

  // Projects added in the admin without long-form copy keep the short layout.
  return (
    <main>
      <TrackEvent event="project_view" params={{ project: project.slug, project_type: project.category }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <PageHead
        eyebrow={`Case study · ${project.category}`}
        title={`${project.title} case study`}
        description={project.hook}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/work" },
          { label: project.title },
        ]}
      />
      <section className="sec case" aria-labelledby="case-build-title">
        <div className="wrap case__grid">
          {project.heroImage ? (
            <figure className="case__media">
              <CloudinaryImage
                asset={project.heroImage}
                alt={getWorkProjectImages(project.slug)?.heroAlt ?? `${project.title} — ${project.category}`}
                width={1024}
                height={1024}
                transformWidth={1024}
                className="case__img"
                priority
                sizes="(max-width: 899px) 100vw, 560px"
              />
              {project.externalUrl ? (
                <figcaption className="case__domain">{projectDomain(project.externalUrl)}</figcaption>
              ) : null}
            </figure>
          ) : null}

          <div className="case__copy">
            <span className="eyebrow">The build</span>
            <h2 id="case-build-title" className="case__title">
              How we built {project.title}
            </h2>
            <p className="case__story">{project.story}</p>

            <ul className="case__metrics" aria-label="Results">
              {project.results.map((result, index) => {
                const value = typeof result === "string" ? result : result.value;
                const label = typeof result === "string" ? `Result ${index + 1}` : result.label;
                return (
                  <li key={`${label}-${value}`}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </li>
                );
              })}
            </ul>

            <dl className="case__facts">
              <div>
                <dt>Type</dt>
                <dd>{project.category}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd className="case__tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Services</dt>
                <dd className="case__services">
                  <Link href="/services/web-app-eng">Web &amp; app development</Link>
                  {/commerce|d2c/i.test(project.category) ? (
                    <Link href="/services/digital-marketing">Digital marketing &amp; SEO</Link>
                  ) : null}
                </dd>
              </div>
              {project.externalUrl && domain ? (
                <div>
                  <dt>Live site</dt>
                  <dd>
                    <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                      {domain}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="case__actions">
              {project.externalUrl ? <Button href={project.externalUrl}>Visit live site</Button> : null}
              <Button href="/contact" variant="ghost">
                Discuss Your Requirements
              </Button>
            </div>
          </div>
        </div>
      </section>
      {moreProjects.length > 0 ? (
        <section className="sec case-more" aria-labelledby="case-more-title">
          <div className="wrap">
            <header className="case-more__head">
              <span className="eyebrow">More case studies</span>
              <h2 id="case-more-title">Other products we&apos;ve shipped</h2>
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
                      <span className="case-more__hook">{item.hook}</span>
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

      <CtaBand
        eyebrow="Work with us"
        title="Want a build like this?"
        description="Tell us what you're shipping. We'll reply within one business day."
      />
    </main>
  );
}
