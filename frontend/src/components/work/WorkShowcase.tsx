"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import type { CaseStudyScreenshot } from "@/lib/case-study-content";
import type { WorkProject } from "@/lib/work-portfolio";

type Variant = "full" | "split" | "layered" | "offset";
const VARIANTS: Variant[] = ["full", "split", "layered", "offset"];

function BrowserFrame({ shot, domain, sizes, className = "" }: { shot: CaseStudyScreenshot; domain: string | null; sizes: string; className?: string }) {
  return (
    <figure className={`wk-frame wk-frame--browser ${className}`.trim()}>
      <div className="wk-frame__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        {domain ? <em>{domain}</em> : null}
      </div>
      <div className="wk-frame__media">
        <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} />
      </div>
    </figure>
  );
}

function PhoneFrame({ shot, className = "" }: { shot: CaseStudyScreenshot; className?: string }) {
  return (
    <figure className={`wk-frame wk-frame--phone ${className}`.trim()}>
      <div className="wk-frame__media">
        <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 767px) 60vw, 220px" />
      </div>
    </figure>
  );
}

/** Branded stand-in when a project has no screenshots: never a fake product UI. */
function BrandVisual({ project }: { project: WorkProject }) {
  return (
    <figure className="wk-frame wk-frame--brand">
      <div className="wk-frame__media wk-brand">
        {project.art ? (
          <CloudinaryImage
            asset={project.art}
            alt={project.artAlt}
            width={1024}
            height={1024}
            transformWidth={1024}
            className="wk-brand__img"
            sizes="(max-width: 767px) 100vw, 60vw"
          />
        ) : (
          <span className="wk-brand__mark" aria-hidden="true">
            {project.title.charAt(0)}
          </span>
        )}
        {project.domain ? <span className="wk-brand__domain">{project.domain}</span> : null}
      </div>
    </figure>
  );
}

function Meta({ project, total }: { project: WorkProject; total: number }) {
  return (
    <div className="wk-feature__meta" data-wk-reveal style={{ ["--i" as string]: 0 }}>
      <span className="wk-feature__num">
        {project.number}
        <span>/ {String(total).padStart(2, "0")}</span>
      </span>
      <span className="wk-feature__type">{project.projectType}</span>
      <span className="wk-feature__industry">{project.industry}</span>
    </div>
  );
}

