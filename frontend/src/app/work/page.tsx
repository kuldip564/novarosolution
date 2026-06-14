import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHead } from "@/components/sections/PageHead";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { getPublishedProjects, getSiteContent } from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";
import { createPageMetadata } from "@/lib/site-metadata";
import { defaultCta, pickCta, type CtaContent } from "@/lib/site-data";

const WorkExperience = dynamic(
  () =>
    import("@/components/sections/WorkExperience").then((m) => m.WorkExperience),
  { loading: () => <PageSkeleton /> },
);

export const revalidate = 30;

export const metadata: Metadata = createPageMetadata({
  title: "Work",
  description: "Selected case studies and client work from Novaro Solution.",
  path: "/work",
});

export default async function WorkPage() {
  const [projects, cta] = await Promise.all([
    getPublishedProjects(),
    getSiteContent<CtaContent>("cta", defaultCta),
  ]);

  const workCta = pickCta(cta, "work");

  return (
    <main>
      <PageHead
        eyebrow="Selected work"
        title="SELECTED"
        titleAccent="WORK"
        variant="bigword"
        description="Immersive case studies across fintech, healthcare, commerce, and SaaS. Tap any project to go deeper."
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
