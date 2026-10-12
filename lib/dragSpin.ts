'use client';

import { useEffect, type RefObject } from 'react';
import * as THREE from 'three';

export type Spin = { yaw: number; pitch: number; vel: number; dragging: boolean };

export const createSpin = (): Spin => ({ yaw: 0, pitch: 0, vel: 0, dragging: false });

export const heroSpin = createSpin();

const YAW_PER_PX = 0.012;
const PITCH_PER_PX = 0.006;
const PITCH_MAX = 0.45;

export function useDragSpin(
  ref: RefObject<HTMLElement | null>,
  pick: (e: PointerEvent, el: HTMLElement) => Spin | null,
  onChange?: () => void
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let active: Spin | null = null;
    let id = -1;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if ((e.target as Element).closest?.('a,button,input,select,[role=dialog]')) return;
      active = pick(e, el);
      if (!active) return;
      id = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      active.dragging = true;
      active.vel = 0;
      el.setPointerCapture?.(e.pointerId);
      el.dataset.dragging = '';
      onChange?.();
    };
    const move = (e: PointerEvent) => {
      if (!active || e.pointerId !== id) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = Math.max(1, e.timeStamp - lastT);
      active.yaw += dx * YAW_PER_PX;
      if (e.pointerType === 'mouse') active.pitch = THREE.MathUtils.clamp(active.pitch + dy * PITCH_PER_PX, -PITCH_MAX, PITCH_MAX);
      active.vel = ((dx * YAW_PER_PX) / dt) * 1000;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      onChange?.();
    };
    const up = (e: PointerEvent) => {
      if (!active || e.pointerId !== id) return;
      active.dragging = false;
      if (e.timeStamp - lastT > 80) active.vel = 0;
      active = null;
      delete el.dataset.dragging;
      onChange?.();
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [ref, pick, onChange]);
}

export function stepSpin(s: Spin, dt: number) {
  if (s.dragging) return true;
  if (Math.abs(s.vel) > 0.3) {
    s.yaw += s.vel * dt;
    s.vel = THREE.MathUtils.damp(s.vel, 0, 3, dt);
  } else {
    s.vel = 0;
    const full = Math.PI * 2;
    const target = Math.round(s.yaw / full) * full;
    s.yaw = THREE.MathUtils.damp(s.yaw, target, 3.5, dt);
    if (Math.abs(s.yaw - target) < 0.0005) s.yaw = 0;
  }
  s.pitch = THREE.MathUtils.damp(s.pitch, 0, 3.5, dt);
  if (Math.abs(s.pitch) < 0.0005) s.pitch = 0;
  return s.vel !== 0 || s.yaw !== 0 || s.pitch !== 0;
}
