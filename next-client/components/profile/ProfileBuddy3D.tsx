'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type ProfileBuddy3DProps = {
  statusText: string;
  errorText: string;
  isBusy: boolean;
};

type BuddyMode = 'auto' | 'wave' | 'focus' | 'chill';

export default function ProfileBuddy3D({ statusText, errorText, isBusy }: ProfileBuddy3DProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<BuddyMode>('auto');
  const modeRef = useRef<BuddyMode>('auto');
  const statusTextRef = useRef('');
  const errorTextRef = useRef('');
  const isBusyRef = useRef(false);

  const actionLabel = useMemo(() => {
    if (mode !== 'auto') return `Mode: ${mode}`;
    if (errorText) return 'Mood: alert';
    if (isBusy) return 'Mood: working';
    if (statusText) return 'Mood: happy';
    return 'Mood: idle';
  }, [mode, errorText, isBusy, statusText]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    statusTextRef.current = statusText;
  }, [statusText]);

  useEffect(() => {
    errorTextRef.current = errorText;
  }, [errorText]);

  useEffect(() => {
    isBusyRef.current = isBusy;
  }, [isBusy]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#020617', 4.6, 8.9);
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 1.08, 5.25);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    host.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight('#c7e6ff', '#0f172a', 0.82);
    scene.add(hemi);
    const key = new THREE.DirectionalLight('#ffffff', 1.36);
    key.position.set(2.4, 4.8, 3.4);
    const fill = new THREE.DirectionalLight('#b8d8ff', 0.48);
    fill.position.set(-2.3, 2.1, 2.2);
    const rim = new THREE.PointLight('#7dd3fc', 1.05, 16);
    rim.position.set(-2.6, 2.2, -1.6);
    scene.add(key, fill, rim);

    const root = new THREE.Group();
    scene.add(root);

    const shirtCanvas = document.createElement('canvas');
    shirtCanvas.width = 64;
    shirtCanvas.height = 64;
    const shirtCtx = shirtCanvas.getContext('2d');
    if (shirtCtx) {
      shirtCtx.fillStyle = '#d8c8b5';
      shirtCtx.fillRect(0, 0, 64, 64);
      shirtCtx.fillStyle = '#aa8464';
      for (let i = 0; i < 64; i += 8) {
        shirtCtx.fillRect(i, 0, 2, 64);
        shirtCtx.fillRect(0, i, 64, 2);
      }
      shirtCtx.fillStyle = 'rgba(124, 85, 58, 0.4)';
      for (let i = 4; i < 64; i += 8) {
        shirtCtx.fillRect(i, 0, 1, 64);
        shirtCtx.fillRect(0, i, 64, 1);
      }
    }
    const shirtTexture = new THREE.CanvasTexture(shirtCanvas);
    shirtTexture.colorSpace = THREE.SRGBColorSpace;
    shirtTexture.wrapS = THREE.RepeatWrapping;
    shirtTexture.wrapT = THREE.RepeatWrapping;
    shirtTexture.repeat.set(1.2, 1.2);

    const shirtMat = new THREE.MeshStandardMaterial({ map: shirtTexture, roughness: 0.86, metalness: 0.03 });
    const skinMat = new THREE.MeshStandardMaterial({ color: '#f2ceb0', roughness: 0.8, metalness: 0.02 });
    const hairMat = new THREE.MeshStandardMaterial({ color: '#2a1d18', roughness: 0.72, metalness: 0.05 });
    const beardMat = new THREE.MeshStandardMaterial({ color: '#201711', roughness: 0.74, metalness: 0.03 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: '#374151', roughness: 0.84, metalness: 0.05 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.78, metalness: 0.08 });
    const soleMat = new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.9, metalness: 0.02 });
    const detailMat = new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.7, metalness: 0.04 });

    const bodyPivot = new THREE.Group();
    bodyPivot.position.y = 0.06;
    root.add(bodyPivot);

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.9, 10, 18), shirtMat);
    torso.scale.set(1.08, 1.04, 0.78);
    torso.position.y = 0.3;
    bodyPivot.add(torso);

    const innerShirt = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 1.06, 0.05),
      new THREE.MeshStandardMaterial({ color: '#eadccf', roughness: 0.86, metalness: 0.02 })
    );
    innerShirt.position.set(0, 0.31, 0.27);
    bodyPivot.add(innerShirt);

    const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.08), shirtMat);
    collarL.position.set(-0.12, 0.8, 0.25);
    collarL.rotation.z = 0.34;
    bodyPivot.add(collarL);
    const collarR = collarL.clone();
    collarR.position.x = 0.12;
    collarR.rotation.z = -0.34;
    bodyPivot.add(collarR);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.19, 16), skinMat);
    neck.position.set(0, 0.94, 0.02);
    bodyPivot.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.2, 0.05);
    bodyPivot.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.39, 34, 34), skinMat);
    head.scale.set(1.02, 1.12, 0.92);
    headGroup.add(head);

    const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), skinMat);
    jaw.scale.set(1.02, 0.56, 0.84);
    jaw.position.set(0, -0.18, 0.09);
    headGroup.add(jaw);

    const earGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const earL = new THREE.Mesh(earGeo, skinMat);
    earL.scale.set(0.78, 1.12, 0.62);
    earL.position.set(-0.45, -0.03, 0.02);
    headGroup.add(earL);
    const earR = earL.clone();
    earR.position.x = 0.47;
    headGroup.add(earR);

    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.43, 26, 26), hairMat);
    hairTop.scale.set(1.02, 0.56, 0.92);
    hairTop.position.y = 0.24;
    headGroup.add(hairTop);

    const hairFrontGroup = new THREE.Group();
    hairFrontGroup.position.set(0, 0.23, 0.27);
    headGroup.add(hairFrontGroup);
    for (let i = 0; i < 6; i += 1) {
      const lock = new THREE.Mesh(new THREE.SphereGeometry(0.064 + i * 0.007, 12, 12), hairMat);
      lock.scale.set(1, 0.9, 0.74);
      lock.position.set(-0.24 + i * 0.095, -0.05 - Math.abs(2.5 - i) * 0.02, 0);
      hairFrontGroup.add(lock);
    }

    const beard = new THREE.Mesh(new THREE.SphereGeometry(0.3, 22, 22), beardMat);
    beard.scale.set(1.04, 0.66, 0.84);
    beard.position.set(0, -0.19, 0.14);
    headGroup.add(beard);

    const mustache = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.17, 4, 10), beardMat);
    mustache.rotation.z = Math.PI / 2;
    mustache.position.set(0, -0.11, 0.37);
    headGroup.add(mustache);

    const browGeo = new THREE.BoxGeometry(0.14, 0.026, 0.02);
    const browL = new THREE.Mesh(browGeo, detailMat);
    browL.position.set(-0.14, 0.09, 0.385);
    browL.rotation.z = 0.1;
    headGroup.add(browL);
    const browR = browL.clone();
    browR.position.x = 0.14;
    browR.rotation.z = -0.1;
    headGroup.add(browR);

    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.18, metalness: 0.03 });
    const irisMat = new THREE.MeshStandardMaterial({ color: '#4a2b18', roughness: 0.35, metalness: 0.02 });
    const pupilMat = detailMat;
    const eyeWhiteGeo = new THREE.SphereGeometry(0.085, 16, 16);
    const irisGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const pupilGeo = new THREE.SphereGeometry(0.017, 10, 10);

    const eyeLeftGroup = new THREE.Group();
    eyeLeftGroup.position.set(-0.14, 0.01, 0.39);
    headGroup.add(eyeLeftGroup);
    const eyeRightGroup = new THREE.Group();
    eyeRightGroup.position.set(0.14, 0.01, 0.39);
    headGroup.add(eyeRightGroup);

    const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeLeftGroup.add(eyeL);
    const eyeR = eyeL.clone();
    eyeRightGroup.add(eyeR);

    const irisL = new THREE.Mesh(irisGeo, irisMat);
    irisL.position.set(0, -0.005, 0.073);
    eyeLeftGroup.add(irisL);
    const irisR = irisL.clone();
    eyeRightGroup.add(irisR);

    const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
    pupilL.position.set(0, -0.006, 0.1);
    eyeLeftGroup.add(pupilL);
    const pupilR = pupilL.clone();
    eyeRightGroup.add(pupilR);

    const eyelidMat = new THREE.MeshStandardMaterial({ color: '#dcb89d', roughness: 0.75, metalness: 0.01 });
    const eyelidL = new THREE.Mesh(new THREE.SphereGeometry(0.084, 14, 14, 0, Math.PI * 2, 0, Math.PI / 1.95), eyelidMat);
    eyelidL.position.set(0, 0.021, 0.02);
    eyeLeftGroup.add(eyelidL);
    const eyelidR = eyelidL.clone();
    eyeRightGroup.add(eyelidR);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), skinMat);
    nose.scale.set(0.82, 1.1, 0.68);
    nose.position.set(0, -0.04, 0.435);
    headGroup.add(nose);

    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.011, 8, 24, Math.PI), detailMat);
    mouth.rotation.set(Math.PI, 0, 0);
    mouth.position.set(0, -0.2, 0.385);
    headGroup.add(mouth);

    const shoulderLeft = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), shirtMat);
    shoulderLeft.position.set(-0.53, 0.72, 0);
    bodyPivot.add(shoulderLeft);
    const shoulderRight = shoulderLeft.clone();
    shoulderRight.position.x = 0.53;
    bodyPivot.add(shoulderRight);

    const armLeftGroup = new THREE.Group();
    armLeftGroup.position.set(-0.57, 0.62, 0.02);
    bodyPivot.add(armLeftGroup);
    const armRightGroup = new THREE.Group();
    armRightGroup.position.set(0.57, 0.62, 0.02);
    bodyPivot.add(armRightGroup);

    const upperArmGeo = new THREE.CapsuleGeometry(0.092, 0.33, 4, 12);
    const lowerArmGeo = new THREE.CapsuleGeometry(0.083, 0.29, 4, 10);
    const handGeo = new THREE.SphereGeometry(0.105, 14, 14);

    const upperArmL = new THREE.Mesh(upperArmGeo, shirtMat);
    upperArmL.rotation.z = Math.PI / 2;
    armLeftGroup.add(upperArmL);
    const upperArmR = upperArmL.clone();
    armRightGroup.add(upperArmR);

    const forearmL = new THREE.Mesh(lowerArmGeo, shirtMat);
    forearmL.rotation.z = Math.PI / 2;
    forearmL.position.set(-0.35, -0.055, 0);
    armLeftGroup.add(forearmL);
    const forearmR = forearmL.clone();
    forearmR.position.x = 0.36;
    armRightGroup.add(forearmR);

    const handL = new THREE.Mesh(handGeo, skinMat);
    handL.position.set(-0.57, -0.07, 0.03);
    armLeftGroup.add(handL);
    const handR = handL.clone();
    handR.position.x = 0.58;
    armRightGroup.add(handR);

    const hip = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.28, 0.38), pantsMat);
    hip.position.set(0, -0.35, 0.02);
    bodyPivot.add(hip);

    const legGeo = new THREE.CapsuleGeometry(0.112, 0.66, 6, 12);
    const legLeft = new THREE.Mesh(legGeo, pantsMat);
    legLeft.position.set(-0.2, -0.77, 0.02);
    legLeft.rotation.z = 0.035;
    bodyPivot.add(legLeft);
    const legRight = legLeft.clone();
    legRight.position.x = 0.2;
    legRight.rotation.z = -0.035;
    bodyPivot.add(legRight);

    const shoeGeo = new THREE.BoxGeometry(0.38, 0.16, 0.66);
    const soleGeo = new THREE.BoxGeometry(0.37, 0.07, 0.66);
    const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
    shoeL.position.set(-0.2, -1.24, 0.11);
    bodyPivot.add(shoeL);
    const shoeR = shoeL.clone();
    shoeR.position.x = 0.2;
    bodyPivot.add(shoeR);

    const soleL = new THREE.Mesh(soleGeo, soleMat);
    soleL.position.set(-0.2, -1.325, 0.11);
    bodyPivot.add(soleL);
    const soleR = soleL.clone();
    soleR.position.x = 0.2;
    bodyPivot.add(soleR);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.72, 52),
      new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.14 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.38;
    scene.add(floor);

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

    let frame = 0;
    let lastFrameTime = performance.now();
    let elapsed = 0;
    const blinkState = { timer: 1.5, value: 1 };
    const animate = () => {
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
      lastFrameTime = now;
      elapsed += dt;
      const t = elapsed;
      const activeMode: BuddyMode =
        modeRef.current !== 'auto'
          ? modeRef.current
          : errorTextRef.current
            ? 'focus'
            : isBusyRef.current
              ? 'focus'
              : statusTextRef.current
                ? 'wave'
                : 'chill';

      bodyPivot.position.y = Math.sin(t * 1.6) * 0.038;
      bodyPivot.rotation.z = Math.sin(t * 1.3) * 0.02;
      root.rotation.y += 0.0022 + (activeMode === 'chill' ? 0.0008 : 0.0014);
      floor.material.opacity = 0.1 + Math.sin(t * 1.5) * 0.04;

      headGroup.rotation.x += ((pointerY * 0.18) - headGroup.rotation.x) * 0.08;
      headGroup.rotation.y += ((pointerX * 0.3) - headGroup.rotation.y) * 0.08;
      eyeLeftGroup.rotation.x += ((-pointerY * 0.22) - eyeLeftGroup.rotation.x) * 0.14;
      eyeRightGroup.rotation.x += ((-pointerY * 0.22) - eyeRightGroup.rotation.x) * 0.14;
      eyeLeftGroup.rotation.y += ((pointerX * 0.28) - eyeLeftGroup.rotation.y) * 0.14;
      eyeRightGroup.rotation.y += ((pointerX * 0.28) - eyeRightGroup.rotation.y) * 0.14;

      if (activeMode === 'wave') {
        armRightGroup.rotation.z = -0.32 + Math.sin(t * 5.8) * 0.86;
        armRightGroup.rotation.x = -0.08 + Math.cos(t * 5.8) * 0.08;
        armLeftGroup.rotation.z = 0.06 + Math.sin(t * 2.2) * 0.1;
        mouth.scale.x = 1.18;
        mouth.scale.y = 1;
      } else if (activeMode === 'focus') {
        armRightGroup.rotation.z = -0.18 + Math.sin(t * 3.2) * 0.12;
        armLeftGroup.rotation.z = 0.18 + Math.cos(t * 3.1) * 0.12;
        armRightGroup.rotation.x = 0.06;
        armLeftGroup.rotation.x = 0.06;
        headGroup.rotation.x += 0.07;
        mouth.scale.x = 0.95;
        mouth.scale.y = 0.78;
      } else if (activeMode === 'chill') {
        armRightGroup.rotation.z = Math.sin(t * 2.1) * 0.14;
        armLeftGroup.rotation.z = -Math.sin(t * 2.1) * 0.14;
        armRightGroup.rotation.x = 0;
        armLeftGroup.rotation.x = 0;
        mouth.scale.x = 1.04;
        mouth.scale.y = 0.9;
      }

      if (errorTextRef.current) {
        headGroup.rotation.y += Math.sin(t * 16) * 0.027;
        browL.position.y = 0.06;
        browR.position.y = 0.06;
      } else {
        browL.position.y = 0.09;
        browR.position.y = 0.09;
      }

      blinkState.timer -= dt;
      if (blinkState.timer <= 0) {
        blinkState.value = Math.max(0.12, blinkState.value - dt * 9.2);
        if (blinkState.value <= 0.13) {
          blinkState.timer = 0.08;
          blinkState.value = 1.02;
        }
      }
      if (blinkState.timer > 0 && blinkState.value > 1) {
        blinkState.timer -= dt * 2;
      }
      const eyelidOpen = THREE.MathUtils.clamp(blinkState.value, 0.16, 1);
      eyelidL.scale.y = 1 / eyelidOpen;
      eyelidR.scale.y = 1 / eyelidOpen;
      if (blinkState.timer < -2.4) {
        blinkState.timer = 1.8 + Math.random() * 1.8;
        blinkState.value = 1;
      }

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => mat.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      shirtTexture.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="profile-buddy-shell">
      <div ref={hostRef} className="profile-buddy-canvas" aria-hidden="true" />
      <p className="profile-buddy-name">Kuldip</p>
      <p className="profile-buddy-state">{actionLabel}</p>
      <div className="profile-buddy-controls">
        <button type="button" className="profile-buddy-btn" onClick={() => setMode('auto')}>
          Auto
        </button>
        <button type="button" className="profile-buddy-btn" onClick={() => setMode('wave')}>
          Wave
        </button>
        <button type="button" className="profile-buddy-btn" onClick={() => setMode('focus')}>
          Focus
        </button>
        <button type="button" className="profile-buddy-btn" onClick={() => setMode('chill')}>
          Chill
        </button>
      </div>
    </div>
  );
}

