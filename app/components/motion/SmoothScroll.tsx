'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** The running Lenis instance, or null with reduced motion / before mount. */
export const getLenis = () => lenis;

/** Lenis smooth scrolling synced to GSAP's ticker and ScrollTrigger. Mounted once in layout. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const l = new Lenis();
    lenis = l;
    l.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page anchors scroll through Lenis (which applies html's scroll-padding-top for the
    // fixed nav). force: the mobile menu stops Lenis while open, and its links close it.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]');
      const id = a?.getAttribute('href')?.slice(1);
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const el = id ? document.getElementById(id) : null;
      if (!el && id !== 'top') return;
      e.preventDefault();
      l.start();
      l.scrollTo(el ?? 0, { force: true });
      history.replaceState(null, '', `#${id}`);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      l.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
