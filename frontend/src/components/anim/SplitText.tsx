"use client";

import { useEffect, useRef } from "react";

type SplitTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.96 && rect.bottom > 0;
}

export function SplitText({ text, as: Tag = "h1", className = "" }: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = text.split("\n");

    el.innerHTML = lines
      .map(
        (line, lineIndex) =>
          `<span class="split-line" style="--line-i:${lineIndex}">${line
            .split(" ")
            .map(
              (word, wordIndex) =>
                `<span class="word-i" style="--word-i:${wordIndex}">${word}</span>`,
            )
            .join(" ")}</span>`,
      )
      .join("<br/>");

    if (reduced) {
      el.classList.add("in");
      return;
    }

    const reveal = () => el.classList.add("in");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px 8% 0px" },
    );

    io.observe(el);
    if (isInViewport(el)) reveal();
    requestAnimationFrame(() => {
      if (isInViewport(el)) reveal();
    });

    return () => io.disconnect();
  }, [text]);

  return (
    // @ts-expect-error dynamic tag ref
    <Tag ref={ref} className={`split-text ${className}`} data-split />
  );
}
