'use client';

import { motion } from 'framer-motion';
import { Check, Lock, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Fig, useTimeline } from '../kit';

/* Scheduled runs as an Airflow-style grid. A validation failure stops the run before it can
   publish a dataset version, so experiments pinned to earlier versions are untouched. */

const TASKS = ['ingest', 'validate', 'clean', 'transform', 'publish version'];
const RUNS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FAIL_RUN = 3; // Thursday's raw data fails validation
const FAIL_TASK = 1;

type Cell = 'idle' | 'ok' | 'fail' | 'skipped';
const TICK = 0.22;
const T = RUNS.flatMap((_, r) => TASKS.map((_, k) => 0.3 + (r * TASKS.length + k) * TICK + r * 0.35));

const cellAt = (step: number, r: number, k: number): Cell => {
  const idx = r * TASKS.length + k;
  if (step < idx) return 'idle';
  if (r === FAIL_RUN && k === FAIL_TASK) return 'fail';
  if (r === FAIL_RUN && k > FAIL_TASK) return 'skipped';
  return 'ok';
};

// published versions: one per successful run
const VERSIONS = RUNS.map((_, r) => r)
  .filter((r) => r !== FAIL_RUN)
  .map((r, i) => ({ run: r, v: `v${i + 1}` }));

export const DagRun = () => {
  const { ref, step, ok } = useTimeline(T, T[T.length - 1]! + 4);
  const runDone = (r: number) => step >= r * TASKS.length + TASKS.length - 1;
  const published = VERSIONS.filter((v) => runDone(v.run));

  return (
    <Fig
      title="Every run validated, every dataset versioned"
      note="Scheduled ingestion runs validation checks before anything is transformed. A bad batch fails loudly and publishes nothing; experiments pin a dataset version, so reruns get identical inputs."
      illustrative="Example schedule"
    >
      <div ref={ref} className="p-5 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-1.5 text-[12px]">
            <thead>
              <tr>
                <th className="w-28 text-left font-normal text-subtle">task</th>
                {RUNS.map((r) => (
                  <th key={r} className="font-normal text-subtle">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TASKS.map((task, k) => (
                <tr key={task}>
                  <td className="whitespace-nowrap pr-2 font-mono text-[11.5px] text-muted">{task}</td>
                  {RUNS.map((_, r) => {
                    const c = cellAt(step, r, k);
                    return (
                      <td key={r} className="p-0">
                        <motion.span
                          initial={false}
                          animate={{ scale: c === 'idle' ? 0.85 : 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                          className={cn(
                            'grid h-7 min-w-[28px] place-items-center rounded-md transition-colors duration-200',
                            c === 'idle' && 'bg-fg/[0.06]',
                            c === 'ok' && 'bg-success text-white',
                            c === 'fail' && 'bg-accent text-white',
                            c === 'skipped' && 'border-2 border-dashed border-accent/50 bg-card'
                          )}
                          title={`${task}: ${c}`}
                        >
                          {c === 'ok' && k === TASKS.length - 1 && <Check className="h-3.5 w-3.5" />}
                          {c === 'fail' && <X className="h-3.5 w-3.5" />}
                        </motion.span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.p
          initial={false}
          animate={{ opacity: step >= FAIL_RUN * TASKS.length + FAIL_TASK ? 1 : 0 }}
          className="mt-2 text-[12px] text-accent"
        >
          Thu: validation caught a gap in the raw bars. Downstream tasks were skipped and no version was published.
        </motion.p>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-xs text-subtle">Published dataset versions</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {VERSIONS.map((v) => {
                const on = published.includes(v);
                return (
                  <motion.li
                    key={v.v}
                    initial={false}
                    animate={{ opacity: on ? 1 : 0.2, y: on ? 0 : 4 }}
                    transition={{ duration: ok ? 0.3 : 0 }}
                    className="rounded-md border border-border bg-bg px-2 py-1 font-mono text-[11.5px]"
                  >
                    {v.v} <span className="text-subtle">· {RUNS[v.run]}</span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-xl bg-bg p-3">
            <p className="flex items-center gap-1.5 text-xs text-subtle">
              <Lock className="h-3 w-3" /> Experiment pinned to <span className="font-mono text-fg">v3</span>
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11.5px]">
              {['run #1', 'rerun #2'].map((r, i) => (
                <div key={r} className="rounded-lg bg-card px-2.5 py-1.5">
                  <p className="text-subtle">{r}</p>
                  <p className={cn('transition-opacity', published.length >= 3 + i ? 'opacity-100' : 'opacity-20')}>
                    inputs = v3
                  </p>
                </div>
              ))}
            </div>
            <p className={cn('mt-2 text-[12px] transition-colors', published.length >= 4 ? 'text-success' : 'text-subtle')}>
              {published.length >= 4 ? 'Same version, same inputs: results are comparable.' : 'Waiting for runs…'}
            </p>
          </div>
        </div>
      </div>
    </Fig>
  );
};
