import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { getBlogPosts } from "@/lib/blog";
import { getSiteContent } from "@/lib/content";
import { blogPageDefaults } from "@/lib/page-content-defaults";
import { jsonLdString } from "@/lib/json-ld";
import { createPageMetadata } from "@/lib/site-metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { blogKeywords } from "@/lib/geo-seo";
import { defaultCta, pickCta, type CtaContent } from "@/lib/site-data";

export const revalidate = 30;

type BlogPageProps = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const category = params.category?.trim();
  const base = createPageMetadata({
    title: page > 1 ? `Blog — Page ${page} — Software, AI & SEO Insights` : "Blog — Software, AI & SEO Insights",
    description:
      "Practical notes from the Novaro Solution team on building SaaS products, shipping AI features, technical SEO, and working with a remote software studio.",
    // Page 2+ is its own canonical; category filters point back to the main blog.
    path: page > 1 && !category ? `/blog?page=${page}` : "/blog",
    keywords: blogKeywords,
    ogHeadline: "Software, AI & SEO insights",
    ogEyebrow: "Novaro Solution blog",
  });
  return category ? { ...base, robots: { index: false, follow: true } } : base;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const category = params.category?.trim() || undefined;
  const [data, pageCopy, cta] = await Promise.all([
    getBlogPosts({ page, limit: 9, category }),
    getSiteContent("blogPage", blogPageDefaults),
    getSiteContent<CtaContent>("cta", defaultCta),
  ]);
  const blogCta = pickCta(cta, "home");

  const showFeatured = page === 1 && !category && data.posts.length > 0;
  const featured = showFeatured ? data.posts[0] : null;
  const gridPosts = showFeatured ? data.posts.slice(1) : data.posts;

  return (
    <main className="page-cinema blog-cinema">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
            ]),
          ),
        }}
      />
      <PageHead
        eyebrow={pageCopy.eyebrow}
        title={pageCopy.title}
        titleAccent={pageCopy.titleAccent}
        variant="bigword"
        heading="Software, AI and SEO insights from our studio"
        description={pageCopy.description}
        className="blog-head"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <section className="sec blog-listing" aria-labelledby="blog-articles-title">
        <div className="wrap">
          <h2 id="blog-articles-title" className="sr-only">
            {category ? `${category} articles` : "Latest articles"}
          </h2>
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
        eyebrow={pageCopy.ctaEyebrow}
        title={blogCta.title}
        description={blogCta.description}
      />
    </main>
  );
}
