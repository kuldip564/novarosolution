import { CtaBand } from "@/components/sections/CtaBand";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Process } from "@/components/sections/Process";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Stats } from "@/components/sections/Stats";
import { WorkGrid } from "@/components/sections/WorkGrid";
import {
  getPublishedProjects,
  getPublishedServices,
  getSiteContent,
} from "@/lib/content";
import {
  mapDbProjectsToHomeGrid,
  mapDbServicesToGrid,
} from "@/lib/content-mappers";
import { homeStats } from "@/lib/site-data";

export default async function HomePage() {
  const [projects, services, stats] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
    getSiteContent("homeStats", homeStats),
  ]);

  return (
    <main id="top">
      <Hero />
      <Marquee />
      <ServicesGrid services={mapDbServicesToGrid(services)} />
      <WorkGrid projects={mapDbProjectsToHomeGrid(projects)} />
      <Stats items={stats as typeof homeStats} />
      <Process />
      <CtaBand
        title={
          <>
            Let&apos;s build something
            <br />
            worth showing off.
          </>
        }
        description="Tell us what you're working on. We'll come back within one business day with a way forward."
      />
    </main>
  );
}
