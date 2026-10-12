'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, useGLTF } from '@react-three/drei';
import { RimLight, StudioEnv } from '@/components/StudioEnv';
import { S25_HEIGHT_MM, S25_URL, S26_HEIGHT_MM, S26_URL, useNormalizedPhone } from '@/lib/phoneModel';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { createSpin, stepSpin, useDragSpin, type Spin } from '@/lib/dragSpin';
import * as THREE from 'three';
import { COMPARE_GAINS, COMPARE_ROWS } from '@/lib/compareSpecs';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

const progress = { p: 0 };
const zone = { top: 0.2, bottom: 0.5, label: 0.05 };
let requestFrame: () => void = () => {};
const spins = { left: createSpin(), right: createSpin() };

function FrameBridge({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    requestFrame = () => invalidate();
    return () => {
      requestFrame = () => {};
    };
  }, [invalidate]);
  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);
  return null;
}

function Phone({ url, side, heightMm, drag }: { url: string; side: -1 | 1; heightMm: number; drag: Spin }) {
  const obj = useNormalizedPhone(url);
  const ref = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();

  useFrame((_, rawDt) => {
    const g = ref.current;
    if (!g) return;
    const p = progress.p;
    const mobile = size.width < 1024;

    const zoneH = zone.bottom - zone.top - zone.label;
    const h = (mobile ? viewport.height * zoneH * 0.9 : viewport.height * 0.56) * (heightMm / S26_HEIGHT_MM);
    const tx = mobile ? viewport.width * 0.22 * side : viewport.width * 0.385 * side;
    const ty = mobile ? viewport.height * (0.5 - (zone.top + zoneH / 2)) : -viewport.height * 0.02;

    const enter = smooth(p / 0.25);
    const spin = smooth((p - 0.12) / 0.45);
    const x = tx + side * viewport.width * 0.4 * (1 - enter);
    const rotY = Math.PI * (1 - spin) - side * 0.3 * spin;
    const dt = Math.min(rawDt, 0.1);

    g.position.x = THREE.MathUtils.damp(g.position.x, x, 6, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, 6, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, rotY, 6, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, side * 0.04 * (1 - spin), 6, dt);
    const s = THREE.MathUtils.damp(g.scale.x, h, 6, dt);
    g.scale.setScalar(s);

    const spinning = stepSpin(drag, dt);
    if (spinRef.current) {
      spinRef.current.rotation.y = drag.yaw;
      spinRef.current.rotation.x = drag.pitch;
    }

    if (spinning || Math.abs(g.position.x - x) + Math.abs(g.rotation.y - rotY) + Math.abs(s - h) > 0.001) requestFrame();
  });

  return (
    <group ref={ref} scale={0.001} position={[side * 10, 0, 0]}>
      <group ref={spinRef}>
        <primitive object={obj} />
      </group>
    </group>
  );
}

