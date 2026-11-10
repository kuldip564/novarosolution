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

let webglSupport: boolean | null = null;

/** True when the browser can create a WebGL context (GPU on, not blocklisted). */
export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as
      | WebGLRenderingContext
      | null;
    webglSupport = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/** WebGL off on phones, low-end devices, and browsers without WebGL. CSS mark still shows. */
export function shouldEnableWebGL(tier: PerformanceTier): boolean {
  if (tier === "low" || isMobileViewport()) return false;
  return supportsWebGL();
}

export function getWebGLPixelRatio(): number {
  if (typeof window === "undefined") return 1.5;
  const cap = isMobileViewport() ? 1.25 : 1.5;
  return Math.min(window.devicePixelRatio || 1, cap);
}
