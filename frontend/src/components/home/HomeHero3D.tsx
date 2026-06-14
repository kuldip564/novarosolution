"use client";

import { memo, useEffect, useRef } from "react";
import * as THREE from "three";
import { isMobileViewport } from "@/lib/device";
import { buildHomeHeroScene } from "@/lib/home-hero-scene";
import { useMotionSettings } from "@/lib/motion-provider";
import { getWebGLPixelRatio } from "@/lib/performance";
import { scrollStore } from "@/lib/scroll-store";

function HomeHero3DInner() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { performanceTier } = useMotionSettings();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const mobile = isMobileViewport();
    const sceneBundle = buildHomeHeroScene(performanceTier);
    const { scene, camera, group, dispose } = sceneBundle;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mobile,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(getWebGLPixelRatio());
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.className = "home-hero-3d__canvas";
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    });
    mount.appendChild(canvas);

    let time = 0;
    let frameId = 0;
    let tabVisible = document.visibilityState === "visible";
    const size = { w: 0, h: 0 };

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      size.w = w;
      size.h = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      if (tabVisible) animate();
    };

    const inner = group.userData.inner as THREE.Object3D | undefined;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!tabVisible || size.w === 0) return;

      time += mobile ? 0.008 : 0.012;
      group.rotation.y = time * 0.35 + scrollStore.mx * 0.6;
      group.rotation.x = scrollStore.my * 0.35 + Math.sin(time * 0.5) * 0.08;

      if (inner) {
        inner.rotation.y = -time * 0.8;
        inner.rotation.z = time * 0.25;
      }

      renderer.render(scene, camera);
    };

    document.addEventListener("visibilitychange", onVisibility);
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      dispose();
      renderer.dispose();
      if (canvas.parentElement === mount) {
        mount.removeChild(canvas);
      }
    };
  }, [performanceTier]);

  return <div className="home-hero-3d" ref={mountRef} aria-hidden="true" />;
}

export const HomeHero3D = memo(HomeHero3DInner);
