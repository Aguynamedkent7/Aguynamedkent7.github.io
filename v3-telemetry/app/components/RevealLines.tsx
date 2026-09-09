'use client';

import { motion } from 'framer-motion';

const BRACKET_SIZE = 40;
const BRACKET_THICKNESS = 2;
const INSET = '12%';

const corners = [
  { top: INSET, left: INSET, rotate: 0 },
  { top: INSET, right: INSET, rotate: 90 },
  { bottom: INSET, right: INSET, rotate: 180 },
  { bottom: INSET, left: INSET, rotate: 270 },
] as const;

export default function RevealLines() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.55, duration: 0.25, ease: 'easeIn' }}
    >
      {corners.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute glow-line"
          style={{
            ...pos,
            width: BRACKET_SIZE,
            height: BRACKET_SIZE,
            borderLeft: `${BRACKET_THICKNESS}px solid #00D4FF`,
            borderTop: `${BRACKET_THICKNESS}px solid #00D4FF`,
            transform: `rotate(${pos.rotate}deg)`,
            transformOrigin: 'top left',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
            delay: i * 0.03,
          }}
        />
      ))}
    </motion.div>
  );
}
