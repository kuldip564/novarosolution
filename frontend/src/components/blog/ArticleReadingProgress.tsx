"use client";

import { useEffect, useRef } from "react";
import { useMotionSettings } from "@/lib/motion-provider";
import { subscribeScroll } from "@/lib/scroll-store";

export function ArticleReadingProgress() {
  const { reducedMotion } = useMotionSettings();
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update(scrollY: number) {
      const fill = fillRef.current;
      if (!fill) return;

      const article = document.querySelector<HTMLElement>(".article-body");
      if (!article) return;

      const total = article.scrollHeight - window.innerHeight;
      const scrolled = scrollY - (article.offsetTop - 96);
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      fill.style.transform = `scaleX(${pct / 100})`;
    }

    return subscribeScroll(update);
  }, []);

  return (
    <div className="article-progress" aria-hidden="true">
      <div
        ref={fillRef}
        style={{
          transform: "scaleX(0)",
          opacity: reducedMotion ? 0.85 : 1,
        }}
      />
    </div>
  );
}
