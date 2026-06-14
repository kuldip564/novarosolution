"use client";

import type Lenis from "lenis";

export function scrollToTarget(
  target: string | HTMLElement,
  lenis?: Lenis | null,
  offset = -96,
): void {
  const el =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;

  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.1 });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
