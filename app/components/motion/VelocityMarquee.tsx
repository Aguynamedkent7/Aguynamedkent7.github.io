'use client';

import { useEffect, useRef } from 'react';
import { useScrollVelocity } from './useScrollVelocity';

const COPIES = 3;

function Row({ words, off, rowRef }: {
  words: string[]; off: number; rowRef: (el: HTMLDivElement | null) => void;
}) {
  const cls = (i: number) => ['hot', 'out', ''][(i + off) % 3];
  return (
    <div className="marq" ref={rowRef} aria-hidden="true">
      {Array.from({ length: COPIES }, (_, k) =>
        words.map((w, i) => <span key={`${k}-${w}`} className={cls(i)}>{w}</span>))}
    </div>
  );
}

/** Two tech-stack rows moving in opposite directions; speed follows scroll velocity. */
export default function VelocityMarquee({ rows }: { rows: [string[], string[]] }) {
  const box = useRef<HTMLDivElement>(null);
  const r = useRef<(HTMLDivElement | null)[]>([]);
  const vel = useScrollVelocity();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const x = [0, 0];
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const step = 0.6 + vel.current * 10;
      r.current.forEach((el, i) => {
        if (!el) return;
        const w = el.scrollWidth / COPIES;
        if (!w) return;
        // Row 1 runs left in (-w, 0]; row 2 runs right in [-w, 0).
        x[i] = i === 0 ? (x[i] - step) % w : ((((x[i] + step) % w) + w) % w) - w;
        el.style.transform = `translate3d(${x[i].toFixed(1)}px,0,0)`;
      });
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(loop);
    });
    if (box.current) io.observe(box.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [vel]);

  return (
    <div ref={box} className="marq-box">
      {rows.map((words, i) => (
        <Row key={i} words={words} off={i} rowRef={(el) => { r.current[i] = el; }} />
      ))}
    </div>
  );
}
