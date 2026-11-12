"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useMotionSettings } from "@/lib/motion-provider";
import { getWebGLPixelRatio } from "@/lib/performance";
import { useAfterLoad } from "@/lib/use-after-load";

/**
 * Hero visual for /work. The CSS composition below is the static version (phones, reduced
 * motion, no WebGL, and the first paint everywhere). On capable desktops the three.js scene
 * replaces it after the page has loaded and gone idle. It renders only while the hero is on
 * screen and the tab is visible, and it is disposed on unmount or context loss.
 */
export function WorkHeroVisual() {
  const { ready, effectsEnabled, reducedMotion, performanceTier } = useMotionSettings();
  const enabled = ready && effectsEnabled && !reducedMotion;
  const start = useAfterLoad(enabled, 250);
  const { resolvedTheme } = useTheme();
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!start) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    import("@/lib/work-hero-scene").then(({ createWorkHeroScene }) => {
      if (cancelled) return;
      const rect = host.getBoundingClientRect();
      const scene = createWorkHeroScene({
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
        theme: resolvedTheme === "dark" ? "dark" : "light",
        quality: performanceTier === "high" ? "high" : "medium",
        pixelRatio: Math.min(getWebGLPixelRatio(), 1.75),
      });
      if (!scene) return;

      const { canvas } = scene;
      canvas.className = "wk-hero__canvas";
      host.appendChild(canvas);

      let frame = 0;
      let onScreen = true;
      let disposing = false;
      const visible = () => document.visibilityState === "visible";

      const loop = (time: number) => {
        frame = 0;
        if (!onScreen || !visible()) return;
        scene.render(time);
        frame = requestAnimationFrame(loop);
      };
      const wake = () => {
        if (!frame && onScreen && visible()) frame = requestAnimationFrame(loop);
      };

      // First frame, then reveal the canvas over the CSS version.
      scene.render(performance.now());
      setLive(true);
      wake();

      const io = new IntersectionObserver(
        ([entry]) => {
          onScreen = Boolean(entry?.isIntersecting);
          wake();
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
      });
      ro.observe(host);

      const onPointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        scene.setPointer(event.clientX / window.innerWidth - 0.5, event.clientY / window.innerHeight - 0.5);
      };
      const onScroll = () => scene.setScroll(window.scrollY / heroHeight);
      const onVisibility = () => wake();
      const onContextLost = (event: Event) => {
        event.preventDefault();
        if (disposing) return;
        // Fall back to the CSS composition; don't try to rebuild mid-session.
        cancelAnimationFrame(frame);
        frame = 0;
        onScreen = false;
        setLive(false);
      };

      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      canvas.addEventListener("webglcontextlost", onContextLost);
      onScroll();

      teardown = () => {
        disposing = true;
        cancelAnimationFrame(frame);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVisibility);
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
  }, [start, resolvedTheme, performanceTier]);

  return (
    <div className={`wk-hero__visual${live ? " is-live" : ""}`} aria-hidden="true">
      <div className="wk-art">
        <span className="wk-art__ring" />
        <span className="wk-art__panel wk-art__panel--a">
          <i className="wk-art__bar wk-art__bar--strong" />
          <i className="wk-art__bar wk-art__bar--short" />
          <i className="wk-art__tile" />
          <i className="wk-art__tile wk-art__tile--narrow" />
          <i className="wk-art__bar" />
          <i className="wk-art__chip" />
        </span>
        <span className="wk-art__panel wk-art__panel--b">
          <i className="wk-art__row" />
          <i className="wk-art__row" />
          <i className="wk-art__row" />
        </span>
        <span className="wk-art__panel wk-art__panel--c">
          <i className="wk-art__chart" />
        </span>
        <span className="wk-art__panel wk-art__panel--d" />
        <span className="wk-art__panel wk-art__panel--e" />
        <svg className="wk-art__links" viewBox="0 0 400 400" preserveAspectRatio="none">
          <path d="M120 70 L300 120 M300 120 L330 300 M90 300 L230 340 M120 70 L90 300" />
          <circle cx="120" cy="70" r="3.5" />
          <circle cx="300" cy="120" r="3.5" />
          <circle cx="330" cy="300" r="3.5" />
          <circle cx="90" cy="300" r="3.5" />
          <circle cx="230" cy="340" r="3.5" />
        </svg>
      </div>
      <div ref={hostRef} className="wk-hero__stage" />
    </div>
  );
}
