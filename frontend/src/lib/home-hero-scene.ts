import * as THREE from "three";
import { isMobileViewport } from "./device";
import type { PerformanceTier } from "./performance";

export type HomeHeroScene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  dispose: () => void;
};

const CYAN = 0x45c8f5;
const BLUE = 0x2f7bff;
const DEEP = 0x1e54d6;

export function buildHomeHeroScene(tier: PerformanceTier): HomeHeroScene {
  const rich = tier === "high" && !isMobileViewport();
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);

  const disposables: Array<() => void> = [];

  const track = (geometry: THREE.BufferGeometry, material: THREE.Material) => {
    disposables.push(() => {
      geometry.dispose();
      material.dispose();
    });
  };

  const glowGeo = new THREE.SphereGeometry(1.15, 24, 24);
  const glowMat = new THREE.MeshBasicMaterial({
    color: DEEP,
    transparent: true,
    opacity: 0.14,
  });
  group.add(new THREE.Mesh(glowGeo, glowMat));
  track(glowGeo, glowMat);

  const icoGeo = new THREE.IcosahedronGeometry(1.85, rich ? 2 : 1);
  const wireGeo = new THREE.WireframeGeometry(icoGeo);
  const wireMat = new THREE.LineBasicMaterial({
    color: CYAN,
    transparent: true,
    opacity: rich ? 0.62 : 0.48,
  });
  const innerGroup = new THREE.Group();
  innerGroup.add(new THREE.LineSegments(wireGeo, wireMat));
  group.add(innerGroup);
  group.userData.inner = innerGroup;
  disposables.push(() => icoGeo.dispose());
  track(wireGeo, wireMat);

  if (rich) {
    const torusGeo = new THREE.TorusGeometry(2.85, 0.018, 8, 96);
    const torusMat = new THREE.MeshBasicMaterial({
      color: BLUE,
      transparent: true,
      opacity: 0.45,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI * 0.42;
    group.add(torus);
    track(torusGeo, torusMat);

    const torus2Geo = new THREE.TorusGeometry(3.15, 0.012, 6, 80);
    const torus2Mat = new THREE.MeshBasicMaterial({
      color: CYAN,
      transparent: true,
      opacity: 0.22,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.rotation.x = Math.PI * 0.62;
    torus2.rotation.y = Math.PI * 0.22;
    group.add(torus2);
    track(torus2Geo, torus2Mat);

    const count = 48;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.6 + (i % 3) * 0.15;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle * 2) * 0.35;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      colors[i * 3] = 0.27;
      colors[i * 3 + 1] = 0.78;
      colors[i * 3 + 2] = 0.96;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pointsMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    group.add(new THREE.Points(pointsGeo, pointsMat));
    track(pointsGeo, pointsMat);
  }

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 8.5);

  return {
    scene,
    camera,
    group,
    dispose: () => {
      disposables.forEach((fn) => fn());
    },
  };
}
