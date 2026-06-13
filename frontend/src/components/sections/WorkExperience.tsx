"use client";

import { memo, useState } from "react";
import { Parallax } from "@/components/anim/Parallax";
import { Reveal } from "@/components/anim/Reveal";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { MediaPlaceholder } from "@/components/sections/MediaPlaceholder";
import type { WorkProjectView } from "@/lib/content-mappers";
import { workProjects as fallbackProjects } from "@/lib/site-data";

type WorkExperienceProps = {
  projects?: WorkProjectView[];
};

function withWorkDefaults(
  projects: typeof fallbackProjects,
): WorkProjectView[] {
  return projects.map((project, index) => ({
    ...project,
    idx: String(index + 1).padStart(2, "0"),
    heroImage: null,
    screens: [],
    coverClass: `c${(index % 4) + 1}`,
  }));
}

function WorkExperienceInner({
  projects = withWorkDefaults([...fallbackProjects]),
}: WorkExperienceProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {projects.map((project, index) => {
        const open = openIndex === index;
        const screens =
          project.screens?.length > 0
            ? project.screens
            : null;

        return (
          <Reveal key={project.title}>
            <section className={`exp ${open ? "open" : ""}`}>
              <Parallax speed={0.18} className="exp-bg">
                {project.heroImage ? (
                  <CloudinaryImage
                    asset={project.heroImage}
                    alt={project.heroTitle}
                    width={1920}
                    height={1080}
                    className="exp-media exp-media-img"
                    transformWidth={1920}
                    priority={index === 0}
                    sizes="100vw"
                  />
                ) : (
                  <MediaPlaceholder
                    title={project.heroTitle}
                    hint="Drop a 1920×1080 image or looping video here"
                    className="exp-media"
                  />
                )}
              </Parallax>

              <div className="wrap exp-inner">
                <div className="exp-content">
                  <span className="idx">{project.idx}</span>
                  <span className="cat">{project.category}</span>
                  <h2>{project.title}</h2>
                  <p className="hook">{project.hook}</p>
                  <button
                    type="button"
                    className="exp-toggle"
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span className="pl">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                    View case study
                  </button>

                  <div className="drawer">
                    <p>{project.story}</p>
                    <div className="drawer-grid">
                      {screens
                        ? screens.map((screen, screenIndex) => (
                            <CloudinaryImage
                              key={`${screen.publicId ?? screen.secureUrl}-${screenIndex}`}
                              asset={screen}
                              alt={`${project.title} screen ${screenIndex + 1}`}
                              width={1200}
                              height={1600}
                              className="drawer-shot"
                              transformWidth={800}
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ))
                        : ["Screen 1", "Screen 2", "Screen 3"].map((screen) => (
                            <MediaPlaceholder
                              key={screen}
                              title={screen}
                              hint="1200×1600 · UI / shot"
                            />
                          ))}
                    </div>
                    <div className="results">
                      {project.results.map((result, resultIndex) => {
                        const value =
                          typeof result === "string" ? result : result.value;
                        const label =
                          typeof result === "string"
                            ? `Result ${resultIndex + 1}`
                            : result.label;
                        return (
                          <div key={`${label}-${value}`} className="r">
                            <div className="v">{value}</div>
                            <div className="l">{label}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="tags">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>
        );
      })}
    </>
  );
}

export const WorkExperience = memo(WorkExperienceInner);
WorkExperience.displayName = "WorkExperience";
