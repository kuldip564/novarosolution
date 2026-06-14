import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { getBlogPosts } from "@/lib/blog";
import { createPageMetadata } from "@/lib/site-metadata";

export const revalidate = 30;

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Insights on product delivery, AI in production, and growth — from the Novaro Solution team.",
  path: "/blog",
});

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
      <PageHead
        eyebrow="Insights"
        title="NOVARO"
        titleAccent="BLOG"
        variant="bigword"
        description="Product craft, AI in production, and growth — written by the team shipping it every day."
        className="blog-head"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

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
            !featured && (
              <EmptyState
                title="No posts yet"
                description="There are no articles in this category right now. Try another filter or check back soon."
                actionHref="/blog"
                actionLabel="View all posts"
              />
            )
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
