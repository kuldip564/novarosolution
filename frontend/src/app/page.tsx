import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { PageSkeleton } from "@/components/ui/Skeleton";
import {
  getPublishedLogos,
  getPublishedProjects,
  getPublishedServices,
  getPublishedTestimonials,
  getSiteContent,
} from "@/lib/content";
import {
  defaultCta,
  defaultHero,
  homeStats,
  marqueeItems,
  pickCta,
  processSteps,
  type CtaContent,
} from "@/lib/site-data";
import { normalizeHeroContent } from "@/lib/hero-content";

export const revalidate = 30;

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
  ]);

  const homeCta = pickCta(cta, "home");
  const heroCopy = normalizeHeroContent(hero);

  return (
    <main id="top">
      <Hero content={heroCopy} />
      <HomeBelowFold
        projects={projects}
        services={services}
        stats={stats as typeof homeStats}
        cta={homeCta}
        marquee={marquee}
        steps={steps}
        testimonials={testimonials}
        logos={logos}
      />
    </main>
  );
}
