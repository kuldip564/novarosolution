import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { ThreeHeroScene, ThreeHeroSceneOptions } from "./use-three-scene";

/**
 * Services hero: four practices around one core. A faceted glass core with four glass modules
 * on a slow orbit (interface bars, a neural mesh, rising bars, a server stack), joined to the
 * core by thin lines that carry small pulses of light.
 *
 * The scene draws one frame per `render()` call. The caller owns the loop, so it can pause
 * when the hero leaves the viewport or the tab is hidden.
 */

const BLUE = 0x2563eb;
const CYAN = 0x22d3ee;

type Glyph = "web" | "ai" | "growth" | "cloud";
const MODULES: Glyph[] = ["web", "ai", "growth", "cloud"];
const RADIUS = 2.05;
const TILE = 0.98;

export function createServicesHeroScene(options: ThreeHeroSceneOptions): ThreeHeroScene | null {
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
  camera.position.set(0, 0.3, 9.4);

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
  blueLight.position.set(-3.2, 2.4, 3);
  scene.add(blueLight);
  const cyanLight = new THREE.PointLight(CYAN, dark ? 26 : 16, 0, 2);
  cyanLight.position.set(3, -1.8, 2.6);
  scene.add(cyanLight);

  const glass = keep(
    new THREE.MeshPhysicalMaterial({
      color: dark ? 0x1d3263 : 0xf4f8ff,
      metalness: 0.04,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: dark ? 0.9 : 1.6,
      transparent: true,
      opacity: 0.52,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const edgeMaterial = keep(
    new THREE.LineBasicMaterial({ color: dark ? 0x6f9bff : BLUE, transparent: true, opacity: dark ? 0.7 : 0.62 }),
  );
  const uiBlue = keep(new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: dark ? 0.78 : 0.6 }));
  const uiCyan = keep(new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: dark ? 0.9 : 0.75 }));
  const uiSoft = keep(
    new THREE.MeshBasicMaterial({ color: dark ? 0x8fb2ff : 0x9cb8f5, transparent: true, opacity: dark ? 0.35 : 0.45 }),
  );
  const lineCyan = keep(new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: dark ? 0.9 : 0.8 }));

  const root = new THREE.Group();
  // Slightly small and left of centre, so the far module and outer ring clear the screen edge.
  root.position.set(-0.12, 0.15, 0);
  root.scale.setScalar(0.82);
  scene.add(root);

  // The orbit plane is tilted towards the viewer so the ring reads as an ellipse.
  const orbit = new THREE.Group();
  orbit.rotation.x = 0.38;
  root.add(orbit);

  // Core: a faceted glass gem around a small light.
  const coreGeometry = keep(new THREE.IcosahedronGeometry(0.6, 0));
  const core = new THREE.Mesh(coreGeometry, glass);
  const coreEdges = keep(new THREE.EdgesGeometry(coreGeometry));
  core.add(new THREE.LineSegments(coreEdges, edgeMaterial));
  const lightGeometry = keep(new THREE.SphereGeometry(0.2, 24, 24));
  core.add(new THREE.Mesh(lightGeometry, uiCyan));
  orbit.add(core);

  const ringGeometry = keep(new THREE.TorusGeometry(RADIUS, 0.011, 8, 180));
  const ringMaterial = keep(new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: dark ? 0.55 : 0.35 }));
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  orbit.add(ring);

  const outerRingGeometry = keep(new THREE.TorusGeometry(RADIUS * 1.32, 0.007, 8, 200));
  const outerRing = new THREE.Mesh(outerRingGeometry, ringMaterial);
  outerRing.rotation.set(Math.PI / 2 + 0.12, 0.08, 0);
  orbit.add(outerRing);

  const plane = (w: number, h: number, x: number, y: number, material: THREE.Material, parent: THREE.Object3D) => {
    const mesh = new THREE.Mesh(keep(new THREE.PlaneGeometry(w, h)), material);
    mesh.position.set(x, y, 0.05);
    parent.add(mesh);
    return mesh;
  };

  const tileGeometry = keep(new RoundedBoxGeometry(TILE, TILE, 0.08, 4, 0.12));
  const tileEdges = keep(new THREE.EdgesGeometry(tileGeometry, 35));
  const meshes: THREE.Object3D[] = [];
  const modules = MODULES.map((glyph, index) => {
    const angle = (index / MODULES.length) * Math.PI * 2;
    const holder = new THREE.Group();
    holder.position.set(Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS);
    holder.userData.phase = index * 1.4;
    // Y first, then X: undoes the orbit's spin, then most of its tilt, so the tile faces the viewer.
    holder.rotation.order = "YXZ";

    const tile = new THREE.Group();
    tile.add(new THREE.Mesh(tileGeometry, glass));
    tile.add(new THREE.LineSegments(tileEdges, edgeMaterial));

    // Abstract signs for each practice (never a fake product screenshot).
    const s = TILE;
    if (glyph === "web") {
      plane(s * 0.62, 0.07, -s * 0.06, s * 0.3, uiBlue, tile);
      plane(s * 0.36, 0.05, -s * 0.19, s * 0.2, uiSoft, tile);
      plane(s * 0.3, s * 0.28, -s * 0.17, -s * 0.06, uiSoft, tile);
      plane(s * 0.22, s * 0.28, s * 0.2, -s * 0.06, uiSoft, tile);
      plane(s * 0.22, 0.1, s * 0.18, -s * 0.33, uiCyan, tile);
    } else if (glyph === "ai") {
      const meshGeometry = keep(new THREE.IcosahedronGeometry(s * 0.3, 0));
      const wire = new THREE.LineSegments(keep(new THREE.EdgesGeometry(meshGeometry)), lineCyan);
      wire.position.z = 0.12;
      tile.add(wire);
      meshes.push(wire);
      const nodeGeometry = keep(new THREE.SphereGeometry(0.035, 12, 12));
      const positions = meshGeometry.getAttribute("position");
      const seen = new Set<string>();
      for (let i = 0; i < positions.count; i += 1) {
        const id = `${positions.getX(i).toFixed(3)},${positions.getY(i).toFixed(3)},${positions.getZ(i).toFixed(3)}`;
        if (seen.has(id)) continue;
        seen.add(id);
        const node = new THREE.Mesh(nodeGeometry, i % 3 === 0 ? uiBlue : uiCyan);
        node.position.set(positions.getX(i), positions.getY(i), positions.getZ(i));
        wire.add(node);
      }
    } else if (glyph === "growth") {
      [0.3, 0.46, 0.38, 0.62, 0.8].forEach((value, i) => {
        const h = s * 0.62 * value;
        plane(0.1, h, -s * 0.3 + i * s * 0.15, -s * 0.32 + h / 2, i === 4 ? uiCyan : uiBlue, tile);
      });
      plane(s * 0.62, 0.035, 0, s * 0.36, uiSoft, tile);
    } else {
      for (let row = 0; row < 3; row += 1) {
        const y = s * 0.26 - row * s * 0.26;
        plane(s * 0.66, s * 0.17, 0, y, uiSoft, tile);
        plane(0.06, 0.06, -s * 0.24, y, row === 1 ? uiCyan : uiBlue, tile);
        plane(s * 0.26, 0.035, s * 0.08, y, uiBlue, tile);
      }
    }

    holder.add(tile);
    orbit.add(holder);
    return { holder, tile, angle };
  });

  // Spokes from the core to each module, with a pulse of light travelling outwards on each.
  const spokePoints: number[] = [];
  modules.forEach(({ holder }) => spokePoints.push(0, 0, 0, holder.position.x, 0, holder.position.z));
  const spokeGeometry = keep(new THREE.BufferGeometry());
  spokeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(spokePoints, 3));
  const spokeMaterial = keep(new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: dark ? 0.5 : 0.6 }));
  orbit.add(new THREE.LineSegments(spokeGeometry, spokeMaterial));

  const pulseGeometry = keep(new THREE.SphereGeometry(0.05, 16, 16));
  const pulseMaterial = keep(new THREE.MeshBasicMaterial({ color: CYAN }));
  const pulses = modules.map(({ holder }, index) => {
    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulse.userData.target = holder.position.clone();
    pulse.userData.offset = index / modules.length;
    orbit.add(pulse);
    return pulse;
  });

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

      orbit.rotation.y = 0.45 + t * 0.11;
      root.rotation.y = pointer.x * 0.3;
      root.rotation.x = -pointer.y * 0.14 + Math.sin(t * 0.12) * 0.03;

      // Modules keep facing the viewer as they travel round the core.
      modules.forEach(({ holder, tile }) => {
        const phase = holder.userData.phase as number;
        holder.rotation.y = -orbit.rotation.y;
        holder.rotation.x = -orbit.rotation.x * 0.6;
        tile.position.y = Math.sin(t * 0.6 + phase) * 0.06;
        tile.rotation.z = Math.sin(t * 0.4 + phase) * 0.04;
      });
      meshes.forEach((mesh) => {
        mesh.rotation.y = t * 0.5;
        mesh.rotation.x = t * 0.22;
      });
      pulses.forEach((pulse) => {
        const p = (t * 0.28 + (pulse.userData.offset as number)) % 1;
        pulse.position.copy(pulse.userData.target as THREE.Vector3).multiplyScalar(p);
        pulse.scale.setScalar(0.6 + Math.sin(p * Math.PI) * 0.7);
      });
      core.rotation.y = t * 0.3;
      core.rotation.x = t * 0.16;
      outerRing.rotation.z = t * 0.04;
      dustPoints.rotation.y = t * 0.012;

      camera.position.x = pointer.x * 0.6;
      camera.position.y = 0.3 - scroll * 1.1 + pointer.y * -0.3;
      camera.position.z = 9.4 + scroll * 2.2;
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
