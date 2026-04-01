'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';

import type { Project } from '@/lib/types';

const variants = [
  { key: 'overview', label: 'Overview' },
  { key: 'impact', label: 'Impact' },
  { key: 'stack', label: 'Stack' }
] as const;

export const ProjectGallery = ({ project }: { project: Project }) => {
  const [active, setActive] = useState<(typeof variants)[number]['key']>('overview');
  const shouldReduceMotion = useReducedMotion();

  const content = useMemo(() => {
    if (active === 'overview') {
      return (
        <div className="flex h-[280px] flex-col justify-center gap-4 border border-[#003d0f] bg-[#0a0f0a] p-8 md:h-[360px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#006622]">{'// Project Overview'}</p>
          <h2 className="font-mono text-2xl font-bold uppercase tracking-wide text-[#00ff41] md:text-4xl" style={{ textShadow: '0 0 12px rgba(0,255,65,0.3)' }}>{project.title}</h2>
          <p className="max-w-2xl font-mono text-xs text-[#006622]">{project.summary}</p>
        </div>
      );
    }

    if (active === 'impact') {
      return (
        <div className="flex h-[280px] flex-col justify-center gap-3 border border-[#003d0f] bg-[#0a0f0a] p-8 text-center md:h-[360px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#006622]">{'// Impact'}</p>
          <p className="font-mono text-lg font-bold text-[#00ff41] md:text-2xl">{project.impactMetric}</p>
          <p className="font-mono text-xs text-[#006622]">Measured outcome reported in this case study.</p>
        </div>
      );
    }

    return (
      <div className="flex h-[280px] flex-col justify-center gap-4 border border-[#003d0f] bg-[#0a0f0a] p-8 md:h-[360px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#006622]">{'// Core Stack'}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <span
              key={item}
              className="border border-[#003d0f] px-2.5 py-1 font-mono text-xs text-[#006622]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }, [active, project]);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {variants.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`focus-ring border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              active === tab.key
                ? 'border-[#00ff41] bg-[#003d0f] text-[#00ff41]'
                : 'border-[#003d0f] text-[#006622] hover:border-[#00ff41]/50 hover:text-[#00cc33]'
            }`}
            onClick={() => setActive(tab.key)}
          >
            [{tab.label}]
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
