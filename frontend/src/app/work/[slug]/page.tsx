import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { getPublishedProjects } from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

async function loadProject(slug: string) {
  const projects = mapDbProjectsToWork(await getPublishedProjects());
  return projects.find((project) => project.slug === slug) ?? null;
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

  return createPageMetadata({
    title: `${project.title} case study | ${project.category}`,
    description: project.hook,
    path: `/work/${project.slug}`,
    keywords: [
      `${project.title} case study`,
      project.category,
      "software development company",
    ],
  });
}

export default async function WorkCasePage({ params }: Props) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) notFound();

  const path = `/work/${project.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.story,
      url: `${siteBaseUrl()}${path}`,
      creator: {
        "@type": "Organization",
        name: "Novaro Solution",
        url: siteBaseUrl(),
      },
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
      { name: project.title, path },
    ]),
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHead
        eyebrow={project.category}
        title={project.title}
        description={project.hook}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/work" },
          { label: project.title },
        ]}
      />
      <section className="sec detail">
        <div className="wrap detail-grid">
          <div className="detail-copy">
            <h2>The build</h2>
            <p>{project.story}</p>
            <div className="detail-links" aria-label="Stack">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {project.externalUrl ? (
              <div className="detail-action">
                <Button href={project.externalUrl}>Visit live site</Button>
              </div>
            ) : null}
          </div>
          <ul className="detail-metrics">
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
        </div>
      </section>
      <CtaBand
        eyebrow="Work with us"
        title="Want a build like this?"
        description="Tell us what you're shipping. We'll reply within one business day."
      />
    </main>
  );
}
