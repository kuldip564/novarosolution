import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { getPublishedProjects, getSiteContent } from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";
import { createPageMetadata } from "@/lib/site-metadata";
import { workKeywords } from "@/lib/geo-seo";
import { defaultCta, pickCta, type CtaContent } from "@/lib/site-data";
import "@/styles/work.css";

const WorkExperience = dynamic(
  () =>
    import("@/components/sections/WorkExperience").then((m) => m.WorkExperience),
  { loading: () => <PageSkeleton /> },
);

export const revalidate = 30;

export const metadata: Metadata = createPageMetadata({
  title: "Portfolio — Web & App Projects | Gujarat, India",
  description:
    "Novaro Solution client work — Zeevan, KankreG, Mr Antidot & Quadrato Cargo. E-commerce, logistics & service platforms built in Gandhinagar, Gujarat for clients across India.",
  path: "/work",
  keywords: workKeywords,
});

export default async function WorkPage() {
  const [projects, cta] = await Promise.all([
    getPublishedProjects(),
    getSiteContent<CtaContent>("cta", defaultCta),
  ]);

  const workCta = pickCta(cta, "work");

  return (
    <main className="work-cinema">
      <PageHead
        eyebrow="Selected work"
        title="NOVARO"
        titleAccent="WORK"
        variant="bigword"
        description="Zeevan, KankreG, Mr Antidot, and Quadrato Cargo — live products we designed and built. Open any project for details or visit the site directly."
        className="blog-head"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
      />
      <WorkExperience projects={mapDbProjectsToWork(projects)} />
      <CtaBand
        eyebrow="Work with us"
        title={workCta.title}
        description={workCta.description}
      />
    </main>
  );
}