export default function CompareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const deskLabelsRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [near, setNear] = useState(false);

  const pickSpin = useCallback((e: PointerEvent, el: HTMLElement) => {
    if (progress.p < 0.2) return null;
    const box = el.getBoundingClientRect();
    const fx = (e.clientX - box.left) / box.width;
    if (box.width < 1024) {
      const z = zoneRef.current?.getBoundingClientRect();
      if (!z || e.clientY < z.top || e.clientY > z.bottom) return null;
      return fx < 0.5 ? spins.left : spins.right;
    }
    if (fx < 0.3) return spins.left;
    if (fx > 0.7) return spins.right;
    return null;
  }, []);
  const kick = useCallback(() => requestFrame(), []);
  useDragSpin(stickyRef, pickSpin, kick);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mountIo = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), {
      rootMargin: '200% 0px',
    });
    const nearIo = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '25% 0px' });
    mountIo.observe(el);
    nearIo.observe(el);
    return () => {
      mountIo.disconnect();
      nearIo.disconnect();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastP = -1;
    const update = () => {
      raf = 0;
      const sec = sectionRef.current;
      if (!sec) return;
      const vh = window.innerHeight;
      const top = sec.getBoundingClientRect().top;
      const p = clamp01(-top / Math.max(1, sec.offsetHeight - vh));
      if (p === lastP) return;
      lastP = p;
      progress.p = p;
      requestFrame();

      const head = smooth((p + 0.05) / 0.2);
      if (headRef.current) {
        headRef.current.style.opacity = String(head);
        headRef.current.style.transform = `translateY(${(1 - head) * 30}px)`;
      }
      const labels = String(smooth((p - 0.35) / 0.15));
      if (labelsRef.current) labelsRef.current.style.opacity = labels;
      if (deskLabelsRef.current) deskLabelsRef.current.style.opacity = labels;

      const n = rowsRef.current.length;
      rowsRef.current.forEach((row, i) => {
        if (!row) return;
        const start = 0.3 + (i / n) * 0.5;
        const v = smooth((p - start) / 0.08);
        row.style.opacity = String(v);
        row.style.transform = `translateY(${(1 - v) * 16}px)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const measure = () => {
      const box = stickyRef.current?.getBoundingClientRect();
      const z = zoneRef.current?.getBoundingClientRect();
      const lb = labelsRef.current?.getBoundingClientRect();
      if (box && z && z.height > 0) {
        zone.top = (z.top - box.top) / box.height;
        zone.bottom = (z.bottom - box.top) / box.height;
        zone.label = (lb?.height ?? 0) / box.height;
      }
      const wrap = tableWrapRef.current;
      const table = tableRef.current;
      if (wrap && table) {
        const fit = Math.min(1, wrap.clientHeight / Math.max(1, table.scrollHeight));
        table.style.transform = fit < 1 ? `scale(${fit})` : '';
      }
      lastP = -1;
      onScroll();
    };
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    if (tableRef.current) ro.observe(tableRef.current);
    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} id="compare" className="relative z-10 w-full h-[350svh] bg-[#030303]">
      <div ref={stickyRef} className="sg-ambient amb-cyan sticky top-0 h-svh w-full overflow-hidden touch-pan-y">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />

        {mounted && (
          <Canvas
            frameloop={near ? 'demand' : 'never'}
            className="!absolute inset-0"
            onCreated={({ invalidate }) => invalidate()}
            camera={{ position: [0, 0, 6], fov: 35 }}
            dpr={[1, 1.25]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ pointerEvents: 'none' }}
          >
            <StudioEnv intensity={0.9} />
            <RimLight />
            <ambientLight intensity={1.4} />
            <directionalLight position={[5, 5, 5]} intensity={4} />
            <directionalLight position={[-5, -5, -5]} intensity={2.5} color="#06b6d4" />
            <directionalLight position={[0, -5, 10]} intensity={3} />
            <FrameBridge active={near} />
            <Suspense fallback={null}>
              <Phone url={S26_URL} side={-1} heightMm={S26_HEIGHT_MM} drag={spins.left} />
              <Phone url={S25_URL} side={1} heightMm={S25_HEIGHT_MM} drag={spins.right} />
              <Preload all />
            </Suspense>
          </Canvas>
        )}

        <div className="relative h-full flex flex-col items-center px-4 lg:px-0 pt-20 lg:pt-24 pb-4 lg:pb-6 pointer-events-none">
          <div ref={headRef} className="flex-none text-center opacity-0">
            <p className="sg-eyebrow mb-2 lg:mb-4">Compare</p>
            <h2 className="sg-title">
              <strong>S26 Ultra</strong> vs S25 Ultra
            </h2>
          </div>

          <div ref={zoneRef} className="lg:hidden flex-none w-full h-[clamp(130px,28svh,300px)] flex items-end">
            <div ref={labelsRef} className="w-full flex justify-between px-[4%] pt-1 opacity-0">
              <span className="w-1/2 text-center text-sm font-semibold">Galaxy S26 Ultra</span>
              <span className="w-1/2 text-center text-sm font-light text-white/60">Galaxy S25 Ultra</span>
            </div>
          </div>

          <div
            ref={deskLabelsRef}
            className="max-lg:hidden absolute inset-x-0 bottom-[4%] flex justify-between px-[2%] opacity-0"
          >
            <span className="w-[22%] text-center text-lg font-semibold">Galaxy S26 Ultra</span>
            <span className="w-[22%] text-center text-lg font-light text-white/60">Galaxy S25 Ultra</span>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 text-xs text-white/40">Drag a phone to spin it</span>
          </div>

          <div
            ref={tableWrapRef}
            className="flex-1 min-h-0 w-full max-w-[46vw] max-lg:max-w-full mt-3 lg:mt-6 overflow-hidden flex flex-col"
          >
            <div ref={tableRef} className="origin-top lg:my-auto">
              <div className="grid grid-cols-3 gap-1.5 lg:gap-2 mb-2 lg:mb-5">
                {COMPARE_GAINS.map((g, i) => (
                  <div
                    key={g.label}
                    ref={(el) => {
                      rowsRef.current[i] = el;
                    }}
                    className="sg-card !rounded-xl lg:!rounded-2xl px-1 py-1.5 lg:p-4 text-center opacity-0"
                  >
                    <p className="sg-ai text-lg lg:text-3xl font-semibold leading-tight">+{g.value}</p>
                    <p className="text-white/55 text-[0.6rem] lg:text-xs font-light leading-tight">{g.label}</p>
                  </div>
                ))}
              </div>

              <div className="max-lg:hidden grid grid-cols-[0.8fr_1fr_1fr] gap-x-3 text-xs pb-2 border-b border-white/10 sg-eyebrow !tracking-[0.15em]">
                <span />
                <span>S26 Ultra</span>
                <span>S25 Ultra</span>
              </div>
              <dl className="divide-y divide-white/10 max-lg:border-t max-lg:border-white/10">
                {COMPARE_ROWS.map((r, i) => (
                  <div
                    key={r.label}
                    ref={(el) => {
                      rowsRef.current[COMPARE_GAINS.length + i] = el;
                    }}
                    className="grid grid-cols-[0.8fr_1fr_1fr] gap-x-3 py-1.5 lg:py-2.5 text-[0.7rem] lg:text-sm opacity-0"
                  >
                    <dt className="text-white/45 font-light">{r.label}</dt>
                    <dd className={r.highlight ? 'font-semibold text-cyan-200' : 'font-medium'}>{r.s26}</dd>
                    <dd className="text-white/60 font-light">{r.s25}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

if (typeof window !== 'undefined') {
  const preload = () => useGLTF.preload(S25_URL);
  window.addEventListener(
    'load',
    () => ('requestIdleCallback' in window ? window.requestIdleCallback(preload, { timeout: 4000 }) : setTimeout(preload, 2000)),
    { once: true }
  );
}
