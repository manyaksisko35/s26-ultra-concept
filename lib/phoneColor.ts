import type * as THREE from 'three';

export type PhoneColor = {
  id: string;
  name: string;
  swatch: string;
  back: [number, number, number];
  frameGain: number;
  capsuleGain: number;
  glass: number;
};

export const PHONE_COLORS: PhoneColor[] = [
  { id: 'cobalt-violet', name: 'Cobalt Violet', swatch: '#686883', back: [0.117, 0.089, 0.14], frameGain: 1.0, capsuleGain: 1.7, glass: 1.0 },
  { id: 'black', name: 'Black', swatch: '#4a4d53', back: [0.05, 0.039, 0.041], frameGain: 1.0, capsuleGain: 2.0, glass: 1.0 },
  { id: 'sky-blue', name: 'Sky Blue', swatch: '#b2cbd9', back: [0.357, 0.499, 0.646], frameGain: 1.0, capsuleGain: 1.3, glass: 0.6 },
  { id: 'white', name: 'White', swatch: '#f3f5f7', back: [1.276, 1.117, 1.157], frameGain: 1.0, capsuleGain: 1.0, glass: 0.3 },
  { id: 'pink-gold', name: 'Pink Gold', swatch: '#e5c3b9', back: [1.793, 0.526, 0.418], frameGain: 1.0, capsuleGain: 1.1, glass: 0.5 },
];

export const PART_BY_MATERIAL: Record<string, 'back' | 'frame' | 'capsule' | 'glass'> = {
  PaletteMaterial007: 'back',
  Material_195: 'frame',
  Material_187: 'capsule',
  Material_181: 'glass',
};

export const FAN_COLORS: PhoneColor[] = PHONE_COLORS;
export const FAN_CENTER = FAN_COLORS.findIndex((c) => c.id === 'sky-blue');

const DEFAULT_ID = FAN_COLORS[FAN_CENTER].id;
let current = DEFAULT_ID;
const listeners = new Set<() => void>();

export const getColorId = () => current;
export const getServerColorId = () => DEFAULT_ID;

export const setColorId = (id: string) => {
  if (id === current || !PHONE_COLORS.some((c) => c.id === id)) return;
  current = id;
  listeners.forEach((l) => l());
};

export const subscribeColor = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export function applyPreset(root: THREE.Object3D, preset: PhoneColor) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => {
      const std = mat as THREE.MeshStandardMaterial;
      const part = PART_BY_MATERIAL[std.name];
      if (!part) return;
      if (part === 'glass') {
        std.opacity = preset.glass;
        return;
      }
      const k = part === 'frame' ? preset.frameGain : part === 'capsule' ? preset.capsuleGain : 1;
      std.color.setRGB(preset.back[0] * k, preset.back[1] * k, preset.back[2] * k);
      std.metalness = part === 'back' ? 0.1 : 0.2;
      std.roughness = part === 'back' ? 0.4 : 0.45;
    });
  });
}
