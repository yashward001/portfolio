'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

export const HeroGlow = () => {
  const shouldReduceMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 50, y: 30 });

  if (shouldReduceMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      onPointerMove={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        setPosition({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100
        });
      }}
    >
      <motion.div
        className="absolute h-72 w-72 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(0,255,65,0.12) 0%, transparent 70%)' }}
        animate={{ left: `calc(${position.x}% - 9rem)`, top: `calc(${position.y}% - 9rem)` }}
        transition={{ type: 'spring', stiffness: 80, damping: 20, mass: 0.4 }}
      />
    </div>
  );
};
