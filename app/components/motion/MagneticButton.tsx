'use client';

import type { PointerEvent, ReactNode } from 'react';

/** Link that pulls toward the mouse. Mouse only; CSS turns it off for reduced motion. */
export default function MagneticButton({ href, className = '', children }: {
  href: string; className?: string; children: ReactNode;
}) {
  const move = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.classList.add('live');
    el.style.translate = `${(dx * 0.12).toFixed(1)}px ${(dy * 0.3).toFixed(1)}px`;
  };
  const leave = (e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.classList.remove('live');
    e.currentTarget.style.translate = '';
  };
  return (
    <a href={href} className={`magnet ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </a>
  );
}
