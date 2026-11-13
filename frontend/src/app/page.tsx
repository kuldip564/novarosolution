import { HomeHero } from "@/components/home/HomeHero";
import {
  HomeClosing,
  HomeFaq,
  HomeInsights,
  HomeIntro,
  HomeProcessSection,
  HomeServices,
  HomeTech,
  HomeTestimonials,
  HomeTrust,
  HomeWhy,
  HomeWork,
} from "@/components/home/HomeSections";
import { RevealScope } from "@/components/anim/RevealScope";
import { mapDbFaqs } from "@/components/sections/FaqSection";
import { mapDbLogos } from "@/components/sections/LogoStrip";
import { mapDbTestimonials } from "@/components/sections/TestimonialsSection";
import { getBlogPosts } from "@/lib/blog";
import {
  getPublishedFaqs,
  getPublishedLogos,
  getPublishedProjects,
  getPublishedServices,
  getPublishedTestimonials,
  getSiteContent,
} from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";
import { normalizeHeroContent } from "@/lib/hero-content";
import { homePageJsonLd, homePageMetadata } from "@/lib/home-seo";
import { jsonLdString } from "@/lib/json-ld";
import { defaultHero, homeStats } from "@/lib/site-data";
import { industriesByProject, toWorkProjects } from "@/lib/work-portfolio";
import "@/styles/home.css";

export const revalidate = 30;

export const metadata = homePageMetadata();

export default async function HomePage() {
  const [projects, services, stats, hero, testimonials, logos, faqs, latestPosts] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
    getSiteContent("homeStats", homeStats),
    getSiteContent("hero", defaultHero),
    getPublishedTestimonials(),
    getPublishedLogos(),
    getPublishedFaqs(),
    getBlogPosts({ page: 1, limit: 3 }).catch(() => null),
  ]);

  const work = toWorkProjects(mapDbProjectsToWork(projects));
  const serviceItems = services.map((service) => ({
    slug: service.slug,
    title: service.title,
    description: service.shortDescription ?? service.description,
  }));
  const heroContent = normalizeHeroContent(hero);
  // The hero already shows one figure; don't repeat it in the trust strip.
  const sameStat = (a: string, b: string) => a.replace(/\s+/g, "").toLowerCase() === b.replace(/\s+/g, "").toLowerCase();
  const trustStats = (stats as typeof homeStats).filter(
    (stat) =>
      !heroContent.metaStat ||
      !(sameStat(stat.label, heroContent.metaLabel) || sameStat(`${stat.value}${stat.suffix}`, heroContent.metaStat)),
  );
  const jsonLd = homePageJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd.length === 1 ? jsonLd[0] : jsonLd) }}
      />
      <main id="top" className="hm">
        <RevealScope attribute="data-hm-reveal">
          <HomeHero content={heroContent} services={serviceItems} />
          <HomeTrust
            projects={work}
            stats={trustStats}
            logos={mapDbLogos(logos)}
            industries={industriesByProject(work).map((industry) => industry.name.toLowerCase())}
          />
          <HomeIntro />
          <HomeServices services={serviceItems} />
          <HomeWork projects={work} />
          <HomeWhy />
          <HomeProcessSection />
          <HomeTech />
          <HomeTestimonials items={mapDbTestimonials(testimonials)} />
          <HomeInsights posts={latestPosts?.posts ?? []} />
          <HomeFaq faqs={mapDbFaqs(faqs)} />
          <HomeClosing />
        </RevealScope>
      </main>
    </>
  );
}
