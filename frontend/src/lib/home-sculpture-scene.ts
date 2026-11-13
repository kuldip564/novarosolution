import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { ThreeHeroScene, ThreeHeroSceneOptions } from "./use-three-scene";

/**
 * Homepage hero sculpture: a twisted spire of glass slabs around a light core, with a few
 * satellite nodes linked back to the core: "intelligent connectivity" as an abstract object.
 * Same material language as the Work page installation; intentionally not the Novaro mark.
 */

const BLUE = 0x2563eb;
const CYAN = 0x22d3ee;
const SLABS = 9;

type Satellite = { mesh: THREE.Mesh; radius: number; height: number; speed: number; phase: number };

export function createHomeSculptureScene(options: ThreeHeroSceneOptions): ThreeHeroScene | null {
  const { theme, quality } = options;
  const dark = theme === "dark";

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: quality === "high", powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(options.pixelRatio);
  renderer.setSize(options.width, options.height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = dark ? 1.05 : 1.22;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, options.width / options.height, 0.1, 60);
  camera.position.set(0, 0.4, 11);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envTexture = pmrem.fromScene(room, 0.04).texture;
  scene.environment = envTexture;

  const disposables: Array<{ dispose: () => void }> = [envTexture, pmrem];
  const keep = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  scene.add(new THREE.AmbientLight(0xffffff, dark ? 0.35 : 0.7));
  const key = new THREE.DirectionalLight(0xffffff, dark ? 1.2 : 1.6);
  key.position.set(3, 6, 6);
  scene.add(key);
  const blueLight = new THREE.PointLight(BLUE, dark ? 34 : 24, 0, 2);
  blueLight.position.set(-3.2, 2.4, 3);
  scene.add(blueLight);
  const cyanLight = new THREE.PointLight(CYAN, dark ? 30 : 18, 0, 2);
  cyanLight.position.set(3, -1.8, 2.8);
  scene.add(cyanLight);

  const root = new THREE.Group();
  root.rotation.set(0.18, -0.4, 0);
  scene.add(root);

  const glass = keep(
    new THREE.MeshPhysicalMaterial({
      color: dark ? 0x1d3263 : 0xf4f8ff,
      metalness: 0.04,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: dark ? 0.9 : 1.6,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const edgeMaterial = keep(
    new THREE.LineBasicMaterial({ color: dark ? 0x6f9bff : BLUE, transparent: true, opacity: dark ? 0.72 : 0.6 }),
  );

  // The spire: slabs that shrink and twist as they rise.
  const slabs: THREE.Group[] = [];
  for (let i = 0; i < SLABS; i += 1) {
    const size = 2.35 - i * 0.16;
    const geometry = keep(new RoundedBoxGeometry(size, 0.08, size, 3, 0.07));
    const slab = new THREE.Group();
    slab.add(new THREE.Mesh(geometry, glass));
    slab.add(new THREE.LineSegments(keep(new THREE.EdgesGeometry(geometry, 35)), edgeMaterial));
    slab.position.y = -2.1 + i * 0.5;
    slab.userData.twist = i * 0.21;
    slab.userData.index = i;
    root.add(slab);
    slabs.push(slab);
  }

  // Light core through the middle.
  const coreGeometry = keep(new THREE.CylinderGeometry(0.035, 0.035, 4.9, 12));
  const coreMaterial = keep(new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: dark ? 0.95 : 0.85 }));
  root.add(new THREE.Mesh(coreGeometry, coreMaterial));
  const haloGeometry = keep(new THREE.CylinderGeometry(0.2, 0.2, 4.9, 24, 1, true));
  const haloMaterial = keep(
    new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: dark ? 0.16 : 0.1, side: THREE.DoubleSide, depthWrite: false }),
  );
  root.add(new THREE.Mesh(haloGeometry, haloMaterial));

  // Satellites linked to the core.
  const nodeGeometry = keep(new THREE.SphereGeometry(0.075, 16, 16));
  const nodeCyan = keep(new THREE.MeshBasicMaterial({ color: CYAN }));
  const nodeBlue = keep(new THREE.MeshBasicMaterial({ color: BLUE }));
  const satellites: Satellite[] = [
    { radius: 2.5, height: 1.6, speed: 0.22, phase: 0.2 },
    { radius: 2.9, height: 0.7, speed: -0.16, phase: 2.1 },
    { radius: 2.3, height: -0.3, speed: 0.19, phase: 4.0 },
    { radius: 3.1, height: -1.2, speed: -0.13, phase: 1.1 },
    { radius: 2.6, height: -1.9, speed: 0.17, phase: 3.2 },
    { radius: 2.2, height: 2.3, speed: -0.2, phase: 5.1 },
  ].map((spec, index) => {
    const mesh = new THREE.Mesh(nodeGeometry, index % 2 ? nodeBlue : nodeCyan);
    root.add(mesh);
    return { ...spec, mesh };
  });
  const linkPositions = new Float32Array(satellites.length * 6);
  const linkGeometry = keep(new THREE.BufferGeometry());
  linkGeometry.setAttribute("position", new THREE.BufferAttribute(linkPositions, 3));
  const linkMaterial = keep(new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: dark ? 0.55 : 0.6 }));
  root.add(new THREE.LineSegments(linkGeometry, linkMaterial));

  // Two orbit rings: one gesture of motion, nothing more.
  const ringMaterial = keep(new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: dark ? 0.5 : 0.32 }));
  const ringA = new THREE.Mesh(keep(new THREE.TorusGeometry(2.75, 0.01, 8, 180)), ringMaterial);
  ringA.rotation.set(1.32, 0, 0.2);
  root.add(ringA);
  const ringB = new THREE.Mesh(keep(new THREE.TorusGeometry(3.15, 0.008, 8, 180)), ringMaterial);
  ringB.rotation.set(1.05, 0.35, -0.3);
  root.add(ringB);

  // Sparse dust for depth.
  const dustCount = quality === "high" ? 80 : 40;
  const dust = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    dust[i * 3] = (Math.random() - 0.5) * 10;
    dust[i * 3 + 1] = (Math.random() - 0.5) * 7;
    dust[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1.5;
  }
  const dustGeometry = keep(new THREE.BufferGeometry());
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  const dustPoints = new THREE.Points(
    dustGeometry,
    keep(new THREE.PointsMaterial({ color: dark ? 0x8fb2ff : BLUE, size: 0.035, transparent: true, opacity: dark ? 0.5 : 0.32 })),
  );
  scene.add(dustPoints);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let scroll = 0;
  let last = 0;

  return {
    canvas: renderer.domElement,
    render(timeMs) {
      const t = timeMs / 1000;
      const dt = last ? Math.min((timeMs - last) / 1000, 0.05) : 0.016;
      last = timeMs;
      const ease = 1 - Math.exp(-dt * 3);
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;

      root.rotation.y = -0.4 + t * 0.06 + pointer.x * 0.4;
      root.rotation.x = 0.18 - pointer.y * 0.14;

      for (const slab of slabs) {
        const i = slab.userData.index as number;
        slab.rotation.y = (slab.userData.twist as number) * (1 + scroll * 0.8) + Math.sin(t * 0.45 + i * 0.4) * 0.05;
      }

      satellites.forEach((sat, index) => {
        const angle = sat.phase + t * sat.speed;
        const y = sat.height + Math.sin(t * 0.6 + sat.phase) * 0.1;
        sat.mesh.position.set(Math.cos(angle) * sat.radius, y, Math.sin(angle) * sat.radius);
        linkPositions.set([0, y, 0, sat.mesh.position.x, y, sat.mesh.position.z], index * 6);
      });
      linkGeometry.attributes.position.needsUpdate = true;

      ringA.rotation.z = 0.2 + t * 0.05;
      ringB.rotation.z = -0.3 - t * 0.035;
      dustPoints.rotation.y = t * 0.01;

      camera.position.x = pointer.x * 0.7;
      camera.position.y = 0.4 - scroll * 1.2 - pointer.y * 0.35;
      camera.position.z = 11 + scroll * 2.4;
      camera.lookAt(0, -scroll * 0.4, 0);

      renderer.render(scene, camera);
    },
    setPointer(x, y) {
      pointer.tx = x;
      pointer.ty = y;
    },
    setScroll(progress) {
      scroll = Math.min(Math.max(progress, 0), 1);
    },
    setAnimationLoop(fn) {
      renderer.setAnimationLoop(fn);
    },
    resize(width, height) {
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    dispose() {
      renderer.setAnimationLoop(null);
      disposables.forEach((item) => item.dispose());
      room.traverse((child) => {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
