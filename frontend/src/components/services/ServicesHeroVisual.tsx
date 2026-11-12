"use client";

import { useRef } from "react";
import { useThreeHeroScene } from "@/lib/use-three-scene";

const loadScene = () => import("@/lib/services-hero-scene").then((mod) => mod.createServicesHeroScene);

/**
 * Hero visual for /services: four practices around one core. The CSS composition below is the
 * static version (phones, reduced motion, no WebGL, and the first paint everywhere). On capable
 * desktops the three.js scene replaces it after the page has loaded and gone idle.
 */
export function ServicesHeroVisual() {
  const hostRef = useRef<HTMLDivElement>(null);
  const live = useThreeHeroScene(hostRef, loadScene, "sv-hero__canvas");

  return (
    <div className={`st-hero__visual sv-hero__visual${live ? " is-live" : ""}`} aria-hidden="true">
      <div className="sv-orbit">
        <span className="sv-orbit__ring" />
        <span className="sv-orbit__ring sv-orbit__ring--outer" />
        <svg className="sv-orbit__spokes" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M50 50 L22 24 M50 50 L78 24 M50 50 L22 76 M50 50 L78 76" />
        </svg>
        <span className="sv-orbit__core" />
        <span className="sv-orbit__mod sv-orbit__mod--web">
          <i className="sv-g sv-g--bar" />
          <i className="sv-g sv-g--short" />
          <i className="sv-g sv-g--tile" />
          <i className="sv-g sv-g--tile sv-g--narrow" />
          <i className="sv-g sv-g--chip" />
        </span>
        <span className="sv-orbit__mod sv-orbit__mod--ai">
          <svg className="sv-g-net" viewBox="0 0 40 40">
            <path d="M20 4 L35 13 L35 27 L20 36 L5 27 L5 13 Z M20 4 L20 36 M5 13 L35 27 M35 13 L5 27" />
            <circle cx="20" cy="4" r="2.4" />
            <circle cx="35" cy="13" r="2.4" />
            <circle cx="35" cy="27" r="2.4" />
            <circle cx="20" cy="36" r="2.4" />
            <circle cx="5" cy="27" r="2.4" />
            <circle cx="5" cy="13" r="2.4" />
            <circle cx="20" cy="20" r="3" />
          </svg>
        </span>
        <span className="sv-orbit__mod sv-orbit__mod--growth">
          <i className="sv-g sv-g--col" style={{ ["--h" as string]: "34%" }} />
          <i className="sv-g sv-g--col" style={{ ["--h" as string]: "50%" }} />
          <i className="sv-g sv-g--col" style={{ ["--h" as string]: "42%" }} />
          <i className="sv-g sv-g--col" style={{ ["--h" as string]: "66%" }} />
          <i className="sv-g sv-g--col sv-g--hot" style={{ ["--h" as string]: "84%" }} />
        </span>
        <span className="sv-orbit__mod sv-orbit__mod--cloud">
          <i className="sv-g sv-g--rack" />
          <i className="sv-g sv-g--rack sv-g--rack-hot" />
          <i className="sv-g sv-g--rack" />
        </span>
      </div>
      <div ref={hostRef} className="sv-hero__stage" />
    </div>
  );
}
