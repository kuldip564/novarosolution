"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveals for the Work page. Elements marked `data-wk-reveal` that start below the
 * viewport are hidden after hydration and revealed once as they scroll in. Content is never
 * hidden in the server HTML, so it stays visible without JavaScript and never delays the
 * first paint. Under prefers-reduced-motion nothing is hidden at all.
 */
export function WorkMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = [...root.querySelectorAll<HTMLElement>("[data-wk-reveal]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.wkReveal = "in";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.02 },
    );

    for (const el of targets) {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.96) {
        el.dataset.wkReveal = "in";
        continue;
      }
      el.dataset.wkReveal = "pending";
      io.observe(el);
    }

    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
