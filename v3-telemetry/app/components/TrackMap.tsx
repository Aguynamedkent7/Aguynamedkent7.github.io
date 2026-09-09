'use client';

import { motion } from 'framer-motion';
import GlassPanel from './GlassPanel';
import { resumeData } from '../data';

export default function TrackMap() {
  const milestones = resumeData.milestones;

  return (
    <div className="w-full">
      <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-8 lg:mb-12">
        Career <span className="text-accent">Trajectory</span>
      </h2>

      <div className="relative">
        {/* Vertical trace line */}
        <div className="absolute left-[19px] lg:left-1/2 top-0 bottom-0 w-px bg-accent/20">
          <motion.div
            className="absolute inset-0 bg-accent"
            style={{ transformOrigin: 'top' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>

        {/* Milestone nodes */}
        <div className="space-y-8 lg:space-y-12">
          {milestones.map((m, i) => (
            <motion.div
              key={m.id}
              className={`relative flex items-start gap-6 lg:gap-0 ${
                i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              }`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            >
              {/* Node dot */}
              <div className="absolute left-[15px] lg:left-1/2 lg:-translate-x-1/2 top-1 z-10">
                <div className="w-[9px] h-[9px] rounded-full bg-accent shadow-accent-glow" />
              </div>

              {/* Card */}
              <div
                className={`ml-12 lg:ml-0 lg:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:text-left'
                }`}
              >
                <GlassPanel className="p-5 hover:border-accent/20 hover:-translate-y-0.5 transition-all">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-1">
                    {m.period}
                  </p>
                  <h3 className="font-display font-bold text-lg text-white">{m.title}</h3>
                  <p className="font-mono text-xs text-muted mt-0.5">{m.org}</p>
                  <p className="text-sm text-muted/80 mt-2 leading-relaxed">{m.description}</p>
                </GlassPanel>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
