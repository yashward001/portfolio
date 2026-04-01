'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[70] h-0.5 origin-left"
      style={{
        background: '#00ff41',
        boxShadow: '0 0 8px #00ff41',
        ...(shouldReduceMotion ? undefined : { scaleX })
      }}
    />
  );
};
