"use client";

import { useEffect, useRef } from "react";

type CounterProps = {
  value: number;
  suffix?: string;
  className?: string;
};

/**
 * Renders the real number in the HTML (for crawlers, link previews, and no-JS visitors),
 * then counts up from zero only when the counter scrolls into view from below.
 * Counters already on screen at load keep their final value — no 0 → N flash.
 */
export function Counter({ value, suffix = "", className = "" }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const final = `${value}${suffix}`;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = el.getBoundingClientRect();
    const visibleNow = rect.top < window.innerHeight && rect.bottom > 0;
    if (reduced || visibleNow || typeof IntersectionObserver === "undefined") {
      el.textContent = final;
      return;
    }

    el.textContent = `0${suffix}`;
    let frame = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);

          const start = performance.now();
          const duration = 1400;

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = `${Math.round(eased * value)}${suffix}`;
            if (progress < 1) frame = requestAnimationFrame(tick);
          };

          frame = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = final;
    };
  }, [value, suffix]);

  return (
    <div ref={ref} className={className} data-count={value} data-suffix={suffix}>
      {value}
      {suffix}
    </div>
  );
}
