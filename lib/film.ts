'use client';

type FilmState = 'idle' | 'playing' | 'paused';

let state: FilmState = 'idle';
const listeners = new Set<() => void>();

export const getFilm = () => state;
export const getFilmServer = (): FilmState => 'idle';

export const setFilm = (next: FilmState) => {
  if (next === state) return;
  state = next;
  listeners.forEach((l) => l());
};

export const subscribeFilm = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
