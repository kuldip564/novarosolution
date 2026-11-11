import type { Metadata } from "next";
import { AboutExperience } from "@/components/about/AboutExperience";
import {
  defaultAboutPage,
  normalizeAboutPage,
  normalizeAboutStats,
  normalizeAboutWhyItems,
} from "@/lib/about-content";
import { getPublishedTeam, getSiteContent } from "@/lib/content";
import { mapDbTeam, type TeamMemberView } from "@/lib/content-mappers";
import { createPageMetadata, siteBaseUrl } from "@/lib/site-metadata";
import { breadcrumbJsonLd, ORGANIZATION_ID, webPageJsonLd } from "@/lib/structured-data";
import { teamMemberSlug } from "@/lib/team-photos";
import { getTeamProfile } from "@/lib/team-profiles";
import { aboutKeywords } from "@/lib/geo-seo";
import {
  aboutStats,
  defaultCta,
  pickCta,
  whyItems as defaultWhyItems,
  type CtaContent,
} from "@/lib/site-data";
import "@/styles/about.css";
import { jsonLdString } from "@/lib/json-ld";

export const revalidate = 30;

const aboutDescription =
  "Novaro Solution builds web apps, AI systems, and digital marketing for companies in the USA, UK, Europe, and India. Studio in Gandhinagar since 2024.";


export const metadata: Metadata = createPageMetadata({
  title: "About Novaro Solution — Global Software Studio",
  description: aboutDescription,
  path: "/about",
  keywords: aboutKeywords,
});

/** Person entries for the real team shown on the page — work details only, no personal contact data. */
function teamJsonLd(team: TeamMemberView[]) {
  const base = siteBaseUrl();
  return team.map((member) => {
    const profile = getTeamProfile(member.name);
    const image = member.photo ? (member.photo.startsWith("http") ? member.photo : `${base}${member.photo}`) : undefined;
    return {
      "@type": "Person",
      "@id": `${base}/about#${teamMemberSlug(member.name)}`,
      name: member.name,
      jobTitle: member.role.replace(" · ", ", "),
      worksFor: { "@id": ORGANIZATION_ID },
      ...(image ? { image } : {}),
      ...(profile?.summary ? { description: profile.summary } : {}),
      ...(profile?.skills?.length ? { knowsAbout: profile.skills.slice(0, 8) } : {}),
      workLocation: { "@type": "Place", name: "Gandhinagar, Gujarat, India" },
    };
  });
}

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
  const teamView = mapDbTeam(team);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { ...webPageJsonLd({ path: "/about", name: "About Novaro Solution", description: aboutDescription, type: "AboutPage" }), "@context": undefined },
      ...teamJsonLd(teamView),
      { ...breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]), "@context": undefined },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <AboutExperience
      content={content}
      stats={normalizeAboutStats(stats)}
      whyItems={normalizeAboutWhyItems(whyItems)}
      team={teamView}
      ctaTitle={aboutCta.title}
      ctaDescription={aboutCta.description}
      />
    </>
  );
}
