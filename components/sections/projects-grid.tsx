'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { TerminalProjectCard } from '@/components/ui/terminal-project-card';
import type { Project } from '@/lib/types';

type SortBy = 'recency' | 'impact';

export const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  const [activeTag, setActiveTag] = useState<string>('All');
  const [sortBy, setSortBy]       = useState<SortBy>('recency');

  const tags = useMemo(
    () => ['All', ...new Set(projects.flatMap((p) => p.tags))],
    [projects]
  );

  const filtered = useMemo(() => {
    const withTag =
      activeTag === 'All' ? projects : projects.filter((p) => p.tags.includes(activeTag));
    return [...withTag].sort((a, b) =>
      sortBy === 'impact'
        ? b.sortImpact - a.sortImpact
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [activeTag, projects, sortBy]);

  return (
    <div className="space-y-6">
      {/* Filter / sort toolbar */}
      <div className="border border-[#003d0f] bg-[#0a0f0a] p-3">
        <p className="mb-2 font-mono text-[10px] text-[#006622]">
          root@yst:~/projects$ ls -la --filter
        </p>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`focus-ring border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  activeTag === tag
                    ? 'border-[#00ff41] bg-[#003d0f] text-[#00ff41]'
                    : 'border-[#003d0f] text-[#006622] hover:border-[#00ff41]/50 hover:text-[#00cc33]'
                }`}
              >
                [{tag}]
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-[#006622]">
            <span className="text-[#004d1a]">--sort=</span>
            {(['recency', 'impact'] as SortBy[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSortBy(s)}
                className={`focus-ring px-2 py-1 transition-colors ${
                  sortBy === s ? 'text-[#00ff41]' : 'text-[#006622] hover:text-[#00cc33]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div layout className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <TerminalProjectCard
                title={project.title}
                role={project.role}
                date={new Date(project.date).getFullYear().toString()}
                slug={project.slug}
                tags={project.tags}
                stack={project.stack}
                index={i}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
