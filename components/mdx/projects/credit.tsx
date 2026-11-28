'use client';

import { animate, motion, useInView } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { EASE, Fig, gauss, rng, useMotionOk, useTimeline } from '../kit';

/* ─── Leak-safe temporal windows ─────────────────────────────────────── */

const PERIODS = 24;
const CUTS = [9, 13, 17];
const WINDOWS = [
  { label: 'Short window', len: 3 },
  { label: 'Medium window', len: 6 },
  { label: 'Long window', len: 9 }
];
const OUTCOME = 5;

export const LeakSafeWindows = () => {
  const { ref, step, ok } = useTimeline([0, 2.6, 5.2], 7.8);
  const cut = CUTS[Math.max(0, step)]!;
  const spring = ok ? { type: 'spring' as const, stiffness: 160, damping: 24 } : { duration: 0 };
  const pct = (p: number) => `${(p / PERIODS) * 100}%`;

  return (
    <Fig
      title="Features only look back. Labels only look forward."
      note="At every snapshot date, aggregates are computed from windows that end at the snapshot, and the default label comes from the period after it. Nothing from the outcome window can leak into a feature."
      illustrative="Example window sizes"
    >
      <div ref={ref} className="p-5 sm:p-6">
        <div className="grid grid-cols-[92px_1fr] gap-x-3 pt-7 sm:grid-cols-[110px_1fr]">
          <div className="space-y-3">
            {[...WINDOWS.map((w) => w.label), 'Default label'].map((l) => (
              <p key={l} className="flex h-6 items-center text-[12px] text-muted">
                {l}
              </p>
            ))}
          </div>
          <div className="relative">
            {/* future shading */}
            <motion.div
              aria-hidden
              className="absolute bottom-0 right-0 top-[-6px] rounded-xl bg-[repeating-linear-gradient(135deg,hsl(var(--fg)/0.05)_0_6px,transparent_6px_12px)]"
              initial={false}
              animate={{ left: pct(cut) }}
              transition={spring}
            />
            {/* cutoff line */}
            <motion.div
              aria-hidden
              className="absolute bottom-0 top-[-10px] z-10 w-[2px] -translate-x-1/2 bg-fg"
              initial={false}
              animate={{ left: pct(cut) }}
              transition={spring}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-fg px-2 py-0.5 text-[11px] font-medium text-white">
                snapshot
              </span>
            </motion.div>
            <div className="relative space-y-3">
              {WINDOWS.map((w) => (
                <div key={w.label} className="relative h-6">
                  <motion.div
                    className="absolute inset-y-0 rounded-md bg-accent/80"
                    initial={false}
                    animate={{ left: pct(cut - w.len), width: pct(w.len) }}
                    transition={spring}
                  />
                </div>
              ))}
              <div className="relative h-6">
                <motion.div
                  className="absolute inset-y-0 rounded-md border-2 border-dashed border-fg/50 bg-card"
                  initial={false}
                  animate={{ left: pct(cut), width: pct(OUTCOME) }}
                  transition={spring}
                />
              </div>
            </div>
            <div className="mt-3 flex">
              {Array.from({ length: PERIODS }, (_, i) => (
                <span key={i} className="h-1.5 flex-1 border-l border-border first:border-l-0" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-sm bg-accent/80" /> aggregated into features
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-sm border-2 border-dashed border-fg/50" /> label window
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-sm bg-[repeating-linear-gradient(135deg,hsl(var(--fg)/0.15)_0_3px,transparent_3px_6px)]" /> future at snapshot time
          </span>
        </div>
      </div>
    </Fig>
  );
};

/* ─── Threshold explorer on an imbalanced population ─────────────────── */

const POP = 400;
type Borrower = { score: number; bad: boolean };
const makePop = (): Borrower[] => {
  const r = rng(7);
  return Array.from({ length: POP }, (_, i) => {
    const bad = i % 12 === 0; // ~8% defaults
    const raw = bad ? 0.64 + 0.15 * gauss(r) : 0.3 + 0.14 * gauss(r);
    return { score: Math.min(0.99, Math.max(0.01, raw)), bad };
  });
};

export const ThresholdExplorer = () => {
  const pop = useMemo(makePop, []);
  // shuffle positions deterministically so defaults are scattered through the grid
  const order = useMemo(() => {
    const r = rng(11);
    const idx = pop.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [idx[i], idx[j]] = [idx[j]!, idx[i]!];
    }
    return idx;
  }, [pop]);

  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.4 });
  const { ok } = useMotionOk();
  const [t, setT] = useState(0.5);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!ok || !visible || touched) return;
    const c = animate(t, [t, 0.3, 0.75, t], {
      duration: 10,
      ease: 'easeInOut',
      repeat: Infinity,
      onUpdate: setT
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok, visible, touched]);

  const bad = pop.filter((b) => b.bad).length;
  const tp = pop.filter((b) => b.bad && b.score >= t).length;
  const fp = pop.filter((b) => !b.bad && b.score >= t).length;
  const precision = tp + fp ? tp / (tp + fp) : 1;
  const recall = tp / bad;

  // histogram
  const BINS = 20;
  const hist = Array.from({ length: BINS }, (_, i) => {
    const lo = i / BINS;
    const hi = (i + 1) / BINS;
    const inBin = pop.filter((b) => b.score >= lo && b.score < hi);
    return { good: inBin.filter((b) => !b.bad).length, bad: inBin.filter((b) => b.bad).length };
  });
  const maxH = Math.max(...hist.map((h) => h.good));

  return (
    <Fig
      title="Recall versus precision, one threshold at a time"
      note={`${POP} synthetic borrowers, ${bad} of them defaults (about 8%). Each dot is a borrower. Moving the cut-off trades caught defaults against false alarms, which is why thresholds were calibrated for the decision workflow rather than left at 0.5.`}
      illustrative="Synthetic data"
    >
      <div ref={ref} className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1fr_1fr]">
        <div>
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}
            role="img"
            aria-label={`At threshold ${t.toFixed(2)}, ${tp} of ${bad} defaults are flagged along with ${fp} false alarms.`}
          >
            {order.map((i) => {
              const b = pop[i]!;
              const flagged = b.score >= t;
              return (
                <span
                  key={i}
                  className={cn(
                    'aspect-square rounded-full transition-colors duration-200',
                    b.bad && flagged && 'bg-accent',
                    b.bad && !flagged && 'border-2 border-accent bg-transparent',
                    !b.bad && flagged && 'bg-fg/45',
                    !b.bad && !flagged && 'bg-fg/[0.07]'
                  )}
                />
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-muted">
            <Key className="bg-accent" label="caught default" />
            <Key className="border-2 border-accent" label="missed default" />
            <Key className="bg-fg/45" label="false alarm" />
          </div>
        </div>

        <div className="flex flex-col">
          {/* histogram */}
          <div className="relative flex h-28 items-end gap-[2px]">
            {hist.map((h, i) => (
              <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                <span className="w-full rounded-t-sm bg-fg/15" style={{ height: `${(h.good / maxH) * 100}%` }} />
                <span
                  className="absolute bottom-0 w-full rounded-t-sm bg-accent/80"
                  style={{ height: `${Math.min(100, (h.bad / maxH) * 100 * 3)}%` }}
                />
              </div>
            ))}
            <span className="absolute inset-y-[-4px] w-[2px] bg-fg" style={{ left: `${t * 100}%` }} />
          </div>
          <p className="mt-1.5 flex justify-between text-[11px] text-subtle">
            <span>risk score 0</span>
            <span>defaults ×3 for visibility</span>
            <span>1</span>
          </p>

          <label className="mt-4 block">
            <span className="flex items-baseline justify-between text-[12px] text-muted">
              Threshold <span className="font-mono text-fg">{t.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={0.05}
              max={0.95}
              step={0.01}
              value={t}
              onChange={(e) => {
                setTouched(true);
                setT(Number(e.target.value));
              }}
              className="mt-1 w-full accent-[hsl(var(--accent))]"
            />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Meter label="Recall (defaults caught)" value={recall} ok={ok} />
            <Meter label="Precision (flags that are real)" value={precision} ok={ok} />
          </div>
        </div>
      </div>
    </Fig>
  );
};

const Key = ({ className, label }: { className: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className={cn('h-2.5 w-2.5 rounded-full', className)} />
    {label}
  </span>
);

const Meter = ({ label, value, ok }: { label: string; value: number; ok: boolean }) => (
  <div className="rounded-xl bg-bg p-3">
    <p className="text-[11px] leading-tight text-subtle">{label}</p>
    <p className="mt-1 font-mono text-[20px] font-semibold tabular-nums">{Math.round(value * 100)}%</p>
    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fg/10">
      <motion.div
        className="h-full rounded-full bg-accent"
        initial={false}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: ok ? 0.15 : 0, ease: EASE }}
      />
    </div>
  </div>
);
