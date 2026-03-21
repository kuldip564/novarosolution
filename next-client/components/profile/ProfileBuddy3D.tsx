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

  const actionLabel = useMemo(() => {
    if (mode !== 'auto') return `Mode: ${mode}`;
    if (errorText) return 'Mood: alert';
    if (isBusy) return 'Mood: working';
    if (statusText) return 'Mood: happy';
    return 'Mood: idle';
  }, [mode, errorText, isBusy, statusText]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 1, 5.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight('#e0f2fe', '#1f2937', 0.78);
    scene.add(hemi);
    const key = new THREE.DirectionalLight('#ffffff', 1.25);
    key.position.set(2.8, 4.4, 3);
    const rim = new THREE.PointLight('#60a5fa', 0.92, 18);
    rim.position.set(-2.5, 1.6, -1.8);
    scene.add(key, rim);

    const root = new THREE.Group();
    scene.add(root);

    const shirtCanvas = document.createElement('canvas');
    shirtCanvas.width = 64;
    shirtCanvas.height = 64;
    const shirtCtx = shirtCanvas.getContext('2d');
    if (shirtCtx) {
      shirtCtx.fillStyle = '#ddcfbf';
      shirtCtx.fillRect(0, 0, 64, 64);
      shirtCtx.fillStyle = '#b08a6c';
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

    const shirtMat = new THREE.MeshToonMaterial({ map: shirtTexture });
    const skinMat = new THREE.MeshToonMaterial({ color: '#f7d5ba' });
    const hairMat = new THREE.MeshToonMaterial({ color: '#2b1e1a' });
    const beardMat = new THREE.MeshToonMaterial({ color: '#1f1713' });
    const pantsMat = new THREE.MeshToonMaterial({ color: '#4b5563' });
    const shoeMat = new THREE.MeshToonMaterial({ color: '#262b35' });
    const soleMat = new THREE.MeshToonMaterial({ color: '#e5e7eb' });
    const detailMat = new THREE.MeshToonMaterial({ color: '#111827' });

    const bodyPivot = new THREE.Group();
    bodyPivot.position.y = 0.12;
    root.add(bodyPivot);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.35, 0.5), shirtMat);
    torso.position.y = 0.32;
    bodyPivot.add(torso);

    const innerShirt = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.24, 0.06), new THREE.MeshToonMaterial({ color: '#d8c5b0' }));
    innerShirt.position.set(0, 0.34, 0.28);
    bodyPivot.add(innerShirt);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.16, 14), skinMat);
    neck.position.set(0, 1.05, 0.02);
    bodyPivot.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.32, 0.08);
    bodyPivot.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 34, 34), skinMat);
    head.scale.set(1, 1.08, 0.94);
    headGroup.add(head);

    const earGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const earL = new THREE.Mesh(earGeo, skinMat);
    earL.position.set(-0.47, -0.02, 0);
    headGroup.add(earL);
    const earR = earL.clone();
    earR.position.x = 0.47;
    headGroup.add(earR);

    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.43, 24, 24), hairMat);
    hairTop.scale.set(1.05, 0.54, 0.96);
    hairTop.position.y = 0.24;
    headGroup.add(hairTop);

    const hairFrontGroup = new THREE.Group();
    hairFrontGroup.position.set(0, 0.26, 0.28);
    headGroup.add(hairFrontGroup);
    for (let i = 0; i < 5; i += 1) {
      const lock = new THREE.Mesh(new THREE.SphereGeometry(0.075 + i * 0.008, 12, 12), hairMat);
      lock.position.set(-0.2 + i * 0.1, -0.04 - Math.abs(2 - i) * 0.018, 0);
      hairFrontGroup.add(lock);
    }

    const beard = new THREE.Mesh(new THREE.SphereGeometry(0.29, 22, 22), beardMat);
    beard.scale.set(1.02, 0.72, 0.9);
    beard.position.set(0, -0.16, 0.17);
    headGroup.add(beard);

    const browGeo = new THREE.BoxGeometry(0.14, 0.026, 0.02);
    const browL = new THREE.Mesh(browGeo, detailMat);
    browL.position.set(-0.14, 0.09, 0.4);
    browL.rotation.z = 0.08;
    headGroup.add(browL);
    const browR = browL.clone();
    browR.position.x = 0.14;
    browR.rotation.z = -0.08;
    headGroup.add(browR);

    const eyeWhiteMat = new THREE.MeshToonMaterial({ color: '#ffffff' });
    const irisMat = new THREE.MeshToonMaterial({ color: '#4b2a18' });
    const pupilMat = detailMat;
    const eyeWhiteGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const irisGeo = new THREE.SphereGeometry(0.043, 12, 12);
    const pupilGeo = new THREE.SphereGeometry(0.019, 10, 10);

    const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeL.position.set(-0.14, 0.01, 0.41);
    headGroup.add(eyeL);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.14;
    headGroup.add(eyeR);

    const irisL = new THREE.Mesh(irisGeo, irisMat);
    irisL.position.set(-0.14, 0.006, 0.48);
    headGroup.add(irisL);
    const irisR = irisL.clone();
    irisR.position.x = 0.14;
    headGroup.add(irisR);

    const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
    pupilL.position.set(-0.14, 0.005, 0.515);
    headGroup.add(pupilL);
    const pupilR = pupilL.clone();
    pupilR.position.x = 0.14;
    headGroup.add(pupilR);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), skinMat);
    nose.scale.set(1, 0.84, 0.9);
    nose.position.set(0, -0.06, 0.46);
    headGroup.add(nose);

    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 8, 22, Math.PI), detailMat);
    mouth.rotation.set(Math.PI, 0, 0);
    mouth.position.set(0, -0.18, 0.43);
    headGroup.add(mouth);

    const armLeftGroup = new THREE.Group();
    armLeftGroup.position.set(-0.66, 0.58, 0.04);
    bodyPivot.add(armLeftGroup);
    const armRightGroup = new THREE.Group();
    armRightGroup.position.set(0.66, 0.58, 0.04);
    bodyPivot.add(armRightGroup);

    const upperArmGeo = new THREE.CapsuleGeometry(0.1, 0.34, 4, 10);
    const lowerArmGeo = new THREE.CapsuleGeometry(0.09, 0.28, 4, 10);
    const handGeo = new THREE.SphereGeometry(0.11, 14, 14);

    const upperArmL = new THREE.Mesh(upperArmGeo, shirtMat);
    upperArmL.rotation.z = Math.PI / 2;
    armLeftGroup.add(upperArmL);
    const upperArmR = upperArmL.clone();
    armRightGroup.add(upperArmR);

    const forearmL = new THREE.Mesh(lowerArmGeo, shirtMat);
    forearmL.rotation.z = Math.PI / 2;
    forearmL.position.set(-0.36, -0.06, 0);
    armLeftGroup.add(forearmL);
    const forearmR = forearmL.clone();
    forearmR.position.x = 0.36;
    armRightGroup.add(forearmR);

    const handL = new THREE.Mesh(handGeo, skinMat);
    handL.position.set(-0.58, -0.07, 0.03);
    armLeftGroup.add(handL);
    const handR = handL.clone();
    handR.position.x = 0.58;
    armRightGroup.add(handR);

    const legGeo = new THREE.CapsuleGeometry(0.12, 0.68, 6, 10);
    const legLeft = new THREE.Mesh(legGeo, pantsMat);
    legLeft.position.set(-0.24, -0.64, 0.03);
    legLeft.rotation.z = 0.03;
    bodyPivot.add(legLeft);
    const legRight = legLeft.clone();
    legRight.position.x = 0.23;
    legRight.rotation.z = -0.02;
    bodyPivot.add(legRight);

    const shoeGeo = new THREE.BoxGeometry(0.44, 0.16, 0.74);
    const soleGeo = new THREE.BoxGeometry(0.43, 0.08, 0.74);
    const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
    shoeL.position.set(-0.24, -1.14, 0.14);
    bodyPivot.add(shoeL);
    const shoeR = shoeL.clone();
    shoeR.position.x = 0.23;
    bodyPivot.add(shoeR);

    const soleL = new THREE.Mesh(soleGeo, soleMat);
    soleL.position.set(-0.24, -1.23, 0.14);
    bodyPivot.add(soleL);
    const soleR = soleL.clone();
    soleR.position.x = 0.23;
    bodyPivot.add(soleR);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.8, 48),
      new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.16 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.32;
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

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      const activeMode: BuddyMode =
        mode !== 'auto'
          ? mode
          : errorText
            ? 'focus'
            : isBusy
              ? 'focus'
              : statusText
                ? 'wave'
                : 'chill';

      bodyPivot.position.y = Math.sin(t * 1.3) * 0.05;
      root.rotation.y += 0.003 + (activeMode === 'chill' ? 0.001 : 0.002);
      floor.material.opacity = 0.12 + Math.sin(t * 1.4) * 0.06;

      headGroup.rotation.x += ((pointerY * 0.22) - headGroup.rotation.x) * 0.08;
      headGroup.rotation.y += ((pointerX * 0.35) - headGroup.rotation.y) * 0.08;
      irisL.position.x = -0.14 + pointerX * 0.018;
      irisR.position.x = 0.14 + pointerX * 0.018;
      pupilL.position.x = -0.14 + pointerX * 0.024;
      pupilR.position.x = 0.14 + pointerX * 0.024;
      irisL.position.y = 0.006 + pointerY * 0.012;
      irisR.position.y = 0.006 + pointerY * 0.012;
      pupilL.position.y = 0.005 + pointerY * 0.015;
      pupilR.position.y = 0.005 + pointerY * 0.015;

      if (activeMode === 'wave') {
        armRightGroup.rotation.z = -0.42 + Math.sin(t * 6) * 0.72;
        armLeftGroup.rotation.z = 0.06 + Math.sin(t * 2.2) * 0.11;
      } else if (activeMode === 'focus') {
        armRightGroup.rotation.z = -0.2 + Math.sin(t * 3.3) * 0.13;
        armLeftGroup.rotation.z = 0.2 + Math.cos(t * 3.1) * 0.13;
        headGroup.rotation.x += 0.08;
      } else if (activeMode === 'chill') {
        armRightGroup.rotation.z = Math.sin(t * 2.1) * 0.16;
        armLeftGroup.rotation.z = -Math.sin(t * 2.1) * 0.16;
      }

      if (errorText) {
        headGroup.rotation.y += Math.sin(t * 18) * 0.03;
      }

      mouth.scale.x = activeMode === 'wave' ? 1.14 : 1;
      mouth.scale.y = activeMode === 'focus' ? 0.86 : 1;

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      shirtTexture.dispose();
      shirtMat.dispose();
      skinMat.dispose();
      hairMat.dispose();
      beardMat.dispose();
      pantsMat.dispose();
      shoeMat.dispose();
      soleMat.dispose();
      detailMat.dispose();
      eyeWhiteMat.dispose();
      irisMat.dispose();
      torso.geometry.dispose();
      innerShirt.geometry.dispose();
      neck.geometry.dispose();
      head.geometry.dispose();
      earGeo.dispose();
      hairTop.geometry.dispose();
      beard.geometry.dispose();
      browGeo.dispose();
      eyeWhiteGeo.dispose();
      irisGeo.dispose();
      pupilGeo.dispose();
      nose.geometry.dispose();
      mouth.geometry.dispose();
      upperArmGeo.dispose();
      lowerArmGeo.dispose();
      handGeo.dispose();
      legGeo.dispose();
      shoeGeo.dispose();
      soleGeo.dispose();
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      host.removeChild(renderer.domElement);
    };
  }, [mode, errorText, isBusy, statusText]);

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

