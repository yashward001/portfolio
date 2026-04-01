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
        <div className="flex h-[320px] flex-col justify-center gap-4 rounded-2xl border border-border bg-card p-8 md:h-[420px]">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Project Overview</p>
          <h2 className="font-display text-3xl leading-tight md:text-5xl">{project.title}</h2>
          <p className="max-w-2xl text-sm text-muted">{project.summary}</p>
        </div>
      );
    }

    if (active === 'impact') {
      return (
        <div className="flex h-[320px] flex-col justify-center gap-3 rounded-2xl border border-border bg-card p-8 text-center md:h-[420px]">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Impact Metric</p>
          <p className="font-display text-3xl text-accent md:text-5xl">{project.impactMetric}</p>
          <p className="text-sm text-muted">Measured outcome reported in this case study.</p>
        </div>
      );
    }

    return (
      <div className="flex h-[320px] flex-col justify-center gap-4 rounded-2xl border border-border bg-card p-8 md:h-[420px]">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Core Stack</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <button
              key={item}
              type="button"
              className="focus-ring rounded-full border border-border bg-bg px-3 py-1 text-sm text-muted transition hover:border-accent/60 hover:text-fg"
            >
              {item}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted">Interactive stack chips for quick technology scanning.</p>
      </div>
    );
  }, [active, project]);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {variants.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`focus-ring rounded-full border px-3 py-1.5 text-sm ${
              active === tab.key ? 'border-accent bg-accent/15 text-fg' : 'border-border bg-card text-muted hover:text-fg'
            }`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
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
