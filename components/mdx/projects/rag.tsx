'use client';

import { motion } from 'framer-motion';
import { Check, FileText, Lock, MessageSquare } from 'lucide-react';

import { cn } from '@/lib/utils';

import { EASE, Fig, useTimeline } from '../kit';

/* Ingest: docs → chunks → embeddings → index. Query: retrieve only what this user may see,
   answer with citations, and log quality signals. */

const TEAMS = {
  Engineering: 'bg-accent',
  Sales: 'bg-fg/55',
  People: 'bg-success'
} as const;
type Team = keyof typeof TEAMS;

const DOCS: { name: string; team: Team }[] = [
  { name: 'deploy-runbook.md', team: 'Engineering' },
  { name: 'pricing-2026.pdf', team: 'Sales' },
  { name: 'leave-policy.pdf', team: 'People' }
];
const CHUNKS = DOCS.flatMap((d, di) =>
  [0, 1, 2].map((ci) => ({ doc: d.name, team: d.team, id: `${di}-${ci}`, rel: d.team === 'Engineering' ? [0.9, 0.62, 0.81][ci]! : 0 }))
);
const ASKER: Team = 'Engineering';
const TOP = CHUNKS.filter((c) => c.team === ASKER)
  .sort((a, b) => b.rel - a.rel)
  .slice(0, 2)
  .map((c) => c.id);

const T = [0, 1.2, 2.4, 3.6, 5.2, 6.4, 7.6, 8.8];
const STAGES = ['Sync', 'Chunk', 'Embed', 'Index', 'Ask', 'Scoped retrieval', 'Grounded answer', 'Evaluate'];

export const RagPipeline = () => {
  const { ref, step, ok } = useTimeline(T, 12.5);
  const querying = step >= 4;

  return (
    <Fig
      title="Ingestion ETL on one side, scoped retrieval on the other"
      note="ETL workers sync sources, chunk, embed and index. At query time, the retrieval service only considers chunks the asker is allowed to see, and every answer feeds the evaluation dashboard."
      illustrative="Example documents"
    >
      <div ref={ref} className="space-y-5 p-5 sm:p-6">
        <ol className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-bg p-1 text-[12px]">
          {STAGES.map((s, i) => (
            <li
              key={s}
              className={cn(
                'whitespace-nowrap rounded-full px-2.5 py-1 transition-colors duration-300',
                step === i ? 'bg-fg text-white' : step > i ? 'text-fg' : 'text-subtle',
                i === 4 && 'ml-2'
              )}
            >
              {s}
            </li>
          ))}
        </ol>

        <div className="grid gap-5 md:grid-cols-[1fr_1.1fr]">
          {/* sources → index */}
          <div className="space-y-3">
            {DOCS.map((d, di) => (
              <div key={d.name} className="rounded-xl border border-border p-2.5">
                <p className="flex items-center justify-between gap-2 text-[12px]">
                  <span className="inline-flex min-w-0 items-center gap-1.5 truncate font-mono">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-subtle" />
                    {d.name}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-subtle">
                    <span className={cn('h-2 w-2 rounded-full', TEAMS[d.team])} />
                    {d.team}
                  </span>
                </p>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {CHUNKS.filter((c) => c.doc === d.name).map((c, ci) => {
                    const chunked = step >= 1;
                    const embedded = step >= 2;
                    const blocked = querying && step >= 5 && c.team !== ASKER;
                    const hit = step >= 5 && TOP.includes(c.id);
                    return (
                      <motion.div
                        key={c.id}
                        initial={false}
                        animate={{
                          opacity: chunked ? (blocked ? 0.35 : 1) : 0.15,
                          y: chunked ? 0 : -4,
                          scale: hit ? 1.04 : 1
                        }}
                        transition={{ duration: ok ? 0.35 : 0, delay: ok && !querying ? (di * 3 + ci) * 0.04 : 0, ease: EASE }}
                        className={cn(
                          'relative flex h-9 items-center justify-center overflow-hidden rounded-md border',
                          hit ? 'border-accent bg-accent/10' : 'border-border bg-bg'
                        )}
                      >
                        {/* embedding "barcode" */}
                        <span className="flex h-4 items-end gap-[2px]">
                          {[3, 7, 4, 9, 5, 8, 2, 6].map((h, k) => (
                            <motion.span
                              key={k}
                              className={cn('w-[2px] rounded-full', TEAMS[c.team])}
                              initial={false}
                              animate={{ height: embedded ? `${((h + di + ci) % 10) * 10 + 10}%` : '10%' }}
                              transition={{ duration: ok ? 0.4 : 0, delay: ok ? k * 0.02 : 0 }}
                            />
                          ))}
                        </span>
                        {blocked && (
                          <span className="absolute inset-0 grid place-items-center bg-card/60">
                            <Lock className="h-3.5 w-3.5 text-fg/70" />
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
            <p className={cn('text-[12px] transition-colors', step >= 3 ? 'text-fg' : 'text-subtle')}>
              {step >= 3 ? '9 chunks indexed in FAISS, tagged with their access scope.' : 'Waiting for the index…'}
            </p>
          </div>

          {/* query side */}
          <div className="flex flex-col gap-3">
            <motion.div
              initial={false}
              animate={{ opacity: step >= 4 ? 1 : 0.2 }}
              className="rounded-xl bg-bg p-3"
            >
              <p className="flex items-center gap-1.5 text-[11px] text-subtle">
                <MessageSquare className="h-3 w-3" /> Asked by someone in {ASKER}
              </p>
              <p className="mt-1 text-[14px] font-medium leading-snug">How do I roll back a failed deploy?</p>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: step >= 6 ? 1 : 0.2, y: step >= 6 ? 0 : 6 }}
              transition={{ duration: ok ? 0.4 : 0 }}
              className="rounded-xl bg-fg p-3 text-[13px] leading-relaxed text-white"
            >
              Re-deploy the last green build from the release page, then confirm health checks pass
              <Cite n={1} /> and announce it in the incident channel
              <Cite n={2} />.
              <p className="mt-2 border-t border-white/15 pt-2 font-mono text-[10.5px] text-white/55">
                [1] deploy-runbook.md · chunk 1 &nbsp; [2] deploy-runbook.md · chunk 3
              </p>
            </motion.div>

            <ul className="grid grid-cols-3 gap-2 text-[11.5px]">
              {['Grounded in sources', 'Access scope respected', 'Latency logged'].map((c, i) => (
                <li
                  key={c}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-2 py-1.5 leading-tight transition-all duration-300',
                    step >= 7 ? 'border-success/40 bg-success/10' : 'border-border text-subtle'
                  )}
                  style={{ transitionDelay: ok && step >= 7 ? `${i * 150}ms` : undefined }}
                >
                  <Check className={cn('h-3 w-3 shrink-0', step >= 7 ? 'text-success' : 'text-subtle/40')} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Fig>
  );
};

const Cite = ({ n }: { n: number }) => (
  <sup className="ml-0.5 rounded bg-accent px-1 font-mono text-[9px] font-semibold text-white">{n}</sup>
);
