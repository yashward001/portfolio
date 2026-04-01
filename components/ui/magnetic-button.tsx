'use client';

import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react';

import { ButtonLink } from '@/components/ui/button';

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const MagneticButton = ({ href, children, variant = 'primary' }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const x = useSpring(0, { stiffness: 180, damping: 15, mass: 0.2 });
  const y = useSpring(0, { stiffness: 180, damping: 15, mass: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = event.clientX - rect.left - rect.width / 2;
    const py = event.clientY - rect.top - rect.height / 2;
    x.set(px * 0.18);
    y.set(py * 0.18);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setRipple({ x: event.clientX - rect.left, y: event.clientY - rect.top, key: Date.now() });
  };

  return (
    <motion.div
      ref={ref}
      className="relative inline-block overflow-hidden rounded-xl"
      style={shouldReduceMotion ? undefined : { x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      <ButtonLink href={href} variant={variant} className="relative">
        {children}
      </ButtonLink>
      {ripple ? (
        <motion.span
          key={ripple.key}
          className="pointer-events-none absolute h-20 w-20 rounded-full bg-white/30"
          style={{ left: ripple.x - 40, top: ripple.y - 40 }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ) : null}
    </motion.div>
  );
};
