import type Lenis from 'lenis';

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function scrollToId(id: string, offsetVh = 0) {
  const el = document.getElementById(id);
  if (!el) return;

  const target = el.getBoundingClientRect().top + window.scrollY + window.innerHeight * offsetVh;
  const dist = Math.abs(target - window.scrollY);
  const duration = Math.min(2.6, Math.max(1.1, 0.9 + dist / (window.innerHeight * 6)));

  if (instance) {
    instance.scrollTo(target, { duration });
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
}

export function getLenis() {
  return instance;
}
