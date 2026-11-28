'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { Fig, useTimeline } from './kit';

export type RailNode = { label: string; sub?: string };

/**
 * A pipeline drawn as stations on a rail. The rail fills station to station and each one
 * lights as the work reaches it. Horizontal on wide screens, vertical on phones.
 */
export const FlowRail = ({
  title,
  note,
  nodes,
  illustrative
}: {
  title?: string;
  note?: string;
  nodes: RailNode[];
  illustrative?: boolean | string;
}) => {
  const times = nodes.map((_, i) => 0.3 + i * 0.85);
  const { ref, step, ok } = useTimeline(times, times[times.length - 1]! + 2.4);

  return (
    <Fig title={title} note={note} illustrative={illustrative}>
      <div ref={ref} className="p-5 sm:p-6">
        <ol
          className="flex flex-col gap-4 md:grid md:gap-0"
          style={{ gridTemplateColumns: `repeat(${nodes.length}, minmax(0, 1fr))` }}
        >
          {nodes.map((n, i) => {
            const lit = step >= i;
            const current = step === i;
            const last = i === nodes.length - 1;
            return (
              <li
                key={n.label}
                className="relative flex items-start gap-3 md:flex-col md:items-center md:gap-0 md:px-1"
              >
                {!last && (
                  <>
                    <span
                      aria-hidden
                      className="absolute left-[13px] top-7 h-[calc(100%-12px)] w-[2px] bg-border md:left-1/2 md:top-[13px] md:h-[2px] md:w-full"
                    />
                    <span
                      aria-hidden
                      className={cn(
                        'absolute left-[13px] top-7 h-[calc(100%-12px)] w-[2px] origin-top bg-accent md:left-1/2 md:top-[13px] md:h-[2px] md:w-full md:origin-left',
                        ok && 'transition-transform duration-700 ease-in-out',
                        step > i ? 'scale-y-100 md:scale-x-100' : 'scale-y-0 md:scale-x-0 md:scale-y-100'
                      )}
                    />
                  </>
                )}
                <span className="relative z-10 grid h-7 w-7 shrink-0 place-items-center">
                  {current && ok && (
                    <motion.span
                      key={`ping-${i}`}
                      className="absolute inset-0 rounded-full bg-accent"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  )}
                  <span
                    className={cn(
                      'grid h-7 w-7 place-items-center rounded-full border-2 font-mono text-[11px] font-semibold transition-colors duration-300',
                      lit ? 'border-accent bg-accent text-white' : 'border-border bg-card text-subtle'
                    )}
                  >
                    {i + 1}
                  </span>
                </span>
                <span className="min-w-0 pb-1 md:mt-3 md:text-center">
                  <span
                    className={cn(
                      'block text-[14px] font-medium leading-tight transition-colors duration-300',
                      lit ? 'text-fg' : 'text-subtle'
                    )}
                  >
                    {n.label}
                  </span>
                  {n.sub && (
                    <span className="mt-1 block text-[12px] leading-snug text-muted">{n.sub}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Fig>
  );
};