function Details({ project }: { project: WorkProject }) {
  return (
    <div className="wk-feature__details">
      <p className="wk-feature__summary" data-wk-reveal style={{ ["--i" as string]: 1 }}>
        {project.summary}
      </p>
      {project.stack.length ? (
        <ul className="wk-tags" aria-label={`${project.title} technologies`} data-wk-reveal style={{ ["--i" as string]: 2 }}>
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      ) : null}
      <div className="wk-feature__actions" data-wk-reveal style={{ ["--i" as string]: 3 }}>
        <Link href={project.href} className="wk-cta-link">
          <span>View case study</span>
          <span className="wk-cta-link__arrow" aria-hidden="true">
            <ArrowUpRight size={18} strokeWidth={2} />
          </span>
          <span className="sr-only">: {project.title}</span>
        </Link>
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="wk-live-link">
            {project.liveLabel ?? "Live site"}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}

/** App projects: three phone screens side by side, the middle one raised. */
function PhonesVisual({ project }: { project: WorkProject }) {
  return (
    <div className="wk-visual wk-visual--phones" data-wk-tilt>
      {project.phones.slice(0, 3).map((shot) => (
        <PhoneFrame key={shot.src} shot={shot} />
      ))}
    </div>
  );
}

function Visual({ project, variant }: { project: WorkProject; variant: Variant }) {
  const [first, second] = project.desktop;
  if (!first) return project.phones.length > 1 ? <PhonesVisual project={project} /> : <BrandVisual project={project} />;
  const wide = variant === "full" || variant === "offset";
  const main = variant === "split" && second ? second : first;
  return (
    <div className={`wk-visual${project.mobile ? " wk-visual--has-phone" : ""}`} data-wk-tilt>
      <BrowserFrame
        shot={main}
        domain={project.domain}
        className="wk-visual__main"
        sizes={wide ? "(max-width: 1279px) 90vw, 1100px" : "(max-width: 1279px) 60vw, 760px"}
      />
      {variant === "offset" && second ? (
        <BrowserFrame shot={second} domain={project.domain} className="wk-visual__second" sizes="(max-width: 1023px) 1px, 520px" />
      ) : null}
      {project.mobile ? <PhoneFrame shot={project.mobile} className="wk-visual__phone" /> : null}
    </div>
  );
}

function Feature({ project, index, total }: { project: WorkProject; index: number; total: number }) {
  const variant = VARIANTS[index % VARIANTS.length];
  return (
    <article
      id={`project-${project.slug}`}
      className={`wk-feature wk-feature--${variant}`}
      aria-labelledby={`project-${project.slug}-title`}
      data-wk-index={index}
    >
      <div className="wk-feature__inner wrap">
        <div className="wk-feature__copy">
          <header className="wk-feature__head">
            <Meta project={project} total={total} />
            <h3 id={`project-${project.slug}-title`} className="wk-feature__title" data-wk-reveal style={{ ["--i" as string]: 1 }}>
              <Link href={project.href}>{project.title}</Link>
            </h3>
            <span className="wk-feature__accent" aria-hidden="true" />
          </header>
          <Details project={project} />
        </div>
        <div className="wk-feature__stage" data-wk-reveal="" data-wk-frame>
          <Visual project={project} variant={variant} />
        </div>
      </div>
    </article>
  );
}

/**
 * Featured projects with four editorial layouts, a progress rail on wide screens and a
 * restrained pointer tilt on the visuals (fine pointers only, off for reduced motion).
 */
export function WorkShowcase({ projects }: { projects: WorkProject[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  // Active project and rail visibility.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const features = [...root.querySelectorAll<HTMLElement>(".wk-feature")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.wkIndex ?? 0));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    features.forEach((feature) => io.observe(feature));
    // Visible only while the showcase covers the middle of the screen, so it never sits beside other sections.
    const section = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      rootMargin: "-48% 0px -48% 0px",
    });
    section.observe(root);
    return () => {
      io.disconnect();
      section.disconnect();
    };
  }, []);

  // Scroll progress through the showcase, written to a CSS variable (no React re-render).
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !inView) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const progress = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0;
      root.style.setProperty("--wk-progress", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [inView]);

  // Restrained tilt with smooth interpolation (max ~2.5°).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const cleanups: Array<() => void> = [];
    for (const el of root.querySelectorAll<HTMLElement>("[data-wk-tilt]")) {
      let frame = 0;
      const current = { x: 0, y: 0 };
      const target = { x: 0, y: 0 };
      const step = () => {
        current.x += (target.x - current.x) * 0.12;
        current.y += (target.y - current.y) * 0.12;
        el.style.transform = `perspective(1400px) rotateX(${current.y.toFixed(3)}deg) rotateY(${current.x.toFixed(3)}deg)`;
        if (Math.abs(target.x - current.x) > 0.01 || Math.abs(target.y - current.y) > 0.01) {
          frame = requestAnimationFrame(step);
        } else {
          frame = 0;
          if (!target.x && !target.y) el.style.transform = "";
        }
      };
      const kick = () => {
        if (!frame) frame = requestAnimationFrame(step);
      };
      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
        target.y = -((event.clientY - rect.top) / rect.height - 0.5) * 3.5;
        kick();
      };
      const onLeave = () => {
        target.x = 0;
        target.y = 0;
        kick();
      };
      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        el.style.transform = "";
      });
    }
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div ref={rootRef} className="wk-showcase">
      <nav className={`wk-rail${inView ? " is-visible" : ""}`} aria-label="Featured projects">
        <span className="wk-rail__count" aria-hidden="true">
          {String(active + 1).padStart(2, "0")} <span>/ {String(projects.length).padStart(2, "0")}</span>
        </span>
        <span className="wk-rail__track" aria-hidden="true">
          <span className="wk-rail__fill" />
        </span>
        <ol>
          {projects.map((project, index) => (
            <li key={project.slug}>
              <a href={`#project-${project.slug}`} aria-current={index === active ? "true" : undefined}>
                <span className="wk-rail__dot" aria-hidden="true" />
                {/* Numbers keep the rail inside the page margin; names stay available to assistive tech. */}
                <span className="wk-rail__label" aria-hidden="true">
                  {project.number}
                </span>
                <span className="sr-only">{project.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {projects.map((project, index) => (
        <Feature key={project.slug} project={project} index={index} total={projects.length} />
      ))}
    </div>
  );
}
