import type { Metadata } from "next";
import { Reveal } from "@/components/anim/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { WorkExperience } from "@/components/sections/WorkExperience";
import { getPublishedProjects } from "@/lib/content";
import { mapDbProjectsToWork } from "@/lib/content-mappers";

export const metadata: Metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <main>
      <section className="pagehead">
        <div className="grid" />
        <div className="glow g1" />
        <div className="wrap inner">
          <Reveal>
            <span className="eyebrow">Selected work</span>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bigword">
              <span className="o">SELECTED</span>
              <br />
              <span className="g">WORK</span>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ marginTop: 22 }}>
              Immersive case studies across fintech, healthcare, commerce, and
              SaaS. Tap any project to go deeper — and drop your own screenshots
              and demo videos into the marked spaces.
            </p>
          </Reveal>
        </div>
      </section>
      <WorkExperience projects={mapDbProjectsToWork(projects)} />
      <CtaBand
        eyebrow="Work with us"
        title={
          <>
            Have a project in mind?
            <br />
            Let&apos;s talk it through.
          </>
        }
        description="Share your goals and constraints — we'll respond with a clear path forward."
      />
    </main>
  );
}
