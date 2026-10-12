'use client';

import { useEffect } from 'react';

export default function AmbientPause() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) el.dataset.live = '1';
          else delete el.dataset.live;
        }),
      { rootMargin: '10% 0px' }
    );
    document.querySelectorAll('.sg-ambient').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
