"use client";

import { useEffect, useRef, useState } from "react";

export type StudioStage = {
  /** Short marker shown in the circle, e.g. "01" or "2024". */
  marker: string;
  title: string;
  body: string;
};

/**
 * Stages with a progress line (delivery process, company timeline). The active stage follows
 * the reader's position in the section: no pinning and no scroll locking. Under reduced motion
 * every stage stays fully visible and only the highlight moves.
 */
export function StudioProcess({ stages, onWhite = false }: { stages: StudioStage[]; onWhite?: boolean }) {
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      // 0 when the list's top reaches 70% of the viewport, 1 when its bottom reaches 40%.
      const start = window.innerHeight * 0.7;
      const end = window.innerHeight * 0.4;
      const total = rect.height + (start - end);
      const progress = Math.min(Math.max((start - rect.top) / total, 0), 1);
      list.style.setProperty("--st-process", progress.toFixed(4));
      setActive(Math.min(stages.length - 1, Math.floor(progress * stages.length)));
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) update();
    });
    io.observe(list);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [stages.length]);

  return (
    <ol
      ref={ref}
      className={`st-process__list${onWhite ? " st-process--on-white" : ""}`}
      style={{ ["--st-stages" as string]: stages.length }}
    >
      <span className="st-process__track" aria-hidden="true">
        <span className="st-process__fill" />
      </span>
      {stages.map((stage, index) => (
        <li
          key={`${stage.marker}-${stage.title}`}
          className={`st-process__step${index === active ? " is-active" : ""}${index < active ? " is-done" : ""}`}
          aria-current={index === active ? "step" : undefined}
        >
          <span className="st-process__num" aria-hidden="true">
            {stage.marker}
          </span>
          <h3>{stage.title}</h3>
          <p>{stage.body}</p>
        </li>
      ))}
    </ol>
  );
}
