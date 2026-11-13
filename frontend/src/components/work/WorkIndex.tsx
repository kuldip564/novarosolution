"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import type { WorkProject } from "@/lib/work-portfolio";

const ALL = "All projects";

/**
 * Filterable index of every published project. Filters are built from the data, so a
 * category only appears when real projects belong to it. Rows are plain links; the preview
 * image appears on hover or keyboard focus on wide screens only.
 */
export function WorkIndex({ projects }: { projects: WorkProject[] }) {
  const groups = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) counts.set(project.group, (counts.get(project.group) ?? 0) + 1);
    return [...counts.entries()];
  }, [projects]);
  const [active, setActive] = useState(ALL);
  const visible = active === ALL ? projects : projects.filter((project) => project.group === active);

  return (
    <div className="wk-index">
      {groups.length > 1 ? (
        <div className="wk-filters" role="group" aria-label="Filter projects by type">
          {[[ALL, projects.length] as const, ...groups].map(([group, count]) => (
            <button
              key={group}
              type="button"
              className="wk-filter"
              aria-pressed={active === group}
              onClick={() => setActive(group)}
            >
              <span>{group}</span>
              <span className="wk-filter__count">{String(count).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} of {projects.length} projects
      </p>

      {visible.length ? (
        <ol className="wk-index__list" key={active}>
          {visible.map((project, index) => (
            <li key={project.slug} className="wk-row" style={{ ["--i" as string]: index }}>
              <Link href={project.href} className="wk-row__link">
                <span className="wk-row__num">{project.number}</span>
                <span className="wk-row__title">{project.title}</span>
                <span className="wk-row__type">{project.projectType}</span>
                <span className="wk-row__industry">{project.industry}</span>
                <span className="wk-row__stack">{project.stack.slice(0, 2).join(" · ")}</span>
                <span className="wk-row__go" aria-hidden="true">
                  <ArrowUpRight size={20} strokeWidth={1.8} />
                </span>
              </Link>
              {project.art ? (
                <span className="wk-row__preview" aria-hidden="true">
                  <CloudinaryImage
                    asset={project.art}
                    alt=""
                    width={480}
                    height={480}
                    transformWidth={480}
                    className="wk-row__preview-img"
                    sizes="240px"
                  />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="wk-index__empty">
          No projects in this category yet.{" "}
          <button type="button" className="wk-index__reset" onClick={() => setActive(ALL)}>
            Show all projects
          </button>
        </p>
      )}
    </div>
  );
}
