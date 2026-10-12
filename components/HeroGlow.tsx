'use client';

import { useEffect, useRef } from 'react';

export default function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const t = Math.min(1, window.scrollY / (window.innerHeight * 0.8));
      el.style.opacity = String(1 - t);
      el.style.visibility = t >= 1 ? 'hidden' : 'visible';
      const glow = el.firstElementChild as HTMLElement | null;
      if (glow) {
        if (t < 1) glow.dataset.live = '1';
        else delete glow.dataset.live;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="hero-glow absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[min(110vw,900px)] aspect-square">
        <div className="hero-glow__halo absolute inset-[18%] rounded-full" />
        <div className="hero-glow__ring absolute inset-0 rounded-full" />
      </div>
    </div>
  );
}
