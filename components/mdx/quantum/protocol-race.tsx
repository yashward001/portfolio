'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

import { MECHANISMS, PROTOCOLS } from './data';
import { EASE, useMotionOk } from './use-motion-ok';

/** Score reduction vs. the original circuit, per way of driving the agent. */
export const ProtocolRace = () => {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const { mounted, ok } = useMotionOk();
  const go = mounted && (!ok || seen);

  return (
    <figure ref={ref} className="card not-prose my-10 p-5 sm:p-6">
      <figcaption className="mb-5 text-sm font-medium">
        Reduction in score S, from the same starting circuit
      </figcaption>
      <ul className="space-y-4">
        {PROTOCOLS.map((p, i) => {
          const mine = 'mine' in p && p.mine;
          return (
            <li key={p.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className={cn(mine ? 'font-semibold text-fg' : 'text-muted')}>
                  {p.label}
                  <span className="ml-2 text-xs font-normal text-subtle">
                    {p.attempts} attempts
                  </span>
                </span>
                <motion.span
                  className={cn(
                    'font-mono tabular-nums',
                    mine ? 'text-[17px] font-semibold text-accent' : 'text-fg/80'
                  )}
                  initial={false}
                  animate={{ opacity: go ? 1 : 0 }}
                  transition={{ duration: ok ? 0.4 : 0, delay: ok ? 0.5 + i * 0.35 : 0 }}
                >
                  −{p.impr.toFixed(1)}%
                </motion.span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-bg">
                <motion.div
                  className={cn(
                    'absolute inset-y-0 left-0 rounded-full',
                    mine
                      ? 'bg-[linear-gradient(90deg,hsl(var(--accent)/0.55),hsl(var(--accent)))]'
                      : 'bg-fg/25'
                  )}
                  initial={{ width: '0%' }}
                  animate={{ width: go ? `${p.impr}%` : '0%' }}
                  transition={{
                    duration: ok ? (mine ? 1.6 : 0.9) : 0,
                    delay: ok ? i * 0.35 : 0,
                    ease: EASE
                  }}
                />
                {'exact' in p && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-y-0 w-[2px] bg-fg/70"
                    style={{ left: `${p.exact}%` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: go ? 1 : 0 }}
                    transition={{ delay: ok ? 1 + i * 0.35 : 0 }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-xs leading-relaxed text-subtle">
        The dark tick marks how much of each autonomous run was exact rather than
        probabilistic. Autonomous runs were capped at ten attempts; the
        steered run started slower (−12.7% after ten) and kept going.
      </p>
    </figure>
  );
};

const COLORS: Record<string, string> = {
  'Algorithm change': 'bg-accent',
  'Probabilistic widths and round counts': 'bg-accent/55',
  'Exact gate-level savings': 'bg-fg/35',
  'Qubit lifetimes': 'bg-[repeating-linear-gradient(135deg,hsl(var(--accent))_0_5px,hsl(var(--fg)/0.35)_5px_10px)]'
};

/** Share of the reduction in ln S, by mechanism, and who opened that stage. */
export const MechanismSplit = () => {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const { mounted, ok } = useMotionOk();
  const go = mounted && (!ok || seen);

  let offset = 0;
  return (
    <figure ref={ref} className="card not-prose my-10 p-5 sm:p-6">
      <figcaption className="mb-4">
        <span className="block text-sm font-medium">Where the 85% came from</span>
        <span className="mt-0.5 block text-xs text-subtle">
          Share of the drop in ln S by stage. Orange: stages my rulings opened.
          Grey: stages the agent opened.
        </span>
      </figcaption>
      <div className="relative flex h-10 overflow-hidden rounded-2xl bg-bg">
        {MECHANISMS.map((m, i) => {
          const delay = (offset / 100) * 1.4;
          offset += m.share;
          return (
            <motion.div
              key={m.label}
              className={cn('h-full border-r-2 border-card last:border-r-0', COLORS[m.label])}
              initial={{ width: '0%' }}
              animate={{ width: go ? `${m.share}%` : '0%' }}
              transition={{ duration: ok ? 0.7 : 0, delay: ok ? delay + i * 0.05 : 0, ease: EASE }}
            />
          );
        })}
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {MECHANISMS.map((m) => (
          <li key={m.label} className="flex gap-3">
            <span className={cn('mt-1 h-3 w-3 shrink-0 rounded', COLORS[m.label])} />
            <span className="text-sm leading-snug">
              <span className="font-medium">{m.label}</span>{' '}
              <span className="font-mono text-muted">{m.share}%</span>
              <span className="block text-xs text-subtle">
                {m.detail} · opened by{' '}
                {m.by === 'both' ? 'the agent and me' : m.by === 'student' ? 'me' : 'the agent'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
};
