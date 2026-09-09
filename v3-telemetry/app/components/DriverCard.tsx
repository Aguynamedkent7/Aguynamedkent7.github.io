'use client';

import { MapPin } from 'lucide-react';
import GlassPanel from './GlassPanel';
import { resumeData } from '../data';

export default function DriverCard() {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
      {/* Left: Headshot placeholder */}
      <div className="relative shrink-0">
        <GlassPanel accent className="p-1 animate-glow-pulse">
          <div className="w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-[10px] bg-slate overflow-hidden flex items-center justify-center">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-display font-black text-accent/20 select-none">
              KV
            </span>
          </div>
        </GlassPanel>
        <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30">
          <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Open to Work
          </span>
        </div>
      </div>

      {/* Right: Info */}
      <div className="text-center lg:text-left">
        <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-8xl tracking-tight leading-none">
          {resumeData.home.name}
        </h1>

        <div className="flex flex-col sm:flex-row items-center lg:items-center gap-2 sm:gap-4 mt-4">
          <span className="font-mono text-sm uppercase tracking-[0.2em] text-accent">
            {resumeData.home.role}
          </span>
          <div className="hidden sm:block w-px h-4 bg-white/10" />
          <span className="flex items-center gap-1.5 text-sm text-muted font-mono uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            {resumeData.home.location}
          </span>
        </div>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted mx-auto lg:mx-0">
          {resumeData.home.description}
        </p>
      </div>
    </div>
  );
}
