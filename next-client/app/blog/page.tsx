import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/api';
import { buildMetadata } from '@/lib/seo';
import AdPlaceholder from '@/components/ads/AdPlaceholder';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'Blog | Novaro Solution',
  description: 'Insights, engineering notes, and product updates from Novaro Solution.',
  keywords: ['blog', 'web development', 'mobile app development', 'ui ux'],
  path: '/blog'
});

export default async function BlogPage() {
  const posts = await getBlogPosts({ revalidate });

  return (
    <main className="app-page-shell">
      <section className="space-y-6">
        <article className="premium-page-hero space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/90">Journal</p>
          <h1 className="section-title text-3xl font-extrabold md:text-5xl">Blog</h1>
          <p className="max-w-2xl text-slate-300">
            Product thinking, engineering practices, and digital growth insights from our team.
          </p>
        </article>

        {posts.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post._id} className="page-content-card space-y-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                </p>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-slate-300">{post.excerpt}</p>
                <div className="admin-toolbar">
                  <Link href={`/blog/${post.slug}`} className="btn btn-sm">
                    Read Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className="page-content-card">
            <p className="text-sm text-slate-300">No articles are published yet. Check back soon.</p>
          </article>
        )}

        <AdPlaceholder slotName="Blog Feed" />
      </section>
    </main>
  );
}
