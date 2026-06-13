import Link from "next/link";
import { CloudinaryImage } from "@/components/admin/CloudinaryImage";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/Button";
import type { HomeProjectView } from "@/lib/content-mappers";
import { homeProjects as fallbackProjects } from "@/lib/site-data";

type WorkGridProps = {
  projects?: HomeProjectView[];
};

export function WorkGrid({ projects = [...fallbackProjects] }: WorkGridProps) {
  return (
    <section className="sec work-preview" id="services">
      <div className="wrap">
        <div className="sec-head">
          <Reveal>
            <span className="eyebrow">Selected work</span>
            <h2>
              Projects we&apos;re proud
              <br />
              to put our name on.
            </h2>
            <p>
              A look at recent products and campaigns across fintech, healthcare,
              commerce, and SaaS.
            </p>
          </Reveal>
        </div>

        <div className="work-grid">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={((index % 2) + 1) * 0.1}>
              <Link href={project.href} className="proj">
                {project.imageAsset?.secureUrl ? (
                  <div className="cover cover-photo">
                    <CloudinaryImage
                      asset={project.imageAsset}
                      alt={project.title}
                      width={800}
                      height={560}
                      transformWidth={640}
                      className="cover-img"
                    />
                  </div>
                ) : (
                  <div className={`cover ${project.cover}`}>
                    <div className="mesh" />
                  </div>
                )}
                <div className="arrow">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </div>
                <div className="meta">
                  <span className="cat">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="center-foot">
          <Button href="/work" variant="ghost">
            View full portfolio
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
