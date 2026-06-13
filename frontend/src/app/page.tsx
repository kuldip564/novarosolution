import { CtaBand } from "@/components/sections/CtaBand";
import { Hero } from "@/components/sections/Hero";
import { LogoStrip, mapDbLogos } from "@/components/sections/LogoStrip";
import { Marquee } from "@/components/sections/Marquee";
import { Process } from "@/components/sections/Process";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Stats } from "@/components/sections/Stats";
import {
  TestimonialsSection,
  mapDbTestimonials,
} from "@/components/sections/TestimonialsSection";
import { WorkGrid } from "@/components/sections/WorkGrid";
import {
  getPublishedLogos,
  getPublishedProjects,
  getPublishedServices,
  getPublishedTestimonials,
  getSiteContent,
} from "@/lib/content";
import {
  mapDbProjectsToHomeGrid,
  mapDbServicesToGrid,
} from "@/lib/content-mappers";
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
      <Marquee items={marquee} />
      <LogoStrip items={mapDbLogos(logos)} />
      <ServicesGrid services={mapDbServicesToGrid(services)} />
      <WorkGrid projects={mapDbProjectsToHomeGrid(projects)} />
      <Stats items={stats as typeof homeStats} />
      <TestimonialsSection items={mapDbTestimonials(testimonials)} />
      <Process steps={steps} />
      <CtaBand title={homeCta.title} description={homeCta.description} />
    </main>
  );
}
