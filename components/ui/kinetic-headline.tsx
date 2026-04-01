'use client';

import { motion, useReducedMotion } from 'framer-motion';

export const KineticHeadline = ({ text }: { text: string }) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <h1 className="max-w-4xl font-display text-4xl leading-tight sm:text-6xl">{text}</h1>;
  }

  return (
    <h1 className="flex max-w-4xl flex-wrap gap-x-[0.28em] font-display text-4xl leading-tight sm:text-6xl" aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.45,
            delay: 0.04 * index,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
};
