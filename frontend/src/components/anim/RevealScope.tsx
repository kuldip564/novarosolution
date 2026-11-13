"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealScopeProps = {
  children: ReactNode;
  className?: string;
  /** Attribute that marks revealable elements, e.g. "data-hm-reveal". Its value becomes "pending" / "in". */
  attribute: `data-${string}`;
};

/**
 * Scroll reveals for a page scope. Elements carrying `attribute` that start below the viewport
 * are hidden after hydration and revealed once as they scroll in. Nothing is hidden in the
 * server HTML (so content shows without JavaScript and never delays the first paint), and
 * nothing is hidden under prefers-reduced-motion.
 */
export function RevealScope({ children, className, attribute }: RevealScopeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = [...root.querySelectorAll<HTMLElement>(`[${attribute}]`)];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute(attribute, "in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.02 },
    );

    for (const el of targets) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.96) {
        el.setAttribute(attribute, "in");
        continue;
      }
      el.setAttribute(attribute, "pending");
      io.observe(el);
    }

    return () => io.disconnect();
  }, [attribute]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
