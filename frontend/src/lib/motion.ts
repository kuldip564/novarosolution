export const ease = "cubic-bezier(0.16, 0.84, 0.36, 1)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function staggerDelay(index: number, step = 0.1): number {
  return index * step;
}
