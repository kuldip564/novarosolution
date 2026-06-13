import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Reveal } from "@/components/anim/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on product delivery, AI in production, and growth — from the Novaro Solution team.",
};

type BlogPageProps = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const category = params.category?.trim() || undefined;
  const data = await getBlogPosts({ page, limit: 9, category });

  const showFeatured = page === 1 && !category && data.posts.length > 0;
  const featured = showFeatured ? data.posts[0] : null;
  const gridPosts = showFeatured ? data.posts.slice(1) : data.posts;

  return (
    <main>
      <section className="pagehead blog-head">
        <div className="grid" />
        <div className="glow g1" />
        <div className="wrap inner">
          <Reveal>
            <span className="eyebrow">Insights</span>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bigword">
              <span className="o">NOVARO</span>
              <br />
              <span className="g">BLOG</span>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ marginTop: 22, maxWidth: 620 }}>
              Product craft, AI in production, and growth — written by the team
              shipping it every day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="sec blog-listing">
        <div className="wrap">
          <Suspense fallback={null}>
            <BlogFilters categories={data.categories} activeCategory={category} />
          </Suspense>

          {featured && (
            <div className="blog-featured">
              <BlogPostCard post={featured} featured />
            </div>
          )}

          {gridPosts.length > 0 ? (
            <div className="blog-grid">
              {gridPosts.map((post, index) => (
                <BlogPostCard key={post.id} post={post} delay={(index + 1) * 0.06} />
              ))}
            </div>
          ) : (
            !featured && <div className="blog-empty">No posts in this category yet.</div>
          )}

          <BlogPagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            category={category}
          />
        </div>
      </section>

      <CtaBand
        eyebrow="Work with us"
        title="Want help shipping your next product?"
        description="Tell us what you're building — we'll reply with a clear path forward."
      />
    </main>
  );
}
