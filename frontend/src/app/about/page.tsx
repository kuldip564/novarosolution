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
import { aboutKeywords } from "@/lib/geo-seo";
import {
  aboutStats,
  defaultCta,
  pickCta,
  whyItems as defaultWhyItems,
  type CtaContent,
} from "@/lib/site-data";
import "@/styles/about.css";

export const revalidate = 30;

export const metadata: Metadata = createPageMetadata({
  title: "About Us — IT Studio Gandhinagar, Gujarat",
  description:
    "Meet Novaro Solution — Gandhinagar & Ahmedabad IT studio. 8-person team shipping web apps, AI/ML & digital marketing for 32+ clients across Gujarat & India since 2024.",
  path: "/about",
  keywords: aboutKeywords,
});

export default async function AboutPage() {
  const [team, aboutPage, stats, whyItems, cta] = await Promise.all([
    getPublishedTeam(),
    getSiteContent("aboutPage", defaultAboutPage),
    getSiteContent("aboutStats", aboutStats),
    getSiteContent("whyItems", defaultWhyItems),
    getSiteContent<CtaContent>("cta", defaultCta),
  ]);

  const content = normalizeAboutPage(aboutPage);
  const aboutCta = pickCta(cta, "about");

  return (
    <>
      <AboutExperience
      content={content}
      stats={normalizeAboutStats(stats)}
      whyItems={normalizeAboutWhyItems(whyItems)}
      team={mapDbTeam(team)}
      ctaTitle={aboutCta.title}
      ctaDescription={aboutCta.description}
      />
    </>
  );
}
