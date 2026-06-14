import * as THREE from "three";
import { isMobileViewport } from "./device";
import { createParticleGeometries } from "./particle-geometries";
import { getParticleCounts, type PerformanceTier } from "./performance";

export type HomeBgAnimatables = {
  points: THREE.Points;
  stars: THREE.Points;
  shapes: THREE.Object3D[];
};

export type HomeBgScene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animatables: HomeBgAnimatables;
  dispose: () => void;
};

const CYAN = 0x45c8f5;
const BLUE = 0x2f7bff;
const INK = 0x05080f;

function addWireMesh(
  parent: THREE.Object3D,
  source: THREE.BufferGeometry,
  color: number,
  opacity: number,
  disposables: Array<() => void>,
) {
  const wireGeo = new THREE.WireframeGeometry(source);
  const wireMat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });
  const mesh = new THREE.LineSegments(wireGeo, wireMat);
  parent.add(mesh);
  disposables.push(() => {
    source.dispose();
    wireGeo.dispose();
    wireMat.dispose();
  });
  return mesh;
}

export function buildHomeBgScene(tier: PerformanceTier): HomeBgScene | null {
  const counts = getParticleCounts(tier);
  if (counts.particleCount === 0) return null;

  const rich = tier === "high" && !isMobileViewport();
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(INK, 8, 42);

  const disposables: Array<() => void> = [];
  const shapes: THREE.Object3D[] = [];

  const [pointsGeometry, starsGeometry] = createParticleGeometries(
    counts.particleCount,
    counts.starCount,
    "dark",
  );

  const points = new THREE.Points(
    pointsGeometry,
    new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(points);
  disposables.push(() => {
    pointsGeometry.dispose();
    (points.material as THREE.Material).dispose();
  });

  const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({
      size: 0.05,
      color: 0x9fd8ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(stars);
  disposables.push(() => {
    starsGeometry.dispose();
    (stars.material as THREE.Material).dispose();
  });

  if (rich) {
    const grid = new THREE.GridHelper(48, 48, BLUE, 0x1a3a6e);
    const gridMat = grid.material as THREE.LineBasicMaterial;
    gridMat.transparent = true;
    gridMat.opacity = 0.2;
    grid.position.y = -7;
    grid.rotation.x = 0.22;
    scene.add(grid);
    disposables.push(() => {
      grid.geometry.dispose();
      gridMat.dispose();
    });
  }

  const shapeDefs: Array<{
    geo: THREE.BufferGeometry;
    position: THREE.Vector3;
    scale: number;
    color: number;
    opacity: number;
  }> = rich
    ? [
        {
          geo: new THREE.IcosahedronGeometry(2.4, 1),
          position: new THREE.Vector3(-9, 1.5, -14),
          scale: 1,
          color: CYAN,
          opacity: 0.22,
        },
        {
          geo: new THREE.OctahedronGeometry(2.1, 0),
          position: new THREE.Vector3(10, -2, -16),
          scale: 1,
          color: BLUE,
          opacity: 0.18,
        },
        {
          geo: new THREE.TorusGeometry(3.2, 0.03, 8, 64),
          position: new THREE.Vector3(0, 3, -20),
          scale: 1,
          color: CYAN,
          opacity: 0.16,
        },
        {
          geo: new THREE.IcosahedronGeometry(1.6, 0),
          position: new THREE.Vector3(7, 4, -11),
          scale: 1,
          color: BLUE,
          opacity: 0.14,
        },
      ]
    : [
        {
          geo: new THREE.IcosahedronGeometry(2.2, 0),
          position: new THREE.Vector3(-7, 0, -13),
          scale: 1,
          color: CYAN,
          opacity: 0.16,
        },
        {
          geo: new THREE.OctahedronGeometry(1.8, 0),
          position: new THREE.Vector3(8, -1, -15),
          scale: 1,
          color: BLUE,
          opacity: 0.14,
        },
      ];

  shapeDefs.forEach(({ geo, position, scale, color, opacity }) => {
    const mesh = addWireMesh(scene, geo, color, opacity, disposables);
    mesh.position.copy(position);
    mesh.scale.setScalar(scale);
    mesh.userData.baseY = position.y;
    shapes.push(mesh);
  });

  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.set(0, 0, 16);

  return {
    scene,
    camera,
    animatables: { points, stars, shapes },
    dispose: () => {
      disposables.forEach((fn) => fn());
    },
  };
}
