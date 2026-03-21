'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type AboutNebulaSceneProps = {
  intensity?: 'soft' | 'bold';
};

export default function AboutNebulaScene({ intensity = 'soft' }: AboutNebulaSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#020617', intensity === 'bold' ? 0.07 : 0.1);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const lightA = new THREE.PointLight('#60a5fa', 1.1, 22);
    lightA.position.set(2.4, 2.6, 2.5);
    const lightB = new THREE.PointLight('#f472b6', 0.95, 20);
    lightB.position.set(-2.2, -1.8, 2.2);
    scene.add(ambient, lightA, lightB);

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.1, 1),
      new THREE.MeshStandardMaterial({
        color: '#7dd3fc',
        emissive: '#172554',
        emissiveIntensity: 0.72,
        roughness: 0.24,
        metalness: 0.78
      })
    );
    coreGroup.add(crystal);

    const crystalShell = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.58, 0),
      new THREE.MeshBasicMaterial({
        color: '#22d3ee',
        wireframe: true,
        transparent: true,
        opacity: 0.42
      })
    );
    coreGroup.add(crystalShell);

    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(1.72, 0.025, 16, 130),
      new THREE.MeshBasicMaterial({ color: '#a78bfa', transparent: true, opacity: 0.64 })
    );
    ringA.rotation.set(Math.PI * 0.42, Math.PI * 0.14, 0);
    coreGroup.add(ringA);

    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(1.34, 0.02, 16, 110),
      new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.5 })
    );
    ringB.rotation.set(Math.PI * 0.1, Math.PI * 0.72, Math.PI * 0.18);
    coreGroup.add(ringB);

    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = intensity === 'bold' ? 520 : 320;
    const dust = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      const i3 = i * 3;
      const radius = 3.4 + Math.random() * 4.8;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.6;
      dust[i3] = Math.cos(theta) * radius;
      dust[i3 + 1] = y;
      dust[i3 + 2] = Math.sin(theta) * radius;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dust, 3));
    const dustPoints = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: '#93c5fd',
        size: intensity === 'bold' ? 0.028 : 0.024,
        transparent: true,
        opacity: 0.72,
        depthWrite: false
      })
    );
    scene.add(dustPoints);

    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      pointerY = -((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    };

    const onResize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    host.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('resize', onResize);
    onResize();

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      const speed = intensity === 'bold' ? 1.4 : 1;

      coreGroup.rotation.y += 0.0045 * speed;
      coreGroup.rotation.x += 0.0013 * speed;
      coreGroup.rotation.z = Math.sin(t * 0.55) * 0.12 + pointerX * 0.12;
      coreGroup.position.x += (pointerX * 0.2 - coreGroup.position.x) * 0.08;
      coreGroup.position.y += (pointerY * 0.16 - coreGroup.position.y) * 0.08;

      ringA.rotation.z += 0.003 * speed;
      ringB.rotation.x -= 0.0025 * speed;
      crystalShell.rotation.y -= 0.0022 * speed;
      dustPoints.rotation.y += 0.0008 * speed;
      dustPoints.rotation.x = Math.sin(t * 0.22) * 0.06;

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      crystal.geometry.dispose();
      (crystal.material as THREE.Material).dispose();
      crystalShell.geometry.dispose();
      (crystalShell.material as THREE.Material).dispose();
      ringA.geometry.dispose();
      (ringA.material as THREE.Material).dispose();
      ringB.geometry.dispose();
      (ringB.material as THREE.Material).dispose();
      dustGeometry.dispose();
      (dustPoints.material as THREE.Material).dispose();
      host.removeChild(renderer.domElement);
    };
  }, [intensity]);

  return <div ref={hostRef} className={`about-nebula-canvas ${intensity === 'bold' ? 'is-bold' : 'is-soft'}`} aria-hidden="true" />;
}

