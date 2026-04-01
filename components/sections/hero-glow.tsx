'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

export const HeroGlow = () => {
  const shouldReduceMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 50, y: 30 });

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]"
      onPointerMove={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        setPosition({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100
        });
      }}
    >
      <motion.div
        className="absolute h-80 w-80 rounded-full bg-accent/30 blur-3xl"
        animate={{ left: `calc(${position.x}% - 10rem)`, top: `calc(${position.y}% - 10rem)` }}
        transition={{ type: 'spring', stiffness: 80, damping: 20, mass: 0.4 }}
      />
    </div>
  );
};
