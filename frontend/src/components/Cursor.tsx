"use client";

import { useEffect } from "react";
import { isCoarsePointer, prefersReducedMotion } from "@/lib/device";

const INTERACTIVE_SELECTOR =
  "a, button, .chip, .exp-toggle, .tilt, .btn, .faq-trigger, summary";

export function Cursor() {
  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return;

    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    if (!dot || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      mx = event.clientX;
      my = event.clientY;
    };

    const animate = () => {
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = requestAnimationFrame(animate);
    };

    const onEnter = (event: Event) => {
      if ((event.target as Element).closest(INTERACTIVE_SELECTOR)) {
        ring.classList.add("hover");
      }
    };

    const onLeave = (event: Event) => {
      const related = (event as MouseEvent).relatedTarget as Element | null;
      if (!related?.closest(INTERACTIVE_SELECTOR)) {
        ring.classList.remove("hover");
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}
