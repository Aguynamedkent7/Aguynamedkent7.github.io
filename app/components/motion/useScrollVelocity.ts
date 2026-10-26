'use client';

import { useEffect, useRef } from 'react';

/**
 * Smoothed scroll speed in 0..1, read from `.current` inside an animation loop.
 * Updated per frame from window.scrollY, so it works with or without Lenis.
 */
export function useScrollVelocity() {
  const vel = useRef(0);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const loop = () => {
      const y = window.scrollY;
      vel.current += (Math.min(Math.abs(y - last), 140) / 140 - vel.current) * 0.1;
      vel.current *= 0.95;
      last = y;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return vel;
}
