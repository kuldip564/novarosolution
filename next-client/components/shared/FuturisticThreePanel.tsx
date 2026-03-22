'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function FuturisticThreePanel() {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMode, setSpeedMode] = useState<'normal' | 'fast'>('normal');
  const [interactionEnabled, setInteractionEnabled] = useState(true);
  const pausedRef = useRef(false);
  const speedRef = useRef<'normal' | 'fast'>('normal');
  const interactionRef = useRef(true);
  const visibleRef = useRef(false);
  const resetRef = useRef(false);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    speedRef.current = speedMode;
  }, [speedMode]);

  useEffect(() => {
    interactionRef.current = interactionEnabled;
  }, [interactionEnabled]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        visibleRef.current = Boolean(entry?.isIntersecting);
        if (entry?.isIntersecting) {
          setHasLoaded(true);
        }
      },
      { threshold: 0.08, rootMargin: '120px' }
    );
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const lightA = new THREE.PointLight('#93c5fd', 1.05, 18);
    lightA.position.set(2.8, 2.2, 2.5);
    const lightB = new THREE.PointLight('#f0abfc', 0.95, 18);
    lightB.position.set(-2.6, -2.4, 2.2);
    scene.add(lightA, lightB);

    const cluster = new THREE.Group();
    scene.add(cluster);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.05, 1),
      new THREE.MeshStandardMaterial({
        color: '#60a5fa',
        emissive: '#1e1b4b',
        emissiveIntensity: 0.66,
        roughness: 0.24,
        metalness: 0.8
      })
    );
    cluster.add(core);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.42, 0),
      new THREE.MeshBasicMaterial({
        color: '#22d3ee',
        wireframe: true,
        transparent: true,
        opacity: 0.38
      })
    );
    cluster.add(shell);

    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.028, 16, 110),
      new THREE.MeshBasicMaterial({
        color: '#c084fc',
        transparent: true,
        opacity: 0.62
      })
    );
    orbit.rotation.set(Math.PI * 0.38, Math.PI * 0.18, 0);
    cluster.add(orbit);

    const sparkGeometry = new THREE.BufferGeometry();
    const sparkCount = 260;
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i += 1) {
      const i3 = i * 3;
      sparkPositions[i3] = (Math.random() - 0.5) * 7.5;
      sparkPositions[i3 + 1] = (Math.random() - 0.5) * 4;
      sparkPositions[i3 + 2] = (Math.random() - 0.5) * 7.5;
    }
    sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparks = new THREE.Points(
      sparkGeometry,
      new THREE.PointsMaterial({
        color: '#93c5fd',
        size: 0.03,
        transparent: true,
        opacity: 0.68,
        depthWrite: false
      })
    );
    scene.add(sparks);

    let pointerX = 0;
    let pointerY = 0;
    let pointerClientX = 0;
    let pointerClientY = 0;
    let pointerRaf = 0;
    let hostRect = host.getBoundingClientRect();

    const updateHostRect = () => {
      hostRect = host.getBoundingClientRect();
    };

    const applyPointer = () => {
      pointerRaf = 0;
      pointerX = ((pointerClientX - hostRect.left) / Math.max(hostRect.width, 1) - 0.5) * 2;
      pointerY = -((pointerClientY - hostRect.top) / Math.max(hostRect.height, 1) - 0.5) * 2;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!interactionRef.current) return;
      pointerClientX = event.clientX;
      pointerClientY = event.clientY;
      if (pointerRaf) return;
      pointerRaf = window.requestAnimationFrame(applyPointer);
    };

    const onResize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateHostRect();
    };

    host.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', updateHostRect, { passive: true });
    onResize();

    let frame = 0;
    let lastFrameTime = performance.now();
    let elapsed = 0;
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
      lastFrameTime = now;
      elapsed += dt;
      const t = elapsed;
      const speedMultiplier = speedRef.current === 'fast' ? 1.8 : 1;

      if (resetRef.current) {
        cluster.rotation.x *= 0.88;
        cluster.rotation.y *= 0.88;
        cluster.rotation.z *= 0.88;
        cluster.position.x *= 0.84;
        cluster.position.y *= 0.84;
        pointerX *= 0.6;
        pointerY *= 0.6;
        if (Math.abs(cluster.rotation.x) < 0.005 && Math.abs(cluster.rotation.y) < 0.005 && Math.abs(cluster.rotation.z) < 0.005) {
          resetRef.current = false;
        }
      }

      if (!pausedRef.current && visibleRef.current) {
        cluster.rotation.y += 0.006 * speedMultiplier;
        cluster.rotation.x += (0.001 + pointerY * 0.0018) * speedMultiplier;
        cluster.rotation.z = Math.sin(t * 0.7 * speedMultiplier) * 0.12 + pointerX * 0.2;
        shell.rotation.y -= 0.003 * speedMultiplier;
        orbit.rotation.z += 0.004 * speedMultiplier;
        sparks.rotation.y += 0.0008 * speedMultiplier;
      }

      cluster.position.x += (pointerX * 0.24 - cluster.position.x) * 0.08;
      cluster.position.y += (pointerY * 0.18 - cluster.position.y) * 0.08;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.cancelAnimationFrame(frame);
      if (pointerRaf) {
        window.cancelAnimationFrame(pointerRaf);
      }
      host.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', updateHostRect);
      renderer.dispose();
      renderer.forceContextLoss();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      shell.geometry.dispose();
      (shell.material as THREE.Material).dispose();
      orbit.geometry.dispose();
      (orbit.material as THREE.Material).dispose();
      sparkGeometry.dispose();
      (sparks.material as THREE.Material).dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [hasLoaded]);

  return (
    <div ref={shellRef} className="future-panel-shell">
      <div ref={hostRef} className="future-panel-canvas" aria-hidden="true" />
      <div className="future-panel-controls">
        <button
          type="button"
          className="future-control-btn"
          onClick={() => setIsPaused((prev) => !prev)}
        >
          {isPaused ? 'Play' : 'Pause'}
        </button>
        <button
          type="button"
          className="future-control-btn"
          onClick={() => setSpeedMode((prev) => (prev === 'normal' ? 'fast' : 'normal'))}
        >
          {speedMode === 'normal' ? 'Speed x1' : 'Speed x1.8'}
        </button>
        <button
          type="button"
          className="future-control-btn"
          onClick={() => setInteractionEnabled((prev) => !prev)}
        >
          {interactionEnabled ? 'Pointer On' : 'Pointer Off'}
        </button>
        <button
          type="button"
          className="future-control-btn"
          onClick={() => {
            resetRef.current = true;
            setIsPaused(false);
          }}
        >
          Reset View
        </button>
      </div>
    </div>
  );
}

