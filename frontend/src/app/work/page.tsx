import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { PortfolioGrid, type PortfolioItem } from "@/components/work/PortfolioGrid";
import { caseStudyContent } from "@/lib/case-study-content";
import { getPublishedProjects, getSiteContent } from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";
import { workKeywords } from "@/lib/geo-seo";
import { projectDomain } from "@/lib/project-domain";
import { defaultCta, pickCta, type CtaContent } from "@/lib/site-data";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/structured-data";
import { getWorkProjectImages } from "@/lib/work-project-images";
import "@/styles/work.css";
import { jsonLdString } from "@/lib/json-ld";

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
  ogEyebrow: "Portfolio",
  ogHeadline: "Live products we designed and built",
});

export default async function WorkPage() {
  const [projects, cta] = await Promise.all([
    getPublishedProjects(),
    getSiteContent<CtaContent>("cta", defaultCta),
  ]);
  const workCta = pickCta(cta, "work");

  const items: PortfolioItem[] = mapDbProjectsToWork(projects).map((project) => {
    const content = caseStudyContent[project.slug];
    const liveUrl = content?.liveUrl ?? project.externalUrl ?? null;
    return {
      slug: project.slug,
      title: project.title,
      group: content?.group ?? (/commerce|d2c/i.test(project.category) ? "E-commerce" : "Web platforms"),
      industry: content?.industry ?? project.category,
      projectType: content?.projectType ?? project.category,
      summary: content?.summary ?? project.hook,
      technologies: content?.technologies.filter((tech) => tech.name !== "Vercel").map((tech) => tech.name) ?? [
        ...project.tags,
      ],
      image: project.heroImage ?? null,
      imageAlt: getWorkProjectImages(project.slug)?.heroAlt ?? `${project.title} — ${project.category}`,
      liveUrl,
      domain: projectDomain(liveUrl),
    };
  });

  const industries = new Set(items.map((item) => item.industry.split(" · ")[0]));
  const frameworks = new Set(
    items.flatMap((item) => item.technologies.filter((tech) => tech === "Next.js" || tech === "Expo")),
  );

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
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${base}/work/${item.slug}`,
          name: caseStudyContent[item.slug]?.h1 ?? `${item.title} case study`,
        })),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path },
    ]),
  ];

  return (
    <main className="work-cinema">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <PageHead
        eyebrow="Portfolio"
        title="NOVARO"
        titleAccent="WORK"
        variant="bigword"
        heading="Case studies: D2C stores, service websites and logistics platforms"
        description="Live products we designed and built. Each case study covers the problem, the build and the stack, and everything in it can be checked on the client's live site."
        className="blog-head"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
      />

      <section className="pf-sec" aria-labelledby="pf-title">
        <div className="wrap">
          <div className="pf-intro">
            <h2 id="pf-title" className="pf-intro__title">
              Selected projects
            </h2>
            <dl className="pf-stats">
              <div>
                <dt>Live products</dt>
                <dd>{items.length}</dd>
              </div>
              <div>
                <dt>Industries</dt>
                <dd>{industries.size}</dd>
              </div>
              {frameworks.size ? (
                <div>
                  <dt>Built with</dt>
                  <dd>{[...frameworks].join(" & ")}</dd>
                </div>
              ) : null}
            </dl>
          </div>
          <PortfolioGrid items={items} />
        </div>
      </section>

      <CtaBand eyebrow="Work with us" title={workCta.title} description={workCta.description} />
    </main>
  );
}
