'use client';

import { useState, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import ReplayBackground from './components/ReplayBackground';
import BroadcastHeader from './components/BroadcastHeader';
import DriverCard from './components/DriverCard';
import TrackMap from './components/TrackMap';
import TelemetryPanel from './components/TelemetryPanel';
import ContactSection from './components/ContactSection';
import SectionTransition from './components/SectionTransition';
import type { SectionId } from './data';

useGLTF.preload('/carrera-gt/scene.gltf');

const sections = [
  { id: 'home' as SectionId, label: 'Profile' },
  { id: 'career' as SectionId, label: 'Career' },
  { id: 'telemetry' as SectionId, label: 'Telemetry' },
  { id: 'contact' as SectionId, label: 'Contact' },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [pov, setPOV] = useState('ONBOARD');

  const handleScrubChange = useCallback((scrubbing: boolean) => {
    setIsScrubbing(scrubbing);
  }, []);

  const handlePOVChange = useCallback((p: string) => {
    setPOV(p);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-void text-white selection:bg-accent/30">
      {/* Replay / Showroom background */}
      <ReplayBackground
        activeSection={activeSection}
        onScrubChange={handleScrubChange}
        onPOVChange={handlePOVChange}
      />

      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

      {/* Header */}
      <BroadcastHeader
        activeSection={activeSection}
        onNavigate={setActiveSection}
        pov={pov}
        isScrubbing={isScrubbing}
      />

      {/* Content area */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center p-6 md:p-16 pt-16 pb-20">
        <div className="pointer-events-auto w-full max-w-4xl max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          <SectionTransition activeKey={activeSection}>
            {activeSection === 'home' && <DriverCard />}
            {activeSection === 'career' && <TrackMap />}
            {activeSection === 'telemetry' && <TelemetryPanel />}
            {activeSection === 'contact' && <ContactSection />}
          </SectionTransition>
        </div>
      </div>

      {/* Bottom navigation pills */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="glass flex items-center gap-1 p-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] transition-all ${
                activeSection === s.id
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer status bar */}
      <footer className="fixed bottom-4 left-4 z-40 pointer-events-none hidden md:flex items-center gap-2 font-mono text-[10px] text-muted/50 uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-pulse" />
        System Online
      </footer>
    </main>
  );
}
