'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { ProjectCard } from '@/components/sections/project-card';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

type SortBy = 'recent' | 'impact';

export const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  const [tag, setTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const reduceMotion = useReducedMotion();

  // Most common tags first; only show tags used by 2+ projects so the bar stays short.
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) =>
      p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
    );
    return [...counts.entries()]
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([t]) => t);
  }, [projects]);

  const visible = useMemo(() => {
    const base = tag ? projects.filter((p) => p.tags.includes(tag)) : projects;
    return [...base].sort((a, b) =>
      sortBy === 'impact'
        ? b.sortImpact - a.sortImpact
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [projects, tag, sortBy]);

  const pill = (active: boolean) =>
    cn(
      'focus-ring whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition',
      active
        ? 'bg-fg text-white'
        : 'bg-card text-muted shadow-chip hover:text-fg'
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div
          role="group"
          aria-label="Filter by topic"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={tag === null}
            onClick={() => setTag(null)}
            className={pill(tag === null)}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tag === t}
              onClick={() => setTag(t)}
              className={pill(tag === t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div
          role="group"
          aria-label="Sort"
          className="flex shrink-0 rounded-full bg-card p-1 shadow-chip"
        >
          {(['recent', 'impact'] as SortBy[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={sortBy === s}
              onClick={() => setSortBy(s)}
              className={cn(
                'focus-ring rounded-full px-3 py-1 text-sm capitalize transition',
                sortBy === s
                  ? 'bg-bg font-medium text-fg'
                  : 'text-muted hover:text-fg'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} projects shown
      </p>

      <motion.ul layout={!reduceMotion} className="grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <motion.li
              key={project.slug}
              layout={!reduceMotion}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectCard project={project} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
};
