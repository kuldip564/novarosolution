import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/api';
import { buildCanonical, buildMetadata } from '@/lib/seo';
import SEO from '@/components/SEO';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'Blog | Novaro Solution',
  description:
    'Read simple insights on UI/UX design, web development, mobile app development, and SEO from Novaro Solution.',
  keywords: ['ui ux design blog', 'web development tips', 'mobile app development guide', 'seo blog'],
  path: '/blog'
});

export default async function BlogListPage() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  try {
    posts = await getBlogPosts({ revalidate });
  } catch {
    posts = [];
  }

  return (
    <section className="space-y-5">
      <SEO
        title="Blog | Novaro Solution"
        description="Simple insights on UI/UX design, web development, mobile app development, and SEO."
        canonical={buildCanonical('/blog')}
      />
      <h1 className="text-3xl font-extrabold md:text-5xl">Blog</h1>
      <p className="max-w-3xl text-slate-300">
        Practical guides and product lessons from real client projects.
      </p>
      <h2 className="sr-only">Latest articles</h2>
      <div className="post-list">
        {posts.map((post) => (
          <article className="card" key={post._id}>
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-slate-300">{post.excerpt || post.content.slice(0, 100)}</p>
            <Link
              className="mt-4 inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
              href={`/blog/${post.slug}`}
            >
              Read article
            </Link>
          </article>
        ))}
      </div>
      {!posts.length ? <p className="mt-4 text-slate-400">No blog posts available yet.</p> : null}
    </section>
  );
}
