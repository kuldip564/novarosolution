"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useMotionSettings } from "./motion-provider";
import { getWebGLPixelRatio } from "./performance";
import { useAfterLoad } from "./use-after-load";

/** What a hero scene module returns. It draws one frame per render() call. */
export type ThreeHeroScene = {
  canvas: HTMLCanvasElement;
  render: (timeMs: number) => void;
  /** Pointer over the window, each axis -0.5…0.5. */
  setPointer: (x: number, y: number) => void;
  /** How far the hero has scrolled out of view, 0…1. */
  setScroll: (progress: number) => void;
  resize: (width: number, height: number) => void;
  /** Starts (fn) or stops (null) the renderer's own animation loop. */
  setAnimationLoop: (fn: ((time: number) => void) | null) => void;
  dispose: () => void;
};

export type ThreeHeroSceneOptions = {
  width: number;
  height: number;
  theme: "light" | "dark";
  quality: "high" | "medium";
  pixelRatio: number;
};

type Loader = () => Promise<(options: ThreeHeroSceneOptions) => ThreeHeroScene | null>;

/**
 * Shared lifecycle for the decorative hero scenes (home and Work pages).
 *
 * - Runs only on capable desktops (effects on, GPU, no reduced motion), after the page has
 *   loaded and gone idle; the scene module itself is code-split and loaded on demand.
 * - Draws only while the host is on screen and the tab is visible (setAnimationLoop on/off).
 * - Falls back to the caller's CSS version on WebGL failure or context loss.
 * - Disposes geometries, materials, textures and the renderer, and removes every listener.
 *
 * Returns `live`: true once the canvas has drawn its first frame.
 */
export function useThreeHeroScene(hostRef: RefObject<HTMLElement | null>, load: Loader, className: string): boolean {
  const { ready, effectsEnabled, reducedMotion, performanceTier } = useMotionSettings();
  const enabled = ready && effectsEnabled && !reducedMotion;
  const start = useAfterLoad(enabled, 250);
  const { resolvedTheme } = useTheme();
  const [live, setLive] = useState(false);
  const loadRef = useRef(load);

  useEffect(() => {
    if (!start) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    loadRef.current().then((create) => {
      if (cancelled) return;
      const rect = host.getBoundingClientRect();
      const scene = create({
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
        theme: resolvedTheme === "dark" ? "dark" : "light",
        quality: performanceTier === "high" ? "high" : "medium",
        pixelRatio: Math.min(getWebGLPixelRatio(), 1.75),
      });
      if (!scene) return;

      const { canvas } = scene;
      canvas.className = className;
      host.appendChild(canvas);

      let onScreen = true;
      let running = false;
      let disposing = false;
      const sync = () => {
        const shouldRun = onScreen && document.visibilityState === "visible";
        if (shouldRun === running) return;
        running = shouldRun;
        scene.setAnimationLoop(shouldRun ? (time) => scene.render(time) : null);
      };

      scene.render(performance.now());
      setLive(true);
      sync();

      const io = new IntersectionObserver(
        ([entry]) => {
          onScreen = Boolean(entry?.isIntersecting);
          sync();
        },
        { rootMargin: "80px 0px" },
      );
      io.observe(host);

      // Hero height is cached on resize, so the scroll handler never reads layout.
      let heroHeight = host.parentElement?.getBoundingClientRect().height || window.innerHeight;
      const ro = new ResizeObserver(([entry]) => {
        if (!entry) return;
        scene.resize(entry.contentRect.width, entry.contentRect.height);
        heroHeight = host.parentElement?.getBoundingClientRect().height || window.innerHeight;
        if (!running) scene.render(performance.now());
      });
      ro.observe(host);

      const onPointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        scene.setPointer(event.clientX / window.innerWidth - 0.5, event.clientY / window.innerHeight - 0.5);
      };
      const onScroll = () => scene.setScroll(window.scrollY / heroHeight);
      const onContextLost = (event: Event) => {
        event.preventDefault();
        if (disposing) return;
        // Keep the CSS version; don't rebuild mid-session.
        onScreen = false;
        sync();
        setLive(false);
      };

      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", sync);
      canvas.addEventListener("webglcontextlost", onContextLost);
      onScroll();

      teardown = () => {
        disposing = true;
        scene.setAnimationLoop(null);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", sync);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        scene.dispose();
        canvas.remove();
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
      setLive(false);
    };
  }, [start, resolvedTheme, performanceTier, hostRef, className]);

  return live;
}
