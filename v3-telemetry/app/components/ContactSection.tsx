'use client';

import { Mail, MapPin } from 'lucide-react';
import GlassPanel from './GlassPanel';
import { resumeData } from '../data';

export default function ContactSection() {
  return (
    <div className="w-full max-w-xl mx-auto text-center space-y-8">
      <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight">
        Establish <span className="text-accent">Contact</span>
      </h2>

      <GlassPanel className="p-8 space-y-6">
        <a
          href={`mailto:${resumeData.home.email}`}
          className="flex items-center justify-center gap-3 text-white hover:text-accent transition-colors group"
        >
          <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <span className="font-mono text-sm tracking-wider uppercase">
            {resumeData.home.email}
          </span>
        </a>

        <div className="w-full h-px bg-white/5" />

        <div className="flex items-center justify-center gap-3 text-muted">
          <div className="p-2 rounded-lg bg-white/5">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <span className="font-mono text-sm tracking-wider uppercase">
            {resumeData.home.location}
          </span>
        </div>
      </GlassPanel>
    </div>
  );
}
