'use client';

import { ArrowLeft, FileText, Mail } from 'lucide-react';

import { type SectionId } from '../data';

interface BroadcastHeaderProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  pov: string;
  isScrubbing: boolean;
}

const sectionLabels: Record<SectionId, string> = {
  home: 'Profile',
  career: 'Career',
  telemetry: 'Telemetry',
  contact: 'Contact',
};

export default function BroadcastHeader({
  activeSection,
  onNavigate,
  pov,
  isScrubbing,
}: BroadcastHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-4 md:px-8 border-b border-white/10 bg-black/60 backdrop-blur-md">
      {/* Left: back arrow + section title + replay badge */}
      <div className="flex items-center gap-3">
        {activeSection !== 'home' && (
          <button
            onClick={() => onNavigate('home')}
            className="text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
          Session:{' '}
          <span className="text-accent">{sectionLabels[activeSection]}</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-accent/20 bg-accent/5 font-mono text-[9px] uppercase tracking-wider text-accent/70">
          REPLAY: {pov}
        </span>
        {isScrubbing && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-yellow-500/30 bg-yellow-500/10 font-mono text-[9px] uppercase tracking-wider text-yellow-400">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            SYNCING SATELLITE
          </span>
        )}
      </div>

      {/* Right: utility pills */}
      <div className="flex items-center gap-2">
        <a
          href="#"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-xs font-mono uppercase tracking-wider text-muted hover:text-white hover:border-accent/30 hover:bg-accent/5 transition-all"
        >
          <FileText className="w-3 h-3" />
          Resume
        </a>
        <button
          onClick={() => onNavigate('contact')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-xs font-mono uppercase tracking-wider text-accent hover:bg-accent/10 transition-all"
        >
          <Mail className="w-3 h-3" />
          Contact
        </button>
      </div>
    </header>
  );
}
