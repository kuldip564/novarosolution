import dynamic from "next/dynamic";
import { HomeBackground } from "@/components/home/HomeBackground";
import { HomeHero } from "@/components/home/HomeHero";
import { PageSkeleton } from "@/components/ui/Skeleton";
import {
  getPublishedFaqs,
  getPublishedLogos,
  getPublishedProjects,
  getPublishedServices,
  getPublishedTestimonials,
  getSiteContent,
} from "@/lib/content";
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
import "@/styles/home.css";

export const revalidate = 30;

export const metadata = homePageMetadata();

const HomeBelowFold = dynamic(
  () =>
    import("@/components/home/HomeBelowFold").then((mod) => ({
      default: mod.HomeBelowFold,
    })),
  {
    loading: () => <PageSkeleton />,
  },
);

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
  ]);

  const homeCta = pickCta(cta, "home");
  const heroCopy = normalizeHeroContent(hero);
  const jsonLd = homePageJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="top" className="home-cinema">
        <HomeBackground />
        <HomeHero content={heroCopy} />
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
        />
      </main>
    </>
  );
}
