import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { Stats } from "@/components/sections/Stats";
import { TeamSection } from "@/components/sections/TeamSection";
import { WhySection } from "@/components/sections/WhySection";
import { getPublishedTeam, getSiteContent } from "@/lib/content";
import { mapDbTeam } from "@/lib/content-mappers";
import { createPageMetadata } from "@/lib/site-metadata";
import {
  aboutStats,
  defaultCta,
  pickCta,
  type CtaContent,
} from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Meet the Novaro Solution team — a senior squad shipping web apps, AI systems, and growth programs.",
  path: "/about",
});

export default async function AboutPage() {
  const [team, stats, cta] = await Promise.all([
    getPublishedTeam(),
    getSiteContent("aboutStats", aboutStats),
    getSiteContent<CtaContent>("cta", defaultCta),
  ]);

  const aboutCta = pickCta(cta, "about");

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
        title={aboutCta.title}
        description={aboutCta.description}
      />
    </main>
  );
}
