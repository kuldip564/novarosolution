"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { isMobileViewport } from "@/lib/device";
import { buildHomeBgScene } from "@/lib/home-bg-scene";
import { useMotionSettings } from "@/lib/motion-provider";
import { getWebGLPixelRatio } from "@/lib/performance";
import { scrollStore } from "@/lib/scroll-store";

function SiteBackground3DInner() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const { effectsEnabled, performanceTier, ready } = useMotionSettings();
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    if (!ready || !effectsEnabled) return;

    document.documentElement.classList.add("site--bg-3d");

    return () => {
      document.documentElement.classList.remove("site--bg-3d");
    };
  }, [ready, effectsEnabled]);

  useEffect(() => {
    if (!ready || !effectsEnabled) return;

    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    const start = () => {
      if (cancelled) return;

      const sceneBundle = buildHomeBgScene(
        performanceTier,
        resolvedTheme === "light" ? "light" : "dark",
      );
      if (!sceneBundle) return;

      const mobile = isMobileViewport();
      const { scene, camera, animatables, dispose } = sceneBundle;
      const { points, stars, shapes } = animatables;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !mobile,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(getWebGLPixelRatio());
      renderer.setClearColor(0x000000, 0);

      const canvas = renderer.domElement;
      canvas.className = "site-bg-3d__canvas";
      mount.appendChild(canvas);
      setWebglReady(true);

      let time = 0;
      let frameId = 0;
      let tabVisible = document.visibilityState === "visible";
      const cameraTarget = { x: 0, y: 0, z: 16 };

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

        time += mobile ? 0.001 : 0.0014;
        const sy = scrollStore.y;

        points.rotation.y = time + sy * 0.0008;
        points.rotation.x = time * 0.45;
        stars.rotation.y = -time * 0.35;

        shapes.forEach((shape, index) => {
          const baseY = (shape.userData.baseY as number | undefined) ?? shape.position.y;
          shape.rotation.y = time * (0.18 + index * 0.04) + scrollStore.mx * 0.25;
          shape.rotation.x = time * 0.12 + scrollStore.my * 0.18;
          shape.position.y = baseY + Math.sin(time * 1.4 + index) * 0.35;
        });

        cameraTarget.x += (scrollStore.mx * 2.8 - cameraTarget.x) * 0.035;
        cameraTarget.y += (-scrollStore.my * 2.8 - cameraTarget.y) * 0.035;
        cameraTarget.z = 16 - Math.min(sy * 0.0035, 5);

        camera.position.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("resize", onResize);
      onResize();
      animate();

      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", onResize);
        dispose();
        renderer.dispose();
        if (canvas.parentElement === mount) {
          mount.removeChild(canvas);
        }
        setWebglReady(false);
      };
    };

    const delayMs = isMobileViewport() ? 80 : 180;
    let cleanup: (() => void) | undefined;

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(
        () => {
          cleanup = start();
        },
        { timeout: delayMs },
      );
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
        cleanup?.();
      };
    }

    const timer = window.setTimeout(() => {
      cleanup = start();
    }, delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      cleanup?.();
    };
  }, [ready, effectsEnabled, performanceTier, resolvedTheme]);

  if (!ready || !effectsEnabled) return null;

  return (
    <div
      className={`site-bg-3d${webglReady ? " site-bg-3d--active" : ""}`}
      ref={mountRef}
      aria-hidden="true"
    >
      <div className="site-bg-3d__ink" />
    </div>
  );
}

export const SiteBackground3D = memo(SiteBackground3DInner);
