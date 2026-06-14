"use client";

import { createElement, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/device";
import { useMotionSettings } from "@/lib/motion-provider";

type SplitTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.96 && rect.bottom > 0;
}

/** SSR-visible headline text; upgraded to word spans before first paint for animation. */
export function SplitText({ text, as: Tag = "h1", className = "" }: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotionSettings();
  const skipMotion = reducedMotion || prefersReducedMotion();
  const lines = text.split("\n");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.innerHTML = lines
      .map(
        (line, lineIndex) =>
          `<span class="split-line" style="--line-i:${lineIndex}">${line
            .split(" ")
            .filter(Boolean)
            .map(
              (word, wordIndex) =>
                `<span class="word-i" style="--word-i:${wordIndex}">${escapeHtml(word)}</span>`,
            )
            .join(" ")}</span>`,
      )
      .join("<br/>");

    if (skipMotion) {
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

    return () => io.disconnect();
  }, [lines, skipMotion, text]);

  return createElement(
    Tag,
    {
      ref,
      className: `split-text ${skipMotion ? "in" : ""} ${className}`.trim(),
      "data-split": true,
      suppressHydrationWarning: true,
    },
    lines.map((line, lineIndex) =>
      createElement(
        "span",
        { key: `${lineIndex}-${line}`, className: "split-line" },
        line,
        lineIndex < lines.length - 1 ? createElement("br") : null,
      ),
    ),
  );
}
