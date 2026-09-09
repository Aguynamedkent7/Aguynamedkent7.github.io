'use client';

import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}

export default function GlassPanel({ children, accent = false, className = '' }: GlassPanelProps) {
  return (
    <div className={`${accent ? 'glass-accent' : 'glass'} ${className}`}>
      {children}
    </div>
  );
}
