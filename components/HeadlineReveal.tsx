'use client';

import { useEffect } from 'react';

const REVEAL_LINE = 0.85;

export default function HeadlineReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    root.classList.add('reveal-ready');

    let raf = 0;
    const check = () => {
      raf = 0;
      const pending = document.querySelectorAll<HTMLElement>('h2.sg-title:not([data-in])');
      if (pending.length === 0) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        return;
      }
      const line = window.innerHeight * REVEAL_LINE;
      pending.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < line && r.bottom > 0) el.dataset.in = '1';
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      root.classList.remove('reveal-ready');
    };
  }, []);
  return null;
}
