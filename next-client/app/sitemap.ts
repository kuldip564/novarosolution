import type { MetadataRoute } from 'next';
import { getBlogPosts, getProjects } from '@/lib/api';
import { getSiteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let blogPosts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  try {
    projects = await getProjects({ revalidate: 300 });
  } catch {
    projects = [];
  }
  try {
    blogPosts = await getBlogPosts({ revalidate: 120 });
  } catch {
    blogPosts = [];
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
      url: `${base}/about`,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${base}/services`,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${base}/contact`,
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: `${base}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${base}/login`,
      changeFrequency: 'monthly',
      priority: 0.4
    }
  ];

  const projectRoutes = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
