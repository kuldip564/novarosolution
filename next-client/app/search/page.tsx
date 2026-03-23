import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchSiteContent, getBlogPosts, getProjects } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Search | NovaRo Solution',
  description: 'Search blog posts, projects, services, and key pages on NovaRo Solution.',
  keywords: ['site search', 'novaro search', 'projects search', 'blog search'],
  path: '/search'
});

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

type SearchResult = {
  title: string;
  href: string;
  type: 'Project' | 'Blog' | 'Service' | 'Page';
  description: string;
};

type SearchableSiteContent = {
  services?: {
    items?: Array<{
      title?: string;
      description?: string;
    }>;
  };
};

function includesQuery(input: string, query: string) {
  return String(input || '').toLowerCase().includes(query);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const query = String(q || '').trim().toLowerCase();

  const [projects, posts, content] = await Promise.all([
    getProjects({ revalidate: 120 }).catch(() => []),
    getBlogPosts({ revalidate: 120 }).catch(() => []),
    fetchSiteContent({ revalidate: 120 }).catch(() => ({} as SearchableSiteContent))
  ]);

  const searchableContent = content as SearchableSiteContent;
  const services = Array.isArray(searchableContent.services?.items) ? searchableContent.services.items : [];
  const staticPages: SearchResult[] = [
    {
      title: 'About',
      href: '/about',
      type: 'Page',
      description: 'Learn about NovaRo Solution team, process, and experience.'
    },
    {
      title: 'Services',
      href: '/services',
      type: 'Page',
      description: 'Explore web, mobile, UI/UX and growth services.'
    },
    {
      title: 'Projects',
      href: '/projects',
      type: 'Page',
      description: 'See project case studies and delivery outcomes.'
    },
    {
      title: 'Blog',
      href: '/blog',
      type: 'Page',
      description: 'Read insights, updates and product engineering notes.'
    },
    {
      title: 'Contact',
      href: '/contact',
      type: 'Page',
      description: 'Start your project discussion with NovaRo Solution.'
    }
  ];

  const allResults: SearchResult[] = [
    ...projects.map((project) => ({
      title: project.title,
      href: `/projects/${project.slug}`,
      type: 'Project' as const,
      description: project.description || 'Project details and outcomes.'
    })),
    ...posts.map((post) => ({
      title: post.title,
      href: `/blog/${post.slug}`,
      type: 'Blog' as const,
      description: post.excerpt || 'Read article details.'
    })),
    ...services.map((service: any, index: number) => ({
      title: String(service?.title || `Service ${index + 1}`),
      href: '/services',
      type: 'Service' as const,
      description: String(service?.description || 'Service overview and delivery details.')
    })),
    ...staticPages
  ];

  const results = query
    ? allResults.filter((item) => includesQuery(item.title, query) || includesQuery(item.description, query))
    : [];

  return (
    <main className="app-page-shell">
      <section className="space-y-4">
        <article className="page-hero-shell space-y-3">
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">Search</h1>
          <p className="text-slate-300">Find projects, blog posts, services, and pages quickly.</p>
        </article>

        <form method="get" action="/search" className="page-content-card space-y-3 search-page-form" role="search" aria-label="Site search">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by keyword..."
            aria-label="Search by keyword"
          />
          <div className="admin-toolbar">
            <button className="btn btn-sm" type="submit">Search</button>
            <Link href="/search" className="btn btn-sm btn-ghost">Clear</Link>
          </div>
        </form>

        {query ? (
          <article className="page-content-card space-y-3">
            <p className="text-sm text-slate-300">
              {results.length} result{results.length === 1 ? '' : 's'} for "<strong>{q}</strong>"
            </p>
            {results.length ? (
              <div className="space-y-2">
                {results.map((item, index) => (
                  <article key={`${item.href}-${index}`} className="admin-list-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.type}</p>
                        <p className="text-sm text-slate-300">{item.description}</p>
                      </div>
                      <Link href={item.href} className="admin-btn">Open</Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-slate-300">No matches found. Try another keyword.</p>
            )}
          </article>
        ) : (
          <article className="page-content-card">
            <p className="text-slate-300">Type a keyword to search.</p>
          </article>
        )}
      </section>
    </main>
  );
}
