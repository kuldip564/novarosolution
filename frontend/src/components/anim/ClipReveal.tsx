"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ClipRevealProps = {
  children: ReactNode;
  className?: string;
};

export function ClipReveal({ children, className = "" }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.classList.add("in");
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      reveal();
      return;
    }

    const checkVisible = () => {
      const rect = el.getBoundingClientRect();
      if (rect.height <= 0) return;
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        reveal();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 5% 0px" },
    );

    io.observe(el);
    requestAnimationFrame(checkVisible);
    requestAnimationFrame(() => requestAnimationFrame(checkVisible));

    const images = el.querySelectorAll("img");
    images.forEach((img) => {
      if (img.complete) checkVisible();
      else img.addEventListener("load", checkVisible, { once: true });
    });

    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`clip-reveal ${className}`.trim()} data-clip>
      {children}
    </div>
  );
}
