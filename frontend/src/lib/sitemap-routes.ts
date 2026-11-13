import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "./blog";
import { getPublishedProjects, getPublishedServices } from "./content";
import { locationPath, locations } from "./locations";
import { siteBaseUrl } from "./site-metadata";

/**
 * Only include lastModified when a trustworthy content date is available.
 * Search engines may ignore changeFrequency and priority; the sitemap keeps
 * to URLs and useful lastmod values instead.
 */
const staticRoutes: Array<{
  path: string;
  lastModified?: string;
}> = [
  { path: "" },
  { path: "/about" },
  { path: "/services" },
  { path: "/work" },
  { path: "/blog" },
  { path: "/contact" },
  { path: "/software-development-usa" },
  { path: "/it-services" },
  { path: "/locations" },
  { path: "/privacy-policy", lastModified: "2026-11-11" },
  { path: "/terms", lastModified: "2026-11-10" },
  { path: "/disclaimer", lastModified: "2026-06-14" },
  { path: "/cookie-policy", lastModified: "2026-06-14" },
];

function toValidDate(value?: string): Date | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteBaseUrl();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
    ({ path, lastModified }) => ({
      url: `${baseUrl}${path}`,
      ...(toValidDate(lastModified) ? { lastModified: toValidDate(lastModified) } : {}),
    }),
  );

  const [posts, projects, services] = await Promise.all([
    getAllBlogPosts(),
    getPublishedProjects(),
    getPublishedServices(),
  ]);

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModified =
      toValidDate(post.updatedAt) ?? toValidDate(post.publishedAt);

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      ...(lastModified ? { lastModified } : {}),
    };
  });

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${baseUrl}${locationPath(location.slug)}`,
  }));

  return [
    ...staticEntries,
    ...locationEntries,
    ...projectEntries,
    ...serviceEntries,
    ...blogEntries,
  ];
}
