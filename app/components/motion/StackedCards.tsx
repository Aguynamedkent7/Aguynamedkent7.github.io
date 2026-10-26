'use client';

import { useEffect, useRef } from 'react';

type Item = { date: string; title: string; body: string };

/** Sticky experience cards; each one scales down and dims as the next covers it. */
export default function StackedCards({ items }: { items: Item[] }) {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const els = refs.current;
      for (let i = 0; i < els.length - 1; i++) {
        const a = els[i], b = els[i + 1];
        if (!a || !b) continue;
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const cover = Math.min(1, Math.max(0, (ra.bottom - rb.top) / ra.height));
        a.style.transform = cover ? `scale(${(1 - cover * 0.06).toFixed(4)})` : '';
        a.style.filter = cover ? `brightness(${(1 - cover * 0.4).toFixed(3)})` : '';
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="exp-stack">
      {items.map((e, i) => (
        <article
          key={e.title} ref={(el) => { refs.current[i] = el; }} className="exp-card"
          style={{ top: 110 + i * 22, background: `var(--e${i + 1})` }}
        >
          <div className="exp-side">
            <span className="exp-date">{e.date}</span>
            <span className="exp-num" aria-hidden="true">L{i + 1}</span>
          </div>
          <div className="exp-main">
            <h3 className="exp-title">{e.title}</h3>
            <p className="exp-text">{e.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
