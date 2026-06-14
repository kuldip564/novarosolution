"use client";

import { useEffect, useRef } from "react";
import { useMotionSettings } from "@/lib/motion-provider";
import { subscribeScroll } from "@/lib/scroll-store";

export function ScrollProgressBar() {
  const { reducedMotion } = useMotionSettings();
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    function update(scrollY: number) {
      const fill = fillRef.current;
      const bar = barRef.current;
      if (!fill || !bar) return;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (scrollY / max) * 100)) : 0;
      fill.style.transform = `scaleX(${pct / 100})`;
      bar.setAttribute("aria-valuenow", String(Math.round(pct)));
    }

    return subscribeScroll(update);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={barRef}
      className="scroll-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-label="Page scroll progress"
    >
      <div ref={fillRef} className="scroll-progress-fill" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
