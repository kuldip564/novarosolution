import { useTransform, type MotionValue } from "framer-motion";

/** Scroll-driven opacity for stacked pinned scenes — one step visible at a time. */
export function usePinnedSceneOpacity(
  progress: MotionValue<number>,
  index: number,
  total: number,
) {
  return useTransform(progress, (value) => {
    const segment = 1 / total;
    const start = index * segment;
    const end = start + segment;

    if (value < start || value >= end) {
      return index === 0 && value <= start ? 1 : 0;
    }

    const local = (value - start) / segment;
    const fade = 0.14;

    if (local < fade) {
      if (index === 0 && value <= start + segment * 0.001) return 1;
      return local / fade;
    }

    if (local > 1 - fade) {
      return (1 - local) / fade;
    }

    return 1;
  });
}

export function usePinnedSceneVisibility(opacity: MotionValue<number>) {
  return useTransform(opacity, (value) => (value > 0.02 ? "visible" : "hidden"));
}

export function usePinnedSceneZIndex(
  progress: MotionValue<number>,
  index: number,
  total: number,
) {
  return useTransform(progress, (value) => {
    const active = Math.min(
      total - 1,
      Math.max(0, Math.floor(value * total + Number.EPSILON)),
    );
    return index === active ? 3 : 1;
  });
}
