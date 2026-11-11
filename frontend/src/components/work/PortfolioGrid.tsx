"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import type { CloudinaryAsset } from "@/lib/media";

export type PortfolioItem = {
  slug: string;
  title: string;
  group: string;
  industry: string;
  projectType: string;
  summary: string;
  technologies: string[];
  image: CloudinaryAsset | null;
  imageAlt: string;
  liveUrl: string | null;
  domain: string | null;
};

type Props = { items: PortfolioItem[] };

export function PortfolioGrid({ items }: Props) {
  const groups = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) counts.set(item.group, (counts.get(item.group) ?? 0) + 1);
    return [...counts.entries()];
  }, [items]);
  const [active, setActive] = useState<string>("All");
  const visible = active === "All" ? items : items.filter((item) => item.group === active);

  return (
    <div className="pf">
      {groups.length > 1 ? (
        <div className="pf-filters" role="group" aria-label="Filter projects by type">
          {[["All", items.length] as const, ...groups].map(([group, count]) => (
            <button
              key={group}
              type="button"
              className="pf-filter"
              aria-pressed={active === group}
              onClick={() => setActive(group)}
            >
              {group}
              <span className="pf-filter__count">{count}</span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} of {items.length} projects
      </p>

      <ul className="pf-grid">
        {visible.map((item, index) => (
          <li key={item.slug} className={`pf-card${index % 4 === 0 || index % 4 === 3 ? " pf-card--wide" : ""}`}>
            <Link href={`/work/${item.slug}`} className="pf-card__media" tabIndex={-1} aria-hidden>
              {item.image ? (
                <CloudinaryImage
                  asset={item.image}
                  alt={item.imageAlt}
                  width={960}
                  height={720}
                  transformWidth={960}
                  className="pf-card__img"
                  priority={index === 0}
                  sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 640px"
                />
              ) : (
                <span className="pf-card__monogram">{item.title.charAt(0)}</span>
              )}
              <span className="pf-card__badge">{item.projectType}</span>
            </Link>
            <div className="pf-card__body">
              <span className="pf-card__industry">{item.industry}</span>
              <h3 className="pf-card__title">
                <Link href={`/work/${item.slug}`}>{item.title}</Link>
              </h3>
              <p className="pf-card__summary">{item.summary}</p>
              {item.technologies.length ? (
                <ul className="pf-card__tech" aria-label="Technologies">
                  {item.technologies.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              ) : null}
              <div className="pf-card__actions">
                <Link href={`/work/${item.slug}`} className="pf-card__primary">
                  Read the case study
                  <ArrowRight size={16} aria-hidden />
                </Link>
                {item.liveUrl ? (
                  <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="pf-card__live">
                    {item.domain ?? "Live site"}
                    <ArrowUpRight size={15} aria-hidden />
                  </a>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
