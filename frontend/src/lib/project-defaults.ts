import type { DbProject } from "./content";
import { parseCloudinaryAsset } from "./media";
import { workProjects } from "./site-data";
import { getWorkProjectImages, mergeWorkProjectImages } from "./work-project-images";

export const LEGACY_PROJECT_SLUGS = new Set([
  "finflow",
  "medisense",
  "aurora-commerce",
  "helio-crm",
]);

export const defaultProjects: DbProject[] = workProjects.map((project, index) => {
  const images = getWorkProjectImages(project.slug);
  return {
    id: `default-${project.slug}`,
    slug: project.slug,
    order: index,
    title: project.title,
    category: project.category,
    hook: project.hook,
    body: project.story,
    heroTitle: project.heroTitle,
    heroImage: images?.hero ?? null,
    coverClass: `c${(index % 4) + 1}`,
    screens: images?.screens ?? [],
    results: [...project.results],
    tags: [...project.tags],
    externalUrl: project.externalUrl,
    published: true,
  };
});

export function resolvePublishedProjects(
  projects: DbProject[],
  fallback: DbProject[] = defaultProjects,
): DbProject[] {
  if (!projects.length) return fallback;
  if (projects.some((project) => LEGACY_PROJECT_SLUGS.has(project.slug))) {
    return fallback;
  }

  return projects.map((project) => {
    const def = fallback.find((item) => item.slug === project.slug);
    const hasHero = Boolean(parseCloudinaryAsset(project.heroImage)?.secureUrl);
    const merged = mergeWorkProjectImages(
      project.slug,
      hasHero ? parseCloudinaryAsset(project.heroImage) : def?.heroImage ?? null,
      Array.isArray(project.screens) && project.screens.length > 0
        ? project.screens
            .map((item) => parseCloudinaryAsset(item))
            .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset))
        : def?.screens ?? [],
    );

    return {
      ...project,
      heroImage: merged.heroImage,
      screens: merged.screens,
      externalUrl: project.externalUrl ?? def?.externalUrl ?? null,
    };
  });
}
