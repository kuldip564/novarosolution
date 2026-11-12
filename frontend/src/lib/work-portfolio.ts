import { caseStudyContent, type CaseStudyScreenshot } from "./case-study-content";
import type { WorkProjectView } from "./content-mappers";
import type { CloudinaryAsset } from "./media";
import { projectDomain } from "./project-domain";
import { getWorkProjectImages } from "./work-project-images";

/**
 * One project as the Work page presents it. Every field comes from the published project
 * (admin) or the verified case-study copy (`case-study-content.ts`); nothing is invented.
 * Projects added in the admin without case-study copy still appear, with a branded visual
 * instead of screenshots.
 */
export type WorkProject = {
  slug: string;
  number: string;
  title: string;
  href: string;
  projectType: string;
  industry: string;
  /** Filter group, e.g. "E-commerce" or "Web platforms". */
  group: string;
  summary: string;
  services: string[];
  /** Verified technologies, hosting and headers left out. */
  stack: string[];
  liveUrl: string | null;
  domain: string | null;
  desktop: CaseStudyScreenshot[];
  mobile: CaseStudyScreenshot | null;
  art: CloudinaryAsset | null;
  artAlt: string;
};

/** Infrastructure entries that aren't part of the product stack shown on cards. */
const NOT_STACK = new Set(["Vercel", "Content Security Policy"]);

export function toWorkProjects(projects: WorkProjectView[]): WorkProject[] {
  return projects.map((project, index) => {
    const content = caseStudyContent[project.slug];
    const liveUrl = content?.liveUrl ?? project.externalUrl ?? null;
    return {
      slug: project.slug,
      number: String(index + 1).padStart(2, "0"),
      title: project.title,
      href: `/work/${project.slug}`,
      projectType: content?.projectType ?? project.category,
      industry: content?.industry ?? project.category,
      group: content?.group ?? (/commerce|d2c/i.test(project.category) ? "E-commerce" : "Web platforms"),
      summary: content?.summary ?? project.hook,
      services: content?.services.map((service) => service.label) ?? [],
      stack: content?.technologies.map((tech) => tech.name).filter((name) => !NOT_STACK.has(name)) ?? [...project.tags],
      liveUrl,
      domain: projectDomain(liveUrl),
      desktop: content?.screenshots.filter((shot) => shot.device === "desktop") ?? [],
      mobile: content?.screenshots.find((shot) => shot.device === "mobile") ?? null,
      art: project.heroImage ?? null,
      artAlt: getWorkProjectImages(project.slug)?.heroAlt ?? `${project.title} — ${project.category}`,
    };
  });
}

/** Technologies across the portfolio, each with the projects that verifiably use it. */
export function technologiesByProject(projects: WorkProject[]): Array<{ name: string; projects: string[] }> {
  const map = new Map<string, string[]>();
  for (const project of projects) {
    const content = caseStudyContent[project.slug];
    for (const tech of content?.technologies ?? []) {
      map.set(tech.name, [...(map.get(tech.name) ?? []), project.title]);
    }
  }
  return [...map.entries()]
    .map(([name, list]) => ({ name, projects: list }))
    .sort((a, b) => b.projects.length - a.projects.length || a.name.localeCompare(b.name));
}

/** Industries across the portfolio, each with its projects. */
export function industriesByProject(projects: WorkProject[]): Array<{ name: string; projects: string[] }> {
  const map = new Map<string, string[]>();
  for (const project of projects) {
    const name = project.industry.split(" · ")[0];
    map.set(name, [...(map.get(name) ?? []), project.title]);
  }
  return [...map.entries()].map(([name, list]) => ({ name, projects: list }));
}
