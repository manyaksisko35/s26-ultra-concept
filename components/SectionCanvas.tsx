'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { setRequestFrame } from '@/lib/sectionCanvas';

const SECTION_IDS = ['steady', 'privacy', 'design', 'inside', 'build'];

function Bridge({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    setRequestFrame(() => invalidate());
    return () => setRequestFrame(() => {});
  }, [invalidate]);
  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);
  useFrame(({ gl }) => {
    gl.setScissorTest(false);
    gl.clear(true, true);
  }, 0);
  return null;
}

export default function SectionCanvas() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    let cancelIdle = () => {};
    const timer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(() => setMounted(true), { timeout: 3000 });
        cancelIdle = () => window.cancelIdleCallback(id);
      } else setMounted(true);
    }, 2500);
    const near = new Set<Element>();
    const mountIo = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setMounted(true), {
      rootMargin: '200% 0px',
    });
    const activeIo = new IntersectionObserver(
      (es) => {
        es.forEach((e) => (e.isIntersecting ? near.add(e.target) : near.delete(e.target)));
        setActive(near.size > 0);
      },
      { rootMargin: '50% 0px' }
    );
    els.forEach((el) => {
      mountIo.observe(el);
      activeIo.observe(el);
    });
    return () => {
      window.clearTimeout(timer);
      cancelIdle();
      mountIo.disconnect();
      activeIo.disconnect();
    };
  }, []);

  if (!mounted) return null;
  return (
    <Canvas
      frameloop={active ? 'demand' : 'never'}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
        visibility: active ? 'visible' : 'hidden',
      }}
    >
      <Bridge active={active} />
      <View.Port />
    </Canvas>
  );
}
