import type { Metadata } from "next";
import { RevealScope } from "@/components/anim/RevealScope";
import { BlogHero, BlogList, BlogPager, BlogTopics } from "@/components/blog/BlogIndex";
import { StudioClosing } from "@/components/studio/StudioClosing";
import { EmptyState } from "@/components/ui/EmptyState";
import { getBlogPosts } from "@/lib/blog";
import { getSiteContent } from "@/lib/content";
import { blogKeywords } from "@/lib/geo-seo";
import { jsonLdString } from "@/lib/json-ld";
import { blogPageDefaults } from "@/lib/page-content-defaults";
import { defaultCta, pickCta, type CtaContent } from "@/lib/site-data";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { breadcrumbJsonLd, ORGANIZATION_ID } from "@/lib/structured-data";
import "@/styles/studio.css";
import "@/styles/blog.css";

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

  // The newest article leads the hero on the first, unfiltered page only.
  const showFeatured = page === 1 && !category && data.posts.length > 0;
  const featured = showFeatured ? data.posts[0] : null;
  const listPosts = showFeatured ? data.posts.slice(1) : data.posts;
  const listTitle = category ? category : page > 1 ? `All articles · page ${page}` : "More articles";

  const base = siteBaseUrl();
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
    // Filtered views are noindex, so only the plain listing describes the blog.
    ...(category
      ? []
      : [
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${base}/blog#blog`,
            name: "Novaro Solution blog",
            description: pageCopy.description,
            url: `${base}/blog`,
            inLanguage: "en",
            publisher: { "@id": ORGANIZATION_ID },
            blogPost: data.posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: `${base}/blog/${post.slug}`,
              datePublished: post.publishedAt,
              ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
              author:
                post.author.name === "Novaro Solution"
                  ? { "@id": ORGANIZATION_ID }
                  : { "@type": "Person", name: post.author.name },
            })),
          },
        ]),
  ];

  return (
    <main className="st bl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <RevealScope attribute="data-st-reveal">
        <BlogHero
          lede={pageCopy.description}
          featured={featured}
          total={data.pagination.total}
          topics={data.categories.length}
        />

        <section id="articles" className="st-section st-section--alt bl-listing" aria-labelledby="bl-list-title">
          <div className="wrap">
            <header className="bl-listing__head">
              <div>
                <p className="st-eyebrow">{category ? "Topic" : "Articles"}</p>
                <h2 id="bl-list-title" className="st-h2 bl-listing__title" data-st-reveal>
                  <span className="st-mask">
                    <span>{listTitle}</span>
                  </span>
                </h2>
              </div>
              <BlogTopics categories={data.categories} active={category} />
            </header>

            {listPosts.length > 0 ? (
              <BlogList posts={listPosts} />
            ) : !featured ? (
              <EmptyState
                title="No posts yet"
                description="There are no articles in this topic right now. Try another topic or check back soon."
                actionHref="/blog"
                actionLabel="View all posts"
              />
            ) : null}

            <BlogPager page={data.pagination.page} totalPages={data.pagination.totalPages} category={category} />
          </div>
        </section>

        <StudioClosing
          id="bl-closing-title"
          eyebrow={pageCopy.ctaEyebrow}
          title={blogCta.title}
          lede={blogCta.description}
          buttonLabel="Start Your Project"
          location="blog-cta"
        />
      </RevealScope>
    </main>
  );
}
