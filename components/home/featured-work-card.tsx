'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BentoCard } from '@/components/home/bento-cards';
import { cn } from '@/lib/utils';

export type FeaturedItem = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  impact: string;
  repo?: string;
};

const DWELL = 6500; // ms per project while auto-playing

export const FeaturedWorkCard = ({
  items,
  wave = 0,
  className
}: {
  items: FeaturedItem[];
  wave?: number;
  className?: string;
}) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPicked, setUserPicked] = useState(false);
  const reduceMotion = useReducedMotion();
  const autoplay = !reduceMotion && !userPicked && items.length > 1;

  useEffect(() => {
    if (!autoplay || paused) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % items.length), DWELL);
    return () => clearTimeout(id);
  }, [autoplay, paused, index, items.length]);

  const item = items[index];
  if (!item) return null;

  return (
    <BentoCard
      label="Featured work"
      wave={wave}
      className={cn('min-h-[272px]', className)}
    >
      <div
        className="mt-14 flex flex-1 flex-col px-6 pb-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.slug}
            initial={
              reduceMotion ? false : { opacity: 0, x: 24, filter: 'blur(6px)' }
            }
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -24, filter: 'blur(6px)' }
            }
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1"
            id="featured-panel"
            role="tabpanel"
          >
            <h3 className="text-[17px] font-semibold">{item.title}</h3>
            <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-muted">
              {item.summary}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
              <Link
                href={`/projects/${item.slug}`}
                className="focus-ring group/link inline-flex items-center gap-1 rounded font-medium hover:text-accent"
              >
                Read case study
                <ArrowRight className="h-3.5 w-3.5 transition group-hover/link:translate-x-0.5" />
              </Link>
              {item.repo && (
                <a
                  href={item.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-1 rounded text-muted hover:text-fg"
                >
                  <Github className="h-3.5 w-3.5" /> Code
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div
          role="tablist"
          aria-label="Featured projects"
          className="no-scrollbar mt-5 flex gap-1 overflow-x-auto rounded-full bg-bg p-1"
        >
          {items.map((entry, i) => {
            const active = i === index;
            return (
              <button
                key={entry.slug}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="featured-panel"
                onClick={() => {
                  setIndex(i);
                  setUserPicked(true);
                }}
                className={cn(
                  'focus-ring relative flex-1 whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition-colors',
                  active ? 'text-white' : 'text-fg hover:text-accent'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="featured-pill"
                    className="absolute inset-0 overflow-hidden rounded-full bg-fg shadow-chip"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  >
                    {autoplay && (
                      <motion.span
                        key={`${index}-${paused}`}
                        className="absolute inset-y-0 left-0 bg-white/15"
                        initial={{ width: '0%' }}
                        animate={{ width: paused ? undefined : '100%' }}
                        transition={{ duration: DWELL / 1000, ease: 'linear' }}
                      />
                    )}
                  </motion.span>
                )}
                <span className="relative">{entry.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </BentoCard>
  );
};
