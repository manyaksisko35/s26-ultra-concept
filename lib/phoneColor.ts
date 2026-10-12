import * as THREE from 'three';
import { requestFrame } from '@/lib/sectionCanvas';

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
  { id: 'silver', name: 'Silver', swatch: '#c4c6c9', back: [0.67, 0.55, 0.55], frameGain: 1.05, capsuleGain: 1.1, glass: 0.4 },
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

export const WALL_MATERIAL = 'Material_173';
const DEFAULT_WALL = 'sky-blue';
const walls = new Map<string, THREE.Texture | 'loading'>();
const waiting = new Map<string, Set<THREE.MeshStandardMaterial>>();
const wanted = new WeakMap<THREE.Material, string>();
let baseWall: THREE.Texture | null = null;

function setWallpaper(mat: THREE.MeshStandardMaterial, id: string) {
  baseWall ??= mat.emissiveMap;
  const base = baseWall;
  wanted.set(mat, id);
  if (!base) return;
  if (id === DEFAULT_WALL) {
    mat.emissiveMap = base;
    return;
  }
  const cached = walls.get(id);
  if (cached && cached !== 'loading') {
    mat.emissiveMap = cached;
    return;
  }
  if (!waiting.has(id)) waiting.set(id, new Set());
  waiting.get(id)!.add(mat);
  if (cached === 'loading') return;
  walls.set(id, 'loading');
  new THREE.TextureLoader().load(`/wallpapers/${id}.webp`, (tex) => {
    tex.flipY = base.flipY;
    tex.colorSpace = base.colorSpace;
    tex.channel = base.channel;
    tex.wrapS = base.wrapS;
    tex.wrapT = base.wrapT;
    tex.anisotropy = base.anisotropy;
    walls.set(id, tex);
    waiting.get(id)?.forEach((m) => {
      if (wanted.get(m) === id) m.emissiveMap = tex;
    });
    waiting.delete(id);
    requestFrame();
  });
}

export function applyPreset(root: THREE.Object3D, preset: PhoneColor) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => {
      const std = mat as THREE.MeshStandardMaterial;
      if (std.name === WALL_MATERIAL) {
        setWallpaper(std, preset.id);
        return;
      }
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
