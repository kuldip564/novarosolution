import type { MetadataRoute } from 'next';
import { getBlogPosts, getProjects } from '@/lib/api';
import { getSiteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let posts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  try {
    [projects, posts] = await Promise.all([
      getProjects({ revalidate: 300 }),
      getBlogPosts({ revalidate: 120 })
    ]);
  } catch {
    projects = [];
    posts = [];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: `${base}/projects`,
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${base}/blog`,
      changeFrequency: 'weekly',
      priority: 0.9
    }
  ];

  const projectRoutes = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
