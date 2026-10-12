'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { getLenis } from '@/lib/lenis';
import { getFilm, getFilmServer, setFilm, subscribeFilm } from '@/lib/film';
import { sectionById, useActiveSection } from '@/lib/sections';
import { playSound } from '@/lib/sound';

const SPEED_VH = 0.6;
const RAMP_S = 1.2;

const endY = () => {
  const specs = document.getElementById('specs');
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return specs ? Math.min(max, specs.getBoundingClientRect().top + window.scrollY) : max;
};

const jumpTo = (y: number) => {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
};

export function startFilm() {
  playSound('tick');
  if (window.scrollY >= endY() - 4) jumpTo(0);
  setFilm('playing');
}

export default function FilmTour() {
  const film = useSyncExternalStore(subscribeFilm, getFilm, getFilmServer);
  const activeId = useActiveSection();
  const barRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (film !== 'playing') return;
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let y = window.scrollY;
    const tick = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      elapsed += dt;
      const ramp = Math.min(1, elapsed / RAMP_S);
      const end = endY();
      y = Math.min(end, y + window.innerHeight * SPEED_VH * dt * ramp * ramp);
      jumpTo(y);
      if (barRef.current) barRef.current.style.transform = `scaleX(${y / Math.max(1, end)})`;
      if (y >= end) {
        setFilm('idle');
        playSound('chime');
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const stop = (e: Event) => {
      if (boxRef.current?.contains(e.target as Node)) return;
      setFilm('paused');
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFilm('idle');
      else if (e.key === ' ') {
        e.preventDefault();
        setFilm('paused');
      } else if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) setFilm('paused');
    };
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', onKey);
    };
  }, [film]);

  useEffect(() => {
    if (film !== 'paused') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFilm('idle');
      else if (e.key === ' ') {
        e.preventDefault();
        setFilm('playing');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [film]);

  if (film === 'idle') return null;
  const playing = film === 'playing';

  return (
    <div
      ref={boxRef}
      role="region"
      aria-label="Film controls"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] w-[min(92vw,420px)] rounded-full border border-white/15 bg-black/80 pl-2 pr-2 py-2 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
    >
      <button
        onClick={() => {
          playSound('tick');
          setFilm(playing ? 'paused' : 'playing');
        }}
        aria-label={playing ? 'Pause film' : 'Resume film'}
        className="w-10 h-10 shrink-0 rounded-full bg-white text-black flex items-center justify-center"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <rect x="2" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
            <rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M3 1.5v11l9.5-5.5z" fill="currentColor" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/50 leading-none mb-1.5">{playing ? 'Now playing' : 'Paused'}</p>
        <p className="text-sm font-semibold truncate leading-none mb-2" aria-live="polite">
          {sectionById(activeId)?.label ?? 'Overview'}
        </p>
        <div className="h-0.5 bg-white/15 rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="h-full origin-left bg-gradient-to-r from-cyan-300 to-violet-400"
            style={{ transform: `scaleX(${typeof window === 'undefined' ? 0 : window.scrollY / Math.max(1, endY())})` }}
          />
        </div>
      </div>
      <button
        onClick={() => {
          playSound('tick');
          setFilm('idle');
        }}
        aria-label="Exit film"
        className="w-10 h-10 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
      >
        ✕
      </button>
    </div>
  );
}
