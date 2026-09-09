'use client';

import { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import RevealLines from './RevealLines';

interface SectionTransitionProps {
  activeKey: string;
  children: ReactNode;
}

export default function SectionTransition({ activeKey, children }: SectionTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeKey}
        className="relative w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <RevealLines />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
