'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FuturisticThreeHero() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#020617', 0.08);
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.62);
    const keyLight = new THREE.DirectionalLight(0xbfdbfe, 1.2);
    keyLight.position.set(4, 6, 3);
    const pinkLight = new THREE.PointLight(0xf0abfc, 0.95, 18);
    pinkLight.position.set(-4, -2, 3);
    scene.add(ambientLight, keyLight, pinkLight);

    const group = new THREE.Group();
    scene.add(group);
    const satellites = new THREE.Group();
    scene.add(satellites);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.1, 0.32, 240, 36),
      new THREE.MeshStandardMaterial({
        color: '#60a5fa',
        emissive: '#312e81',
        emissiveIntensity: 0.75,
        roughness: 0.22,
        metalness: 0.82
      })
    );
    group.add(knot);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.02, 1),
      new THREE.MeshBasicMaterial({
        color: '#22d3ee',
        wireframe: true,
        transparent: true,
        opacity: 0.34
      })
    );
    group.add(shell);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.52, 0.03, 20, 120),
      new THREE.MeshStandardMaterial({
        color: '#a78bfa',
        emissive: '#4c1d95',
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.65
      })
    );
    ring.rotation.set(Math.PI / 2, 0, Math.PI * 0.08);
    ring.scale.setScalar(1.42);
    group.add(ring);

    const ringTwo = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.02, 20, 128),
      new THREE.MeshBasicMaterial({
        color: '#67e8f9',
        transparent: true,
        opacity: 0.5
      })
    );
    ringTwo.rotation.set(Math.PI * 0.18, Math.PI * 0.26, 0);
    group.add(ringTwo);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(2.25, 24, 24),
      new THREE.MeshBasicMaterial({
        color: '#3b82f6',
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide
      })
    );
    group.add(halo);

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 900;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const radius = 4.5 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi) * 0.5;
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: '#93c5fd',
        size: 0.03,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    scene.add(particles);

    const smallNodes: THREE.Mesh[] = [];
    for (let i = 0; i < 22; i += 1) {
      const angle = (i / 22) * Math.PI * 2;
      const radius = 2.4 + Math.sin(i * 0.8) * 0.5;
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 14, 14),
        new THREE.MeshStandardMaterial({
          color: '#f472b6',
          emissive: '#9d174d',
          emissiveIntensity: 0.58
        })
      );
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(i * 1.7) * 1.4,
        Math.sin(angle) * radius
      );
      group.add(node);
      smallNodes.push(node);
    }

    const satelliteMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i += 1) {
      const sat = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.11, 0),
        new THREE.MeshStandardMaterial({
          color: '#c4b5fd',
          emissive: '#581c87',
          emissiveIntensity: 0.5,
          roughness: 0.3,
          metalness: 0.78
        })
      );
      satellites.add(sat);
      satelliteMeshes.push(sat);
    }

    let scrollProgress = 0;
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, window.scrollY / max));
    };

    const resize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    onScroll();
    resize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y += 0.006 + scrollProgress * 0.004;
      group.rotation.x = Math.sin(t * 0.38) * 0.16 + scrollProgress * 0.5;
      group.position.y = -scrollProgress * 0.8 + Math.sin(t * 0.6) * 0.06;
      shell.rotation.y -= 0.0025;
      ringTwo.rotation.z += 0.0024;
      ringTwo.rotation.x += 0.0016;
      particles.rotation.y += 0.0009;
      particles.rotation.x = Math.sin(t * 0.18) * 0.08;
      smallNodes.forEach((node, idx) => {
        node.scale.setScalar(0.9 + Math.sin(t * 1.1 + idx) * 0.12);
      });
      satelliteMeshes.forEach((sat, idx) => {
        const angle = t * (0.35 + idx * 0.04) + idx;
        const orbit = 2.35 + idx * 0.22;
        sat.position.set(
          Math.cos(angle) * orbit * 0.7,
          Math.sin(angle * 0.8) * 0.55,
          Math.sin(angle) * orbit * 0.7
        );
        sat.rotation.x += 0.02;
        sat.rotation.y += 0.018;
      });
      satellites.rotation.y -= 0.0018;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      knot.geometry.dispose();
      (knot.material as THREE.Material).dispose();
      shell.geometry.dispose();
      (shell.material as THREE.Material).dispose();
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
      ringTwo.geometry.dispose();
      (ringTwo.material as THREE.Material).dispose();
      halo.geometry.dispose();
      (halo.material as THREE.Material).dispose();
      particlesGeometry.dispose();
      (particles.material as THREE.Material).dispose();
      smallNodes.forEach((node) => {
        node.geometry.dispose();
        (node.material as THREE.Material).dispose();
      });
      satelliteMeshes.forEach((sat) => {
        sat.geometry.dispose();
        (sat.material as THREE.Material).dispose();
      });
      host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="hero-three-wrap" aria-hidden="true">
      <div ref={hostRef} className="hero-three-canvas" />
    </div>
  );
}

