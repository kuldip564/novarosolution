import { CtaBand } from "@/components/sections/CtaBand";
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
import type { DbClientLogo, DbProject, DbService, DbTestimonial } from "@/lib/content";
import {
  mapDbProjectsToHomeGrid,
  mapDbServicesToGrid,
} from "@/lib/content-mappers";
import {
  homeStats,
  processSteps,
} from "@/lib/site-data";

type HomeBelowFoldProps = {
  projects: DbProject[];
  services: DbService[];
  stats: typeof homeStats;
  cta: { title: string; description: string };
  marquee: readonly string[];
  steps: typeof processSteps;
  testimonials: DbTestimonial[];
  logos: DbClientLogo[];
};

export function HomeBelowFold({
  projects,
  services,
  stats,
  cta,
  marquee,
  steps,
  testimonials,
  logos,
}: HomeBelowFoldProps) {
  return (
    <>
      <Marquee items={marquee} />
      <LogoStrip items={mapDbLogos(logos)} />
      <ServicesGrid services={mapDbServicesToGrid(services)} />
      <WorkGrid projects={mapDbProjectsToHomeGrid(projects)} />
      <Stats items={stats} />
      <TestimonialsSection items={mapDbTestimonials(testimonials)} />
      <Process steps={steps} />
      <CtaBand title={cta.title} description={cta.description} />
    </>
  );
}
