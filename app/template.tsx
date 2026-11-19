'use client';

import { motion, useReducedMotion } from 'framer-motion';

import type { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  // Same element on server and client (avoids a hydration mismatch); only the animation is switched off.
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
