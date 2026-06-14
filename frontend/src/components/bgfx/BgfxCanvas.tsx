"use client";

import { useTheme } from "next-themes";
import { memo, useEffect, useRef } from "react";
import * as THREE from "three";
import { createParticleGeometries } from "@/lib/particle-geometries";
import { isMobileViewport } from "@/lib/device";
import { useMotionSettings } from "@/lib/motion-provider";
import { getParticleCounts, getWebGLPixelRatio } from "@/lib/performance";
import { scrollStore } from "@/lib/scroll-store";

function BgfxCanvasInner() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const { performanceTier } = useMotionSettings();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const counts = getParticleCounts(performanceTier);
    if (counts.particleCount === 0) return;
    const isLight = resolvedTheme === "light";
    const mobile = isMobileViewport();

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(
      isLight ? 0xffffff : 0x05080f,
      isLight ? 0.035 : 0.055,
    );

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mobile,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(getWebGLPixelRatio());
    renderer.setSize(window.innerWidth, window.innerHeight);
    Object.assign(renderer.domElement.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
    });
    mount.appendChild(renderer.domElement);

    const [pointsGeometry, starsGeometry] = createParticleGeometries(
      counts.particleCount,
      counts.starCount,
      isLight ? "light" : "dark",
    );

    const points = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({
        size: isLight ? 0.08 : 0.09,
        vertexColors: true,
        transparent: true,
        opacity: isLight ? 0.38 : 0.9,
        depthWrite: false,
        blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      }),
    );

    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({
        size: 0.05,
        color: isLight ? 0x2563eb : 0x9fd8ff,
        transparent: true,
        opacity: isLight ? 0.28 : 0.5,
        blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
      }),
    );

    scene.add(points, stars);

    let time = 0;
    const cameraTarget = { x: 0, y: 0, z: 16 };
    let tabVisible = document.visibilityState === "visible";
    let frameId = 0;

    const onMouseMove = (event: MouseEvent) => {
      scrollStore.mx = event.clientX / window.innerWidth - 0.5;
      scrollStore.my = event.clientY / window.innerHeight - 0.5;
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      scrollStore.mx = touch.clientX / window.innerWidth - 0.5;
      scrollStore.my = touch.clientY / window.innerHeight - 0.5;
    };

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      if (tabVisible) animate();
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!tabVisible) return;

      time += mobile ? 0.0012 : 0.0016;
      const sy = scrollStore.y;

      points.rotation.y = time + sy * 0.0009;
      points.rotation.x = time * 0.5;
      stars.rotation.y = -time * 0.4;

      cameraTarget.x += (scrollStore.mx * 3 - cameraTarget.x) * 0.04;
      cameraTarget.y += (-scrollStore.my * 3 - cameraTarget.y) * 0.04;
      cameraTarget.z = 16 - Math.min(sy * 0.004, 6);

      camera.position.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      pointsGeometry.dispose();
      starsGeometry.dispose();
      (points.material as THREE.Material).dispose();
      (stars.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [resolvedTheme, performanceTier]);

  return <div id="bgfx" ref={mountRef} aria-hidden="true" />;
}

export const BgfxCanvas = memo(BgfxCanvasInner);
