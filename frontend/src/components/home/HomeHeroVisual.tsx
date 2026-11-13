"use client";

import { useRef } from "react";
import { useThreeHeroScene } from "@/lib/use-three-scene";

const loadScene = () => import("@/lib/home-sculpture-scene").then((mod) => mod.createHomeSculptureScene);

const SLABS = 8;

/**
 * Homepage hero sculpture. The CSS spire is the static version (phones, reduced motion, no
 * WebGL, and first paint everywhere); capable desktops swap in the three.js sculpture once the
 * page is loaded and idle. The headline and buttons never wait for it.
 */
export function HomeHeroVisual() {
  const hostRef = useRef<HTMLDivElement>(null);
  const live = useThreeHeroScene(hostRef, loadScene, "hm-hero__canvas");

  return (
    <div className={`hm-hero__visual${live ? " is-live" : ""}`} aria-hidden="true">
      <div className="hm-spire">
        <span className="hm-spire__ring" />
        <span className="hm-spire__ring hm-spire__ring--outer" />
        <span className="hm-spire__core" />
        {Array.from({ length: SLABS }, (_, index) => (
          <span key={index} className="hm-spire__slab" style={{ ["--i" as string]: index }} />
        ))}
        <span className="hm-spire__node hm-spire__node--a" />
        <span className="hm-spire__node hm-spire__node--b" />
        <span className="hm-spire__node hm-spire__node--c" />
      </div>
      <div ref={hostRef} className="hm-hero__stage" />
    </div>
  );
}
