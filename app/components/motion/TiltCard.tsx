'use client';

import type { PointerEvent, ReactNode } from 'react';

/** Card that tilts toward the mouse with a soft glare. Mouse only; CSS turns it off for reduced motion. */
export default function TiltCard({ max = 9, className = '', children }: {
  max?: number; className?: string; children: ReactNode;
}) {
  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.classList.add('live');
    el.style.setProperty('--ry', `${((x - 0.5) * max).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
  };
  const leave = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.classList.remove('live');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };
  return (
    <article className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </article>
  );
}
