"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { memo, useState } from "react";
import { Reveal } from "@/components/anim/Reveal";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import type { WorkProjectView } from "@/lib/content-mappers";
import { useMotionSettings } from "@/lib/motion-provider";
import { projectDomain } from "@/lib/project-domain";
import { getWorkProjectImages } from "@/lib/work-project-images";
import { useHydratedScroll } from "@/lib/use-hydrated-scroll";
import { workProjects as fallbackProjects } from "@/lib/site-data";

type WorkExperienceProps = {
  projects?: WorkProjectView[];
};

type WorkProjectSectionProps = {
  project: WorkProjectView;
  index: number;
  open: boolean;
  cinematic: boolean;
  onToggle: () => void;
};

function withWorkDefaults(
  projects: typeof fallbackProjects,
): WorkProjectView[] {
  return projects.map((project, index) => {
    const images = getWorkProjectImages(project.slug);
    return {
      ...project,
      idx: String(index + 1).padStart(2, "0"),
      heroImage: images?.hero ?? null,
      screens: images?.screens ?? [],
      coverClass: `c${(index % 4) + 1}`,
    };
  });
}

function WorkProjectSection({
  project,
  index,
  open,
  cinematic,
  onToggle,
}: WorkProjectSectionProps) {
  const domain = projectDomain(project.externalUrl);
  const screens = project.screens?.length > 0 ? project.screens : null;

  const { ref, scrollYProgress } = useHydratedScroll({
    offset: ["start end", "end start"],
    enabled: cinematic,
  });

  const cardY = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [56, 0, 0, -40]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.35, 1, 1, 0.55]);
  const cardScale = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.94, 1, 1, 0.97]);
  const visualY = useTransform(scrollYProgress, [0, 1], [-24, 24]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.25, 0.7, 0.35]);

  const content = (
    <>
      <div className="work-project__aura" aria-hidden />
      <div className="wrap work-project__inner">
        <motion.div
          className="work-project__visual"
          style={cinematic ? { y: visualY } : undefined}
          aria-hidden={project.heroImage ? undefined : true}
        >
          {cinematic ? (
            <motion.div
              className="work-project__visual-glow"
              style={{ opacity: glowOpacity }}
              aria-hidden
            />
          ) : null}
          {project.heroImage ? (
            <CloudinaryImage
              asset={project.heroImage}
              alt={getWorkProjectImages(project.slug)?.heroAlt ?? project.heroTitle}
              width={1200}
              height={900}
              className="work-project__photo"
              transformWidth={960}
              priority={index === 0}
              sizes="(max-width: 979px) 100vw, 44vw"
            />
          ) : (
            <div className={`work-project__cover cover ${project.coverClass}`}>
              <div className="mesh" />
              <span className="work-project__monogram" aria-hidden>
                {project.title.charAt(0)}
              </span>
              {domain ? (
                <span className="work-project__domain">{domain}</span>
              ) : null}
            </div>
          )}
        </motion.div>

        <div className="work-project__panel">
          <div className="work-project__head">
            <div className="work-project__meta">
              <span className="work-project__idx">{project.idx}</span>
              <span className="work-project__cat">{project.category}</span>
            </div>
            <h2 className="work-project__title">{project.title}</h2>
            <p className="work-project__hook">{project.hook}</p>
          </div>

          <div className="work-project__metrics">
            {project.results.map((result, resultIndex) => {
              const value = typeof result === "string" ? result : result.value;
              const label =
                typeof result === "string"
                  ? `Result ${resultIndex + 1}`
                  : result.label;
              return (
                <div key={`${label}-${value}`} className="work-project__metric">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>

          <div className="work-project__tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="work-project__actions">
            {project.externalUrl ? (
              <a
                href={project.externalUrl}
                className="work-project__cta work-project__cta--primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit live site
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            ) : null}
            <button
              type="button"
              className="work-project__cta work-project__cta--ghost"
              aria-expanded={open}
              aria-controls={`work-details-${project.slug}`}
              onClick={onToggle}
            >
              {open ? "Hide details" : "View details"}
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          <div
            id={`work-details-${project.slug}`}
            className="work-project__details"
            aria-hidden={!open}
          >
            <div className="work-project__details-inner">
              <p className="work-project__story">{project.story}</p>
              {screens ? (
                <div className="work-project__shots">
                  {screens.map((screen, screenIndex) => (
                    <CloudinaryImage
                      key={`${screen.publicId ?? screen.secureUrl}-${screenIndex}`}
                      asset={screen}
                      alt={`${project.title} screen ${screenIndex + 1}`}
                      width={1200}
                      height={1600}
                      className="work-project__shot"
                      transformWidth={800}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <section
      ref={ref}
      id={`work-${project.slug}`}
      className={`work-project ${open ? "is-open" : ""}`}
    >
      {cinematic ? (
        <motion.div
          className="work-project__motion"
          style={{
            y: cardY,
            opacity: cardOpacity,
            scale: cardScale,
            willChange: "transform, opacity",
          }}
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
    </section>
  );
}

function WorkExperienceInner({
  projects = withWorkDefaults([...fallbackProjects]),
}: WorkExperienceProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const { performanceTier } = useMotionSettings();
  const cinematic = !reduced && performanceTier !== "low";

  return (
    <div className="work-showcase">
      <nav className="work-jump wrap" aria-label="Jump to project">
        {projects.map((project) => (
          <a
            key={project.slug}
            href={`#work-${project.slug}`}
            className="work-jump__link"
          >
            <span className="work-jump__idx">{project.idx}</span>
            <span className="work-jump__name">{project.title}</span>
          </a>
        ))}
      </nav>

      {projects.map((project, index) => (
        <Reveal key={project.slug}>
          <WorkProjectSection
            project={project}
            index={index}
            open={openSlug === project.slug}
            cinematic={cinematic}
            onToggle={() =>
              setOpenSlug(openSlug === project.slug ? null : project.slug)
            }
          />
        </Reveal>
      ))}
    </div>
  );
}

export const WorkExperience = memo(WorkExperienceInner);
WorkExperience.displayName = "WorkExperience";
