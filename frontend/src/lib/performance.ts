import { isCoarsePointer, isLowEndDevice, isMobileViewport, prefersReducedMotion } from "./device";

export type PerformanceTier = "high" | "medium" | "low";

export type ParticleCounts = {
  particleCount: number;
  starCount: number;
};

export function getPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined") return "high";
  if (prefersReducedMotion()) return "low";
  if (isLowEndDevice() || isCoarsePointer()) return "low";

  const cores = navigator.hardwareConcurrency ?? 8;
  if (cores <= 4 || isMobileViewport()) return "medium";
  return "high";
}

export function getParticleCounts(tier: PerformanceTier): ParticleCounts {
  if (tier === "low") {
    return { particleCount: 0, starCount: 0 };
  }

  const mobile = isMobileViewport();

  if (tier === "medium") {
    return mobile
      ? { particleCount: 280, starCount: 100 }
      : { particleCount: 700, starCount: 280 };
  }

  return mobile
    ? { particleCount: 500, starCount: 200 }
    : { particleCount: 1400, starCount: 600 };
}

export function shouldEnableWebGL(tier: PerformanceTier): boolean {
  if (isMobileViewport() || isCoarsePointer()) return false;
  return tier !== "low";
}
