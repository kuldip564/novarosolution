import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "./blog";
import { getPublishedProjects, getPublishedServices } from "./content";
import { locationPath, locations } from "./locations";
import { siteBaseUrl } from "./site-metadata";

/**
 * lastModified is only set where the real content date is known (legal pages show it on the page,
 * posts use their publish date). A "now" timestamp on every URL teaches Google to ignore lastmod.
 */
const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: string;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/work", changeFrequency: "weekly", priority: 0.85 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.85 },
  { path: "/software-development-usa", changeFrequency: "monthly", priority: 0.9 },
  { path: "/it-services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/locations", changeFrequency: "monthly", priority: 0.85 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-08-20" },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-11-10" },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-06-14" },
  { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-06-14" },
];

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteBaseUrl();
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
    ({ path, changeFrequency, priority, lastModified }) => ({
      url: `${baseUrl}${path}`,
      ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
      changeFrequency,
      priority,
    }),
  );

  const [posts, projects, services] = await Promise.all([
    getAllBlogPosts(),
    getPublishedProjects(),
    getPublishedServices(),
  ]);

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const locationEntries: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${baseUrl}${locationPath(location.slug)}`,
    changeFrequency: "monthly",
    priority: location.group === "india" ? 0.85 : 0.8,
  }));

  return [
    ...staticEntries,
    ...locationEntries,
    ...projectEntries,
    ...serviceEntries,
    ...blogEntries,
  ];
}
