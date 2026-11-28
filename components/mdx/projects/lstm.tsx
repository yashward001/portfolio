'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';

import { EASE, Fig, gauss, rng, useTimeline } from '../kit';

/* ─── Rolling, walk-forward evaluation ──────────────────────────────── */

const SPAN = 100;
const FOLDS = 5;
const TRAIN = 40;
const VAL = 6;
const TEST = 12;
const STRIDE = 12;

export const WalkForward = () => {
  const times = Array.from({ length: FOLDS }, (_, i) => 0.3 + i * 0.9);
  const { ref, step, ok } = useTimeline(times, times[times.length - 1]! + 3);
  const pct = (v: number) => `${(v / SPAN) * 100}%`;

  return (
    <Fig
      title="Train on the past, stop early on the next slice, test on what comes after"
      note="Each fold rolls forward in time. Validation drives early stopping; the test window is never seen during training, so there’s no look-ahead."
      illustrative="Example fold sizes"
    >
      <div ref={ref} className="p-5 sm:p-6">
        <div className="space-y-2.5">
          {Array.from({ length: FOLDS }, (_, k) => {
            const start = k * STRIDE;
            const on = step >= k;
            const segs = [
              { from: start, len: TRAIN, cls: 'bg-fg/25' },
              { from: start + TRAIN, len: VAL, cls: 'bg-[repeating-linear-gradient(135deg,hsl(var(--accent)/0.55)_0_3px,transparent_3px_6px)] border border-accent/50' },
              { from: start + TRAIN + VAL, len: TEST, cls: 'bg-accent' }
            ];
            return (
              <div key={k} className="grid grid-cols-[48px_1fr] items-center gap-3">
                <span className={cn('font-mono text-[11.5px] transition-colors', on ? 'text-fg' : 'text-subtle/50')}>
                  fold {k + 1}
                </span>
                <div className="relative h-5 rounded-md bg-fg/[0.04]">
                  {segs.map((s, i) => (
                    <motion.span
                      key={i}
                      className={cn('absolute inset-y-0 rounded-[5px]', s.cls)}
                      style={{ left: pct(s.from), width: pct(s.len), transformOrigin: 'left' }}
                      initial={false}
                      animate={{ scaleX: on ? 1 : 0, opacity: on ? 1 : 0 }}
                      transition={{ duration: ok ? 0.45 : 0, delay: ok && on ? i * 0.18 : 0, ease: EASE }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-[48px_1fr] gap-3">
            <span />
            <p className="flex justify-between text-[11px] text-subtle">
              <span>older</span>
              <span>time →</span>
              <span>newer</span>
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-muted">
          <Key cls="bg-fg/25" label="train" />
          <Key cls="border border-accent/50 bg-[repeating-linear-gradient(135deg,hsl(var(--accent)/0.55)_0_3px,transparent_3px_6px)]" label="validation (early stopping)" />
          <Key cls="bg-accent" label="held-out test" />
        </div>
      </div>
    </Fig>
  );
};

const Key = ({ cls, label }: { cls: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className={cn('h-2.5 w-4 rounded-sm', cls)} />
    {label}
  </span>
);

/* ─── The sequence model, unrolled ──────────────────────────────────── */

const STEPS = 6;
const INPUTS = (() => {
  const r = rng(3);
  let v = 0;
  return Array.from({ length: STEPS }, () => (v = 0.6 * v + gauss(r)));
})();
const MAXABS = Math.max(...INPUTS.map(Math.abs));
const OUTS = [
  { dir: 'up' as const, p: 0.58 },
  { dir: 'down' as const, p: 0.61 }
];

export const LstmUnroll = () => {
  const cyc = 4.8;
  const times = OUTS.flatMap((_, o) => [...Array.from({ length: STEPS }, (_, i) => o * cyc + 0.2 + i * 0.45), o * cyc + 0.2 + STEPS * 0.45]);
  const { ref, step, ok } = useTimeline(times, OUTS.length * cyc);
  const per = STEPS + 1;
  const o = step < 0 ? 0 : Math.floor(step / per);
  const at = step < 0 ? -1 : step % per;
  const out = OUTS[o]!;

  return (
    <Fig
      title="Lagged, normalised returns in; a direction out"
      note="The hidden state carries what the LSTM remembers from earlier steps into later ones. The output is a directional signal, evaluated only on held-out windows."
      illustrative="Example inputs"
    >
      <div ref={ref} className="p-5 sm:p-6">
        <div className="relative flex items-stretch gap-1.5 sm:gap-2">
          {/* hidden-state rail behind the cells */}
          <span aria-hidden className="absolute left-4 right-[60px] top-6 h-[2px] bg-fg/10 sm:right-[80px]" />
          <motion.span
            aria-hidden
            className="absolute left-4 right-[60px] top-6 h-[2px] origin-left bg-accent sm:right-[80px]"
            initial={false}
            animate={{ scaleX: at < 0 ? 0 : Math.min(at, STEPS) / STEPS }}
            transition={{ duration: ok ? 0.4 : 0, ease: EASE }}
          />
          {INPUTS.map((x, i) => {
            const lit = at >= i;
            const cur = at === i;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                {/* cell */}
                <div className="relative flex w-full items-center">
                  <motion.div
                    className={cn(
                      'relative z-10 grid h-12 w-full place-items-center rounded-xl border-2 font-mono text-[11px] transition-colors duration-300',
                      lit ? 'border-fg bg-fg text-white' : 'border-border bg-card text-subtle'
                    )}
                    initial={false}
                    animate={{ scale: cur ? 1.08 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    LSTM
                  </motion.div>
                </div>
                <span className={cn('font-mono text-[10.5px] transition-colors', lit ? 'text-accent' : 'text-subtle/60')}>
                  h{i < STEPS - 1 ? `t−${STEPS - 1 - i}` : 't'}
                </span>
                {/* input bar */}
                <div className="flex h-12 w-full items-center justify-center">
                  <div className="relative h-full w-3 rounded-full bg-fg/[0.05]">
                    <span
                      className={cn('absolute left-0 right-0 rounded-full transition-colors', lit ? 'bg-accent' : 'bg-fg/25')}
                      style={
                        x >= 0
                          ? { bottom: '50%', height: `${(x / MAXABS) * 50}%` }
                          : { top: '50%', height: `${(-x / MAXABS) * 50}%` }
                      }
                    />
                  </div>
                </div>
                <span className="font-mono text-[10.5px] text-subtle">x{i < STEPS - 1 ? `t−${STEPS - 1 - i}` : 't'}</span>
              </div>
            );
          })}

          {/* output */}
          <div className="flex w-[84px] shrink-0 flex-col items-center gap-2 sm:w-[104px]">
            <motion.div
              initial={false}
              animate={{ opacity: at >= STEPS ? 1 : 0.25, scale: at >= STEPS ? 1 : 0.95 }}
              transition={{ duration: ok ? 0.3 : 0 }}
              className={cn(
                'grid h-12 w-full place-items-center rounded-xl text-[12px] font-semibold text-white',
                out.dir === 'up' ? 'bg-success' : 'bg-accent'
              )}
            >
              <span className="inline-flex items-center gap-1">
                {out.dir === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {out.dir}
              </span>
            </motion.div>
            <span className="text-center font-mono text-[10.5px] text-subtle">
              P = {at >= STEPS ? out.p.toFixed(2) : '··'}
            </span>
          </div>
        </div>
        <p className="mt-4 text-[12px] text-subtle">
          Hidden state flows left to right through the cells; the final state feeds the direction head.
        </p>
      </div>
    </Fig>
  );
};
