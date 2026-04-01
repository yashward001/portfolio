'use client';

import { useReducedMotion } from 'framer-motion';

export const SignatureGrid = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.28)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.28)_1px,transparent_1px)] bg-[size:52px_52px] opacity-40" />
      <div className="absolute inset-0 animate-grid-shift bg-[linear-gradient(to_right,hsl(var(--accent)/0.12)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--accent)/0.12)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="grid-noise absolute inset-0" />
    </div>
  );
};
