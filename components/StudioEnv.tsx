'use client';

import { Environment, Lightformer } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { canvasTexture } from '@/lib/phoneModel';

export function StudioEnv({ intensity = 1 }: { intensity?: number }) {
  return (
    <Environment resolution={256} frames={1} environmentIntensity={intensity}>
      <Lightformer form="rect" intensity={3} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
      <Lightformer form="rect" intensity={2.4} position={[-5, 0.5, 1]} rotation-y={Math.PI / 2} scale={[2.5, 9, 1]} />
      <Lightformer form="rect" intensity={2.4} position={[5, 0.5, 1]} rotation-y={-Math.PI / 2} scale={[2.5, 9, 1]} />
      <Lightformer form="rect" intensity={0.8} position={[0, 0, 6]} rotation-y={Math.PI} scale={[8, 5, 1]} />
      <Lightformer form="ring" color="#67e8f9" intensity={1.6} position={[0, 0, -6]} scale={5} />
    </Environment>
  );
}

export function RimLight() {
  return <directionalLight position={[0, 2.5, -5]} intensity={2.6} color="#cfefff" />;
}

let shadowTex: THREE.Texture | null = null;
function getShadowTexture() {
  shadowTex ??= canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(0,0,0,0.85)');
    g.addColorStop(0.55, 'rgba(0,0,0,0.35)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
  return shadowTex;
}

export function SoftShadow({ y = -0.53, width = 0.8, depth = 0.32, opacity = 0.7 }) {
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: getShadowTexture(), transparent: true, depthWrite: false, opacity }),
    [opacity]
  );
  return (
    <mesh position={[0, y, 0]} rotation-x={-Math.PI / 2} scale={[width, depth, 1]} material={mat} renderOrder={-1}>
      <planeGeometry />
    </mesh>
  );
}
