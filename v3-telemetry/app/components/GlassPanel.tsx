'use client';

import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}

export default function GlassPanel({ children, accent = false, className = '' }: GlassPanelProps) {
  return (
    <div
      className={`rounded-lg backdrop-blur-[2px] ${
        accent ? 'bg-black/30 border-l-2 border-accent/50' : 'bg-black/20'
      } ${className}`}
    >
      {children}
    </div>
  );
}
