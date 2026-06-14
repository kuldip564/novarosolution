"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/device";
import { useMotionSettings } from "@/lib/motion-provider";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof HTMLElementTagNameMap;
};

function revealElement(el: HTMLElement) {
  el.classList.add("in");
}

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.96 && rect.bottom > 0;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotionSettings();
  const skipMotion = reducedMotion || prefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (skipMotion) {
      revealElement(el);
      return;
    }

    const checkVisible = () => {
      if (isInViewport(el)) revealElement(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target as HTMLElement);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px 8% 0px" },
    );

    io.observe(el);
    checkVisible();
    requestAnimationFrame(checkVisible);
    requestAnimationFrame(() => requestAnimationFrame(checkVisible));

    return () => io.disconnect();
  }, [skipMotion]);

  const style = delay ? ({ ["--reveal-delay" as string]: `${delay}s` } as React.CSSProperties) : undefined;

  return (
    // @ts-expect-error dynamic tag ref
    <Tag ref={ref} className={`reveal ${skipMotion ? "in" : ""} ${className}`.trim()} style={style} data-reveal>
      {children}
    </Tag>
  );
}
