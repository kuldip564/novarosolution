import type { Metadata } from "next";
import { RevealScope } from "@/components/anim/RevealScope";
import {
  AboutHero,
  AboutPractices,
  AboutStory,
  AboutTeam,
  AboutTimeline,
  AboutValues,
  AboutWhy,
  AboutWork,
} from "@/components/about/AboutSections";
import { StudioClosing } from "@/components/studio/StudioClosing";
import {
  defaultAboutPage,
  normalizeAboutPage,
  normalizeAboutStats,
  normalizeAboutWhyItems,
} from "@/lib/about-content";
import { getPublishedProjects, getPublishedTeam, getSiteContent } from "@/lib/content";
import { mapDbProjectsToWork, mapDbTeam, type TeamMemberView } from "@/lib/content-mappers";
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
import { jsonLdString } from "@/lib/json-ld";
import { toWorkProjects } from "@/lib/work-portfolio";
import "@/styles/studio.css";
import "@/styles/about.css";

export const revalidate = 30;

const aboutDescription =
  "Meet Novaro Solution, a Gandhinagar software studio building web and mobile apps, AI systems, and digital growth experiences for businesses in India and worldwide.";


export const metadata: Metadata = createPageMetadata({
  title: "About Novaro Solution | IT Company in Gandhinagar",
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
  const [team, aboutPage, stats, whyItems, cta, projects] = await Promise.all([
    getPublishedTeam(),
    getSiteContent("aboutPage", defaultAboutPage),
    getSiteContent("aboutStats", aboutStats),
    getSiteContent("whyItems", defaultWhyItems),
    getSiteContent<CtaContent>("cta", defaultCta),
    getPublishedProjects(),
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
      <main className="st ab">
        <RevealScope attribute="data-st-reveal">
          <AboutHero team={teamView} stats={normalizeAboutStats(stats)} />
          <AboutStory who={content.whoWeAre} missionVision={content.missionVision} />
          <AboutTimeline timeline={content.timeline} />
          <AboutValues values={content.values} />
          <AboutTeam content={content.team} team={teamView} />
          <AboutPractices />
          <AboutWhy content={content.whyUs} items={normalizeAboutWhyItems(whyItems)} />
          <AboutWork projects={toWorkProjects(mapDbProjectsToWork(projects))} />
          <StudioClosing
            id="ab-closing-title"
            eyebrow={content.cta.eyebrow}
            title={aboutCta.title}
            lede={aboutCta.description}
            buttonLabel={content.cta.buttonLabel}
            location="about-cta"
          />
        </RevealScope>
      </main>
    </>
  );
}
