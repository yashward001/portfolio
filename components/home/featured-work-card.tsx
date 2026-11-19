'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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

export const FeaturedWorkCard = ({
  items,
  className
}: {
  items: FeaturedItem[];
  className?: string;
}) => {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const item = items[index];
  if (!item) return null;

  return (
    <BentoCard label="Featured work" className={cn('min-h-[272px]', className)}>
      <div className="mt-14 flex flex-1 flex-col px-6 pb-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
            id="featured-panel"
            role="tabpanel"
          >
            <h3 className="text-[17px] font-semibold">
              <span className="mr-1.5 text-subtle">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.title}
            </h3>
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
          {items.map((entry, i) => (
            <button
              key={entry.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls="featured-panel"
              onClick={() => setIndex(i)}
              className={cn(
                'focus-ring flex-1 whitespace-nowrap rounded-full px-4 py-2 text-[13px] transition',
                i === index
                  ? 'bg-fg text-white shadow-chip'
                  : 'text-fg hover:bg-card'
              )}
            >
              {entry.shortTitle}
            </button>
          ))}
        </div>
      </div>
    </BentoCard>
  );
};
