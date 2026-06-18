"use client";

import { useScroll, type UseScrollOptions } from "framer-motion";
import { useCallback, useRef, useState, type RefCallback } from "react";

type UseHydratedScrollOptions = Omit<UseScrollOptions, "target"> & {
  enabled?: boolean;
};

/**
 * useScroll wrapper that waits until the target ref is mounted.
 * Prevents "Target ref is defined but not hydrated" with Next.js + Lenis.
 */
export function useHydratedScroll(options: UseHydratedScrollOptions = {}) {
  const { enabled = true, ...scrollOptions } = options;
  const targetRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const ref: RefCallback<HTMLElement> = useCallback((node) => {
    targetRef.current = node;
    setMounted(node !== null);
  }, []);

  const scroll = useScroll({
    ...scrollOptions,
    ...(mounted && enabled ? { target: targetRef } : {}),
  });

  return { ref, ...scroll };
}
