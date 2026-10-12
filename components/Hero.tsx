'use client';

import { useCallback, useRef } from 'react';
import { heroSpin, useDragSpin } from '@/lib/dragSpin';
import { startFilm } from '@/components/FilmTour';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const pick = useCallback(() => heroSpin, []);
  useDragSpin(ref, pick);

  return (
    <section
      ref={ref}
      id="overview"
      className="h-svh w-full flex flex-col items-center justify-center text-center relative px-4 touch-pan-y select-none cursor-grab data-[dragging]:cursor-grabbing"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030303] z-[-1]" />

      <p className="hero-in sg-eyebrow mb-4 md:mb-6 !text-[0.65rem] md:!text-xs" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.9))' }}>
        Galaxy AI is here
      </p>

      <h1
        className="hero-in hero-in--2 sg-title text-[15vw] md:text-[9vw]"
        style={{ filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.9)) drop-shadow(0px 4px 10px rgba(0,0,0,1))' }}
      >
        Galaxy S26 <strong>Ultra</strong>
      </h1>

      <p
        className="hero-in hero-in--3 mt-4 md:mt-6 text-base md:text-2xl font-light text-white/70"
        style={{ filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.9))' }}
      >
        Meet the most <span className="sg-ai font-semibold">intelligent Ultra.</span>
      </p>

      <button onClick={startFilm} className="hero-in hero-in--4 sg-btn mt-7 md:mt-9 inline-flex items-center gap-2.5">
        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
          <path d="M3 1.5v11l9.5-5.5z" fill="currentColor" />
        </svg>
        Watch the film
      </button>

      <div className="hero-in hero-in--4 absolute bottom-8 md:bottom-10 flex flex-col items-center gap-3 text-white/50">
        <span className="sg-eyebrow !text-[0.65rem]">Drag to spin · Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}