'use client';

import { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import RevealLines from './RevealLines';
import type { SectionId } from '../data';

interface SectionTransitionProps {
  activeKey: SectionId;
  children: ReactNode;
}

const sectionOrigin: Record<SectionId, { x: number; y: number }> = {
  home: { x: -40, y: 0 },
  career: { x: 40, y: 0 },
  telemetry: { x: 40, y: 20 },
  contact: { x: -40, y: -20 },
};

export default function SectionTransition({ activeKey, children }: SectionTransitionProps) {
  const origin = sectionOrigin[activeKey];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeKey}
        className="relative w-full p-4 md:p-6"
        initial={{ opacity: 0, x: origin.x, y: origin.y }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: -origin.x * 0.5, y: -origin.y * 0.5 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <RevealLines />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
