import type { Metadata } from "next";
import { AboutExperience } from "@/components/about/AboutExperience";
import {
  defaultAboutPage,
  normalizeAboutPage,
  normalizeAboutStats,
  normalizeAboutWhyItems,
} from "@/lib/about-content";
import { getPublishedTeam, getSiteContent } from "@/lib/content";
import { mapDbTeam } from "@/lib/content-mappers";
import { createPageMetadata } from "@/lib/site-metadata";
import {
  defaultCta,
  pickCta,
  type CtaContent,
} from "@/lib/site-data";
import "@/styles/about.css";

export const revalidate = 30;

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Meet Novaro Solution — a senior IT studio shipping web apps, AI systems, and growth programs from Gandhinagar.",
  path: "/about",
});

export default async function AboutPage() {
  const [team, aboutPage, stats, whyItems, cta] = await Promise.all([
    getPublishedTeam(),
    getSiteContent("aboutPage", defaultAboutPage),
    getSiteContent("aboutStats", [
      { value: 2, suffix: " yrs", label: "Years of experience" },
      { value: 32, suffix: "+", label: "Happy clients" },
      { value: 14, suffix: "", label: "People on the team" },
      { value: 98, suffix: "%", label: "Client retention" },
    ]),
    getSiteContent("whyItems", []),
    getSiteContent<CtaContent>("cta", defaultCta),
  ]);

  const content = normalizeAboutPage(aboutPage);
  const aboutCta = pickCta(cta, "about");

  return (
    <AboutExperience
      content={content}
      stats={normalizeAboutStats(stats)}
      whyItems={normalizeAboutWhyItems(whyItems)}
      team={mapDbTeam(team)}
      ctaTitle={aboutCta.title}
      ctaDescription={aboutCta.description}
    />
  );
}
