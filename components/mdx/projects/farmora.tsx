'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, CloudSun, MessageCircle, Ship, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { EASE, Fig, useTimeline } from '../kit';

/* An exporter's order becomes a coordinated crop plan across member farms. */

const DEMAND = 24;
type Fit = 'good' | 'fair' | 'poor';
const FARMS: { name: string; lang: string; fit: Fit; plan: number; final: number; declines?: boolean }[] = [
  { name: 'Farm A', lang: 'Marathi', fit: 'good', plan: 6, final: 8 },
  { name: 'Farm B', lang: 'Hindi', fit: 'good', plan: 5, final: 5 },
  { name: 'Farm C', lang: 'Kannada', fit: 'fair', plan: 4, final: 0, declines: true },
  { name: 'Farm D', lang: 'Telugu', fit: 'poor', plan: 0, final: 0 },
  { name: 'Farm E', lang: 'Tamil', fit: 'good', plan: 5, final: 7 },
  { name: 'Farm F', lang: 'Gujarati', fit: 'fair', plan: 4, final: 4 }
];
const MAX = 8;

const T = [0, 1.3, 2.6, 4.0, 5.4, 6.8, 8.2];
const STAGES = ['Order', 'Match to climate', 'Allocate', 'Guide farmers', 'Responses', 'Rebalance', 'Weather risk'];

export const CropPlanner = () => {
  const { ref, step, ok } = useTimeline(T, 12.5);
  const tonnes = (f: (typeof FARMS)[number]) => (step >= 5 ? f.final : step >= 2 ? f.plan : 0);
  const expected = FARMS.reduce((s, f) => {
    if (step < 4) return s + (step >= 2 ? f.plan : 0);
    return s + (f.declines ? 0 : tonnes(f));
  }, 0);

  return (
    <Fig
      title="From one export order to a plan every farmer can act on"
      note="Weather and climate data decide which farms suit the crop, the order is split across them, guidance goes out in each farmer’s language, and voluntary responses update the expected supply."
      illustrative="Example order"
    >
      <div ref={ref} className="space-y-5 p-5 sm:p-6">
        <ol className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-bg p-1 text-[12px]">
          {STAGES.map((s, i) => (
            <li
              key={s}
              className={cn(
                'whitespace-nowrap rounded-full px-2.5 py-1 transition-colors duration-300',
                step === i ? 'bg-fg text-white' : step > i ? 'text-fg' : 'text-subtle'
              )}
            >
              {s}
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] text-subtle">Exporter order</p>
            <p className="text-[17px] font-semibold">{DEMAND} t okra · ships in 10 weeks</p>
          </div>
          <div className="min-w-[200px] flex-1 sm:max-w-[280px]">
            <p className="flex justify-between text-[11px] text-subtle">
              {step >= 4 ? 'Expected supply' : 'Planned supply'}
              <span className={cn('font-mono', step < 4 ? 'text-fg' : expected >= DEMAND ? 'text-success' : 'text-accent')}>
                {expected} / {DEMAND} t
              </span>
            </p>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-fg/[0.07]">
              <motion.div
                className={cn('h-full rounded-full', step < 4 ? 'bg-fg/40' : expected >= DEMAND ? 'bg-success' : 'bg-accent')}
                initial={false}
                animate={{ width: `${(expected / DEMAND) * 100}%` }}
                transition={{ duration: ok ? 0.6 : 0, ease: EASE }}
              />
            </div>
          </div>
        </div>

        <ul className="space-y-2">
          {FARMS.map((f, i) => {
            const t = tonnes(f);
            const excluded = step >= 1 && f.fit === 'poor';
            const declined = step >= 4 && f.declines;
            return (
              <li
                key={f.name}
                className={cn(
                  'grid grid-cols-[64px_70px_1fr_auto] items-center gap-2 rounded-xl border border-border px-3 py-2 text-[12.5px] transition-opacity sm:grid-cols-[72px_84px_1fr_150px] sm:gap-3',
                  (excluded || declined) && 'opacity-50'
                )}
              >
                <span className="font-medium">{f.name}</span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 justify-self-start rounded-full px-1.5 py-0.5 text-[10.5px] transition-opacity duration-300',
                    f.fit === 'good' && 'bg-success/15 text-success',
                    f.fit === 'fair' && 'bg-fg/10 text-fg',
                    f.fit === 'poor' && 'bg-accent/15 text-accent',
                    step >= 1 ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <CloudSun className="h-3 w-3" /> {f.fit} fit
                </span>
                <span className="relative h-2.5 rounded-full bg-fg/[0.06]">
                  <motion.span
                    className={cn('absolute inset-y-0 left-0 rounded-full', declined ? 'bg-fg/20' : 'bg-accent')}
                    initial={false}
                    animate={{ width: `${((declined ? f.plan : t) / MAX) * 100}%` }}
                    transition={{ duration: ok ? 0.6 : 0, delay: ok ? i * 0.06 : 0, ease: EASE }}
                  />
                </span>
                <span className="flex items-center justify-end gap-2 text-[11px] text-muted">
                  <span className="font-mono text-fg">{declined ? '0' : t} t</span>
                  <AnimatePresence initial={false}>
                    {step >= 3 && f.fit !== 'poor' && (
                      <motion.span
                        initial={ok ? { opacity: 0, scale: 0.6 } : false}
                        animate={{ opacity: 1, scale: 1 }}
                        className="hidden items-center gap-1 rounded-full bg-bg px-1.5 py-0.5 sm:inline-flex"
                      >
                        <MessageCircle className="h-3 w-3" /> {f.lang}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {step >= 4 && f.fit !== 'poor' && (
                    f.declines ? (
                      <X className="h-3.5 w-3.5 text-accent" aria-label="declined" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-success" aria-label="accepted" />
                    )
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <motion.div
          initial={false}
          animate={{ opacity: step >= 6 ? 1 : 0, y: step >= 6 ? 0 : 8 }}
          transition={{ duration: ok ? 0.4 : 0, ease: EASE }}
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-accent/40 bg-accent/[0.07] p-3.5"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-accent" />
          <p className="min-w-0 flex-1 text-[13px] leading-snug">
            <span className="font-medium">Cyclone forecast near the port on this shipment’s route.</span>{' '}
            <span className="text-muted">The deal is flagged with a suggested action.</span>
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-fg px-3 py-1.5 text-[12px] font-medium text-white">
            <Ship className="h-3.5 w-3.5" /> Book a backup sailing
          </span>
        </motion.div>
      </div>
    </Fig>
  );
};
