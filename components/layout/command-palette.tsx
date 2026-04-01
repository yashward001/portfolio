'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Command, FileText, FolderGit2, Search } from 'lucide-react';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

type CommandItem = {
  title: string;
  href: string;
  type: 'project' | 'post' | 'page';
  meta?: string;
};

const iconByType = {
  project: FolderGit2,
  post: FileText,
  page: Search
} as const;

export const CommandPalette = ({ items }: { items: CommandItem[] }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isShortcut) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const base = items.filter((item) => item.href !== pathname);
    if (!normalized) return base.slice(0, 8);

    return base
      .filter((item) => {
        const haystack = `${item.title} ${item.meta ?? ''} ${item.type}`.toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, 8);
  }, [items, pathname, query]);

  useEffect(() => {
    if (activeIndex > filtered.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, filtered.length]);

  const onNavigate = (href: string) => {
    setOpen(false);
    router.push(href as Route);
  };

  const onListKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!filtered.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      onNavigate(filtered[activeIndex].href);
    }
  };

  return (
    <>
      <button
        type="button"
        className="focus-ring inline-flex items-center gap-2 border border-[#003d0f] bg-black px-3 py-2 font-mono text-[10px] text-[#006622] transition-colors hover:border-[#00ff41] hover:text-[#00ff41]"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <Command className="h-3 w-3" />
        <span className="hidden md:inline tracking-widest uppercase">CMD</span>
        <kbd className="border border-[#003d0f] px-1.5 py-0.5 font-mono text-[9px]">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 px-4 pt-24 backdrop-blur-sm"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl overflow-hidden border border-[#003d0f] bg-black shadow-[0_0_40px_rgba(0,255,65,0.1)]"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-[#003d0f] px-4 py-3">
                <span className="font-mono text-xs text-[#006622]">&gt;</span>
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={onListKeyDown}
                  placeholder="search projects, posts, pages..."
                  className="w-full bg-transparent font-mono text-xs text-[#00cc33] outline-none placeholder:text-[#003d0f]"
                />
              </div>

              <ul className="max-h-80 overflow-y-auto p-2" role="listbox" aria-label="Search results">
                {filtered.length ? (
                  filtered.map((item, index) => {
                    const Icon = iconByType[item.type];
                    const active = index === activeIndex;

                    return (
                      <li key={`${item.type}-${item.href}`}>
                        <button
                          type="button"
                          className={`focus-ring flex w-full items-center justify-between px-3 py-2 text-left font-mono text-xs transition-colors ${
                            active ? 'bg-[#003d0f] text-[#00ff41]' : 'text-[#006622] hover:bg-[#0a0f0a] hover:text-[#00cc33]'
                          }`}
                          role="option"
                          aria-selected={active}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => onNavigate(item.href)}
                        >
                          <span className="inline-flex items-center gap-2 text-sm">
                            <Icon className="h-4 w-4" />
                            {item.title}
                          </span>
                          <span className="text-xs uppercase tracking-wider text-muted">{item.type}</span>
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className="px-3 py-8 text-center font-mono text-xs text-[#004d1a]">&gt; no matching results_</li>
                )}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export type { CommandItem };
