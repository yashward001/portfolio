'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo, useRef, useState } from 'react';

import { TerminalProjectCard } from '@/components/ui/terminal-project-card';
import type { Project } from '@/lib/types';

type SortBy = 'recency' | 'impact';

/** Strip leading ls, --tag=, whitespace from raw input → bare query */
function parseQuery(raw: string): string {
  return raw
    .replace(/^ls\s+/i, '')
    .replace(/^--tag=/i, '')
    .trim()
    .toLowerCase();
}

/** Derive hint text + colour from the current state */
function getHint(
  raw: string,
  query: string,
  matched: boolean,
  allTags: string[],
): { text: string; colour: string } {
  const isHelp = query === '--help' || query === '-h';
  if (!raw) return { text: '↑ type a tag, press tab to complete', colour: '#2d5a2d' };
  if (isHelp) return { text: allTags.join(' · '), colour: '#2d5a2d' };
  if (!query) return { text: '↑ type a tag, press tab to complete', colour: '#2d5a2d' };
  if (matched) return { text: `--tag=${query}  ✓`, colour: '#2d5a2d' };
  return { text: `unknown tag "${query}" — try --help`, colour: '#4a1a1a' };
}

export const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy]           = useState<SortBy>('recency');
  const inputRef                      = useRef<HTMLInputElement>(null);

  const allTags = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tags))],
    [projects],
  );

  const query = parseQuery(filterQuery);
  const isHelp = query === '--help' || query === '-h';

  const filtered = useMemo(() => {
    const base = isHelp || !query
      ? projects
      : projects.filter((p) =>
          p.tags.some((t) => t.toLowerCase().includes(query)),
        );
    return [...base].sort((a, b) =>
      sortBy === 'impact'
        ? b.sortImpact - a.sortImpact
        : new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [query, isHelp, projects, sortBy]);

  const hasMatch = !query || isHelp || filtered.length > 0;

  const hint = getHint(filterQuery, query, hasMatch, allTags);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setFilterQuery('');
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        if (!query) return;
        const match = allTags.find((t) => t.toLowerCase().startsWith(query));
        if (match) setFilterQuery(match);
      }
    },
    [query, allTags],
  );

  return (
    <div className="space-y-6">
      {/* Filter / sort toolbar */}
      <div className="border border-[#003d0f] bg-[#0a0f0a] p-3">
        <p className="mb-2 font-mono text-[10px] text-[#006622]">
          root@yst:~/projects$ ls -la --filter
        </p>

        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          {/* Shell input */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] shrink-0">
                <span className="text-[#00ff41]">root@yst</span>
                <span className="text-[#4a6741]">:~/projects$</span>
              </span>
              <input
                ref={inputRef}
                type="text"
                spellCheck={false}
                autoComplete="off"
                placeholder="ls --tag=agentic-ai  (or --help)"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                onKeyDown={onKeyDown}
                className="bg-transparent border-none outline-none font-mono text-[11px] text-[#00ff41] caret-[#00ff41] placeholder:text-[#1a3a1a] w-full tracking-wide"
              />
            </div>
            <p
              className="mt-1 font-mono text-[9px] min-h-[14px] pl-[calc(7ch+0.5rem)] leading-none"
              style={{ color: hint.colour }}
            >
              {hint.text}
            </p>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#006622] shrink-0 md:pt-0.5">
            <span className="text-[#004d1a]">--sort=</span>
            {(['recency', 'impact'] as SortBy[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSortBy(s)}
                className={`focus-ring px-2 py-1 transition-colors ${
                  sortBy === s ? 'text-[#00ff41]' : 'text-[#006622] hover:text-[#33ff66]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards grid — hidden when --help is active */}
      {!isHelp && (
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
      )}
    </div>
  );
};
