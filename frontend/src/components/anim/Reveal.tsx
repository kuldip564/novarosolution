"use client";

import { useEffect, useRef, type ReactNode } from "react";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
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
  }, []);

  const style = delay ? ({ ["--reveal-delay" as string]: `${delay}s` } as React.CSSProperties) : undefined;

  return (
    // @ts-expect-error dynamic tag ref
    <Tag ref={ref} className={`reveal ${className}`} style={style} data-reveal>
      {children}
    </Tag>
  );
}
