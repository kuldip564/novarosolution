import * as THREE from "three";

export function createParticleGeometries(
  particleCount: number,
  starCount: number,
  theme: "light" | "dark" = "dark",
): [THREE.BufferGeometry, THREE.BufferGeometry] {
  const points = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const c1 = new THREE.Color(theme === "light" ? 0x1e54d6 : 0x54cdf6);
  const c2 = new THREE.Color(theme === "light" ? 0x2563eb : 0x2f7bff);
  const scratch = new THREE.Color();

  for (let i = 0; i < particleCount; i++) {
    const radius = 9 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    scratch.copy(c1).lerp(c2, Math.random());
    colors[i * 3] = scratch.r;
    colors[i * 3 + 1] = scratch.g;
    colors[i * 3 + 2] = scratch.b;
  }

  points.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  points.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const stars = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 60;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  stars.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3),
  );

  return [points, stars];
}
