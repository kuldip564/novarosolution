"use client";

import { useRef } from "react";
import { useThreeHeroScene } from "@/lib/use-three-scene";

const loadScene = () => import("@/lib/work-hero-scene").then((mod) => mod.createWorkHeroScene);

/**
 * Hero visual for /work. The CSS composition below is the static version (phones, reduced
 * motion, no WebGL, and the first paint everywhere). On capable desktops the three.js scene
 * replaces it after the page has loaded and gone idle (see useThreeHeroScene).
 */
export function WorkHeroVisual() {
  const hostRef = useRef<HTMLDivElement>(null);
  const live = useThreeHeroScene(hostRef, loadScene, "wk-hero__canvas");

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
