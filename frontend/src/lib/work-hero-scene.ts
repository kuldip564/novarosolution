import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Work page hero: an abstract "digital architecture" installation. Layered glass panels
 * with interface hints, joined by thin cyan connections and a slow orbit ring.
 *
 * The scene draws one frame per `render()` call. The caller owns the loop, so it can pause
 * when the hero leaves the viewport or the tab is hidden.
 */

export type WorkHeroQuality = "high" | "medium";

export type WorkHeroScene = {
  canvas: HTMLCanvasElement;
  render: (timeMs: number) => void;
  /** Pointer position over the window, each axis -0.5…0.5. */
  setPointer: (x: number, y: number) => void;
  /** How far the hero has scrolled out of view, 0…1. */
  setScroll: (progress: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

type Options = {
  width: number;
  height: number;
  theme: "light" | "dark";
  quality: WorkHeroQuality;
  pixelRatio: number;
};

const BLUE = 0x2563eb;
const CYAN = 0x22d3ee;

type PanelSpec = {
  size: [number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  ui?: "dashboard" | "list" | "chart";
};

const PANELS: PanelSpec[] = [
  { size: [2.5, 3.2], position: [-0.85, 0.3, 0.2], rotation: [0.02, 0.46, 0], ui: "dashboard" },
  { size: [2.0, 2.5], position: [0.85, -0.35, -0.9], rotation: [-0.04, -0.32, 0], ui: "list" },
  { size: [1.55, 2.0], position: [1.95, 0.95, -2.0], rotation: [0.05, -0.55, 0], ui: "chart" },
  { size: [1.25, 1.25], position: [-2.15, -1.35, -1.25], rotation: [0.18, 0.62, 0] },
  { size: [3.0, 0.75], position: [0.25, -1.95, 0.55], rotation: [-0.12, -0.12, 0] },
];

export function createWorkHeroScene(options: Options): WorkHeroScene | null {
  const { theme, quality } = options;
  const dark = theme === "dark";

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: quality === "high",
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
  renderer.setPixelRatio(options.pixelRatio);
  renderer.setSize(options.width, options.height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = dark ? 1.05 : 1.22;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, options.width / options.height, 0.1, 60);
  camera.position.set(0, 0.2, 9.2);

  // Soft studio reflections for the glass. Generated once, disposed with the scene.
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
  key.position.set(3, 5, 6);
  scene.add(key);
  const blueLight = new THREE.PointLight(BLUE, dark ? 30 : 22, 0, 2);
  blueLight.position.set(-3.5, 2.2, 3);
  scene.add(blueLight);
  const cyanLight = new THREE.PointLight(CYAN, dark ? 26 : 16, 0, 2);
  cyanLight.position.set(3.2, -1.6, 2.6);
  scene.add(cyanLight);

  const root = new THREE.Group();
  root.rotation.set(-0.06, -0.18, 0);
  // Sit the installation high and slightly small, clear of the hero's stats row.
  root.position.y = 0.55;
  root.scale.setScalar(0.9);
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
      opacity: dark ? 0.5 : 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const edgeMaterial = keep(
    new THREE.LineBasicMaterial({ color: dark ? 0x6f9bff : BLUE, transparent: true, opacity: dark ? 0.7 : 0.62 }),
  );
  const uiBlue = keep(new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: dark ? 0.75 : 0.55 }));
  const uiCyan = keep(new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: dark ? 0.85 : 0.7 }));
  const uiSoft = keep(
    new THREE.MeshBasicMaterial({ color: dark ? 0x8fb2ff : 0x9cb8f5, transparent: true, opacity: dark ? 0.35 : 0.45 }),
  );

  const panels: THREE.Group[] = [];
  const anchors: THREE.Vector3[] = [];

  PANELS.forEach((spec, index) => {
    const [w, h] = spec.size;
    const group = new THREE.Group();
    group.position.set(...spec.position);
    group.rotation.set(...spec.rotation);
    group.userData.baseY = spec.position[1];
    group.userData.phase = index * 1.3;

    const body = keep(new RoundedBoxGeometry(w, h, 0.07, 4, 0.12));
    group.add(new THREE.Mesh(body, glass));
    const edges = keep(new THREE.EdgesGeometry(body, 35));
    group.add(new THREE.LineSegments(edges, edgeMaterial));

    // Abstract interface hints on the larger panels (never a fake product screenshot).
    const face = 0.045;
    const bar = (bw: number, bh: number, x: number, y: number, material: THREE.Material) => {
      const geometry = keep(new THREE.PlaneGeometry(bw, bh));
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, face);
      group.add(mesh);
    };
    if (spec.ui === "dashboard") {
      bar(w * 0.62, 0.11, -w * 0.12, h * 0.36, uiBlue);
      bar(w * 0.38, 0.07, -w * 0.24, h * 0.27, uiSoft);
      bar(w * 0.36, h * 0.3, -w * 0.2, h * 0.02, uiSoft);
      bar(w * 0.26, h * 0.3, w * 0.22, h * 0.02, uiSoft);
      bar(w * 0.72, 0.06, 0, -h * 0.24, uiSoft);
      bar(w * 0.5, 0.06, -w * 0.11, -h * 0.31, uiSoft);
      bar(w * 0.24, 0.16, w * 0.24, -h * 0.4, uiCyan);
    } else if (spec.ui === "list") {
      for (let row = 0; row < 4; row += 1) {
        bar(0.16, 0.16, -w * 0.32, h * 0.3 - row * 0.42, row === 1 ? uiCyan : uiBlue);
        bar(w * 0.48, 0.07, w * 0.05, h * 0.32 - row * 0.42, uiSoft);
        bar(w * 0.3, 0.05, -w * 0.04, h * 0.25 - row * 0.42, uiSoft);
      }
    } else if (spec.ui === "chart") {
      const heights = [0.35, 0.62, 0.48, 0.86, 0.7];
      heights.forEach((value, i) => {
        const barHeight = h * 0.5 * value;
        bar(0.14, barHeight, -w * 0.3 + i * 0.25, -h * 0.28 + barHeight / 2, i === 3 ? uiCyan : uiBlue);
      });
      bar(w * 0.6, 0.06, 0, h * 0.34, uiSoft);
    }

    // Corner anchors for the connecting lines, in root space.
    group.updateMatrix();
    for (const [cx, cy] of [
      [w / 2, h / 2],
      [-w / 2, -h / 2],
    ]) {
      anchors.push(new THREE.Vector3(cx, cy, 0).applyMatrix4(group.matrix));
    }

    root.add(group);
    panels.push(group);
  });

  // Connections between panels: thin cyan lines with small nodes at the ends.
  const pairs: Array<[number, number]> = [
    [0, 2],
    [1, 4],
    [2, 5],
    [3, 6],
    [0, 7],
    [8, 1],
    [9, 3],
  ];
  const linePoints: number[] = [];
  for (const [a, b] of pairs) {
    const from = anchors[a];
    const to = anchors[b];
    if (!from || !to) continue;
    linePoints.push(from.x, from.y, from.z, to.x, to.y, to.z);
  }
  const linkGeometry = keep(new THREE.BufferGeometry());
  linkGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePoints, 3));
  const linkMaterial = keep(
    new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: dark ? 0.6 : 0.75 }),
  );
  root.add(new THREE.LineSegments(linkGeometry, linkMaterial));

  const nodeGeometry = keep(new THREE.SphereGeometry(0.05, 16, 16));
  const nodeMaterial = keep(new THREE.MeshBasicMaterial({ color: CYAN }));
  const nodeMaterialBlue = keep(new THREE.MeshBasicMaterial({ color: BLUE }));
  anchors.forEach((point, index) => {
    const node = new THREE.Mesh(nodeGeometry, index % 3 === 0 ? nodeMaterialBlue : nodeMaterial);
    node.position.copy(point);
    root.add(node);
  });

  // A slow orbit ring and one faceted accent: a single sculptural gesture, not decoration overload.
  const ringGeometry = keep(new THREE.TorusGeometry(2.55, 0.011, 8, 160));
  const ringMaterial = keep(new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: dark ? 0.55 : 0.35 }));
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.set(1.18, 0.2, 0);
  root.add(ring);

  const gemGeometry = keep(new THREE.OctahedronGeometry(0.34, 0));
  const gem = new THREE.Mesh(gemGeometry, glass);
  gem.position.set(1.15, 1.7, 0.6);
  const gemEdges = keep(new THREE.EdgesGeometry(gemGeometry));
  gem.add(new THREE.LineSegments(gemEdges, edgeMaterial));
  root.add(gem);

  // Sparse dust for depth. Kept small on purpose.
  const dustCount = quality === "high" ? 90 : 45;
  const dust = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    dust[i * 3] = (Math.random() - 0.5) * 9;
    dust[i * 3 + 1] = (Math.random() - 0.5) * 6;
    dust[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
  }
  const dustGeometry = keep(new THREE.BufferGeometry());
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  const dustMaterial = keep(
    new THREE.PointsMaterial({ color: dark ? 0x8fb2ff : BLUE, size: 0.035, transparent: true, opacity: dark ? 0.55 : 0.35 }),
  );
  const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
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

      // Smooth interpolation toward the pointer; never snaps.
      const ease = 1 - Math.exp(-dt * 3.2);
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;

      root.rotation.y = -0.18 + Math.sin(t * 0.16) * 0.1 + pointer.x * 0.34;
      root.rotation.x = -0.06 + Math.sin(t * 0.11) * 0.03 - pointer.y * 0.16;

      panels.forEach((panel) => {
        const phase = panel.userData.phase as number;
        panel.position.y = (panel.userData.baseY as number) + Math.sin(t * 0.55 + phase) * 0.07;
      });
      ring.rotation.z = t * 0.06;
      gem.rotation.y = t * 0.35;
      gem.rotation.x = t * 0.18;
      dustPoints.rotation.y = t * 0.012;

      camera.position.x = pointer.x * 0.6;
      camera.position.y = 0.2 - scroll * 1.1 + pointer.y * -0.3;
      camera.position.z = 9.2 + scroll * 2.2;
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
    resize(width, height) {
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    dispose() {
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
