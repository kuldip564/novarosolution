import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { Stats } from "@/components/sections/Stats";
import { TeamSection } from "@/components/sections/TeamSection";
import { WhySection } from "@/components/sections/WhySection";
import { getPublishedTeam, getSiteContent } from "@/lib/content";
import { mapDbTeam } from "@/lib/content-mappers";
import { aboutStats } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const [team, stats] = await Promise.all([
    getPublishedTeam(),
    getSiteContent("aboutStats", aboutStats),
  ]);

  return (
    <main>
      <PageHead
        eyebrow="About Novaro"
        title={"A small senior team\nthat ships big things."}
        description="We started Novaro Solution to do work we'd be proud to sign — software, AI, and growth handled by people who actually build, not hand off."
        splitTitle
      />
      <WhySection />
      <Stats items={stats as typeof aboutStats} />
      <TeamSection members={mapDbTeam(team)} />
      <CtaBand
        eyebrow="Work with us"
        title={
          <>
            Let&apos;s build something
            <br />
            worth showing off.
          </>
        }
        description="Tell us what you're working on. We'll come back within one business day."
      />
    </main>
  );
}
