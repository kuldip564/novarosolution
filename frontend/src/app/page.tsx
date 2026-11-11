import { HomeBelowFold } from "@/components/home/HomeBelowFold";
import { HomeHero } from "@/components/home/HomeHero";
import {
  getPublishedFaqs,
  getPublishedLogos,
  getPublishedProjects,
  getPublishedServices,
  getPublishedTestimonials,
  getSiteContent,
} from "@/lib/content";
import { getBlogPosts } from "@/lib/blog";
import { normalizeHeroContent } from "@/lib/hero-content";
import { homePageJsonLd, homePageMetadata } from "@/lib/home-seo";
import {
  defaultCta,
  defaultHero,
  homeStats,
  marqueeItems,
  pickCta,
  processSteps,
  type CtaContent,
} from "@/lib/site-data";
import { homeSectionsDefaults } from "@/lib/page-content-defaults";
import "@/styles/home.css";
import { jsonLdString } from "@/lib/json-ld";

export const revalidate = 30;

export const metadata = homePageMetadata();


export default async function HomePage() {
  const [
    projects,
    services,
    stats,
    hero,
    cta,
    marquee,
    steps,
    testimonials,
    logos,
    faqs,
    homeSections,
    latestPosts,
  ] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
    getSiteContent("homeStats", homeStats),
    getSiteContent("hero", defaultHero),
    getSiteContent<CtaContent>("cta", defaultCta),
    getSiteContent<readonly string[]>("marqueeItems", marqueeItems),
    getSiteContent<typeof processSteps>("processSteps", processSteps),
    getPublishedTestimonials(),
    getPublishedLogos(),
    getPublishedFaqs(),
    getSiteContent("homeSections", homeSectionsDefaults),
    getBlogPosts({ page: 1, limit: 3 }).catch(() => null),
  ]);

  const homeCta = pickCta(cta, "home");
  const heroCopy = normalizeHeroContent(hero);
  const jsonLd = homePageJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(jsonLd.length === 1 ? jsonLd[0] : jsonLd),
        }}
      />
      <main id="top" className="home-cinema">
        <HomeHero
          content={heroCopy}
          proof={projects.slice(0, 4).map((project) => ({ title: project.title, href: `/work/${project.slug}` }))}
        />
        <HomeBelowFold
          projects={projects}
          services={services}
          stats={stats as typeof homeStats}
          cta={homeCta}
          marquee={marquee}
          steps={steps}
          testimonials={testimonials}
          logos={logos}
          faqs={faqs}
          sections={homeSections}
          posts={latestPosts?.posts ?? []}
        />
      </main>
    </>
  );
}
