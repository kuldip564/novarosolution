import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/api';
import { buildCanonical, buildMetadata } from '@/lib/seo';
import SEO from '@/components/SEO';

export const revalidate = 120;

export const metadata: Metadata = buildMetadata({
  title: 'Blog | Novaro Solution',
  description: 'Technical insights and updates from Novaro Solution.',
  keywords: ['blog', 'articles', 'next.js', 'mern'],
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
    <section>
      <SEO
        title="Blog | Novaro Solution"
        description="Technical insights and updates from Novaro Solution."
        canonical={buildCanonical('/blog')}
      />
      <h1>Blog</h1>
      <h2 className="sr-only">Latest articles</h2>
      <div className="post-list">
        {posts.map((post) => (
          <article className="card" key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.excerpt || post.content.slice(0, 100)}</p>
            <Link href={`/blog/${post.slug}`}>Read article</Link>
          </article>
        ))}
      </div>
      {!posts.length ? <p className="mt-4 text-slate-400">No blog posts available yet.</p> : null}
    </section>
  );
}
