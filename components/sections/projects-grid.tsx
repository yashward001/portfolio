'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import type { Project } from '@/lib/types';

import { ProjectCard } from './project-card';

type SortBy = 'recency' | 'impact';

export const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  const [activeTag, setActiveTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortBy>('recency');

  const tags = useMemo(
    () => ['All', ...new Set(projects.flatMap((project) => project.tags))],
    [projects]
  );

  const filtered = useMemo(() => {
    const withTag =
      activeTag === 'All' ? projects : projects.filter((project) => project.tags.includes(activeTag));

    return [...withTag].sort((a, b) => {
      if (sortBy === 'impact') {
        return b.sortImpact - a.sortImpact;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [activeTag, projects, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/70 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`focus-ring rounded-full border px-3 py-1 text-sm ${
                activeTag === tag
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-bg text-muted hover:text-fg'
              }`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          Sort
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
            className="focus-ring rounded-md border border-border bg-bg px-2 py-1 text-fg"
          >
            <option value="recency">Recency</option>
            <option value="impact">Impact</option>
          </select>
        </label>
      </div>

      <motion.div layout className="grid gap-6 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
