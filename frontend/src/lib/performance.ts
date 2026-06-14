import { isLowEndDevice, isMobileViewport, prefersReducedMotion } from "./device";

export type PerformanceTier = "high" | "medium" | "low";

export type ParticleCounts = {
  particleCount: number;
  starCount: number;
};

export function getPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined") return "high";
  if (prefersReducedMotion()) return "low";
  if (isLowEndDevice()) return "low";

  const cores = navigator.hardwareConcurrency ?? 8;
  if (isMobileViewport() || cores <= 4) return "medium";
  return "high";
}

export function getParticleCounts(tier: PerformanceTier): ParticleCounts {
  if (tier === "low") {
    return { particleCount: 0, starCount: 0 };
  }

  const mobile = isMobileViewport();

  if (tier === "medium") {
    return mobile
      ? { particleCount: 320, starCount: 120 }
      : { particleCount: 700, starCount: 280 };
  }

  return mobile
    ? { particleCount: 500, starCount: 200 }
    : { particleCount: 1400, starCount: 600 };
}

/** WebGL runs on mobile with a reduced particle budget; off only for reduced motion / low-end. */
export function shouldEnableWebGL(tier: PerformanceTier): boolean {
  return tier !== "low";
}

export function getWebGLPixelRatio(): number {
  if (typeof window === "undefined") return 1.5;
  const cap = isMobileViewport() ? 1.25 : 1.5;
  return Math.min(window.devicePixelRatio || 1, cap);
}
