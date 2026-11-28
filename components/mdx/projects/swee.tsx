'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, FileCode2, Search, ShieldCheck } from 'lucide-react';

import { cn } from '@/lib/utils';

import { EASE, Fig, useTimeline } from '../kit';

/* One task in, retrieval-grounded context out, routed to the agent that specialises in it. */

const AGENTS = ['Generate', 'Refactor', 'Review'] as const;

const TASKS: {
  ask: string;
  agent: (typeof AGENTS)[number];
  hits: { file: string; score: number }[];
  out: string;
}[] = [
  {
    ask: 'Add rate limiting to the login endpoint',
    agent: 'Generate',
    hits: [
      { file: 'api/routes/auth.py', score: 0.91 },
      { file: 'api/middleware/limits.py', score: 0.84 },
      { file: 'docs/security.md', score: 0.77 },
      { file: 'tests/test_auth.py', score: 0.52 }
    ],
    out: 'New limiter wired into auth.py, reusing the existing middleware pattern.'
  },
  {
    ask: 'Split UserService into smaller modules and update the tests',
    agent: 'Refactor',
    hits: [
      { file: 'services/user_service.py', score: 0.95 },
      { file: 'tests/test_user_service.py', score: 0.88 },
      { file: 'services/__init__.py', score: 0.71 },
      { file: 'docs/architecture.md', score: 0.49 }
    ],
    out: 'Three modules plus updated imports, with matching test changes.'
  },
  {
    ask: 'Review this diff for edge cases',
    agent: 'Review',
    hits: [
      { file: 'diff: payments/refund.py', score: 0.97 },
      { file: 'payments/models.py', score: 0.82 },
      { file: 'docs/payments.md', score: 0.68 },
      { file: 'tests/test_refund.py', score: 0.61 }
    ],
    out: 'Flags a missing check for partial refunds, citing models.py.'
  }
];

const PHASE_T = [0, 1.2, 2.4, 3.6, 4.8];
const CYCLE = 7.2;
const TOP_K = 3;

export const SweeRouter = () => {
  // three tasks per loop, five phases each
  const times = TASKS.flatMap((_, ti) => PHASE_T.map((t) => ti * CYCLE + t));
  const { ref, step, ok } = useTimeline(times, TASKS.length * CYCLE);
  const ti = step < 0 ? 0 : Math.floor(step / PHASE_T.length);
  const phase = step < 0 ? -1 : step % PHASE_T.length;
  const task = TASKS[ti]!;

  return (
    <Fig
      title="Retrieval first, then the right specialist"
      note="Code and docs are chunked into a FAISS index. The API layer retrieves context, routes the task to one role-specific agent, and validation hooks check the output format before anything is returned."
      illustrative="Example tasks"
    >
      <div ref={ref} className="space-y-5 p-5 sm:p-6">
        {/* task */}
        <div className="flex items-start gap-3 rounded-2xl bg-bg p-4">
          <Search className="mt-0.5 h-4 w-4 shrink-0 text-subtle" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={ti}
              className="text-[15px] font-medium leading-snug"
              initial={ok ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {task.ask}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="grid gap-5 md:grid-cols-[1.25fr_1fr]">
          {/* retrieval */}
          <div>
            <p className="text-xs text-subtle">FAISS top-{TOP_K} context</p>
            <ul className="mt-2 space-y-1.5">
              {task.hits.map((h, i) => {
                const shown = phase >= 1;
                const kept = i < TOP_K;
                return (
                  <li
                    key={`${ti}-${h.file}`}
                    className={cn(
                      'relative overflow-hidden rounded-lg border px-3 py-2 transition-colors duration-500',
                      shown && kept && phase >= 2 ? 'border-accent/50' : 'border-border',
                      shown && !kept && phase >= 2 && 'opacity-40'
                    )}
                  >
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-0 left-0 bg-accent/10"
                      initial={false}
                      animate={{ width: shown ? `${h.score * 100}%` : '0%' }}
                      transition={{ duration: ok ? 0.6 : 0, delay: ok ? i * 0.08 : 0, ease: EASE }}
                    />
                    <span className="relative flex items-center justify-between gap-2 font-mono text-[11.5px]">
                      <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
                        <FileCode2 className="h-3.5 w-3.5 shrink-0 text-subtle" />
                        {h.file}
                      </span>
                      <span className="shrink-0 text-subtle">{shown ? h.score.toFixed(2) : '··'}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* router + validation */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-subtle">Routed to</p>
              <div className="mt-2 flex gap-1 rounded-full bg-bg p-1">
                {AGENTS.map((a) => {
                  const on = phase >= 2 && a === task.agent;
                  return (
                    <span
                      key={a}
                      className={cn(
                        'relative flex-1 rounded-full py-1.5 text-center text-[13px]',
                        on ? 'text-white' : 'text-subtle'
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="swee-agent"
                          className="absolute inset-0 rounded-full bg-fg"
                          transition={ok ? { type: 'spring', stiffness: 380, damping: 30 } : { duration: 0 }}
                        />
                      )}
                      <span className="relative">{a}</span>
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs text-subtle">Validation hooks</p>
              <ul className="mt-2 space-y-1.5 text-[13px]">
                {['Output format', 'Quality checks'].map((c, i) => (
                  <li key={c} className="flex items-center gap-2">
                    <span
                      className={cn(
                        'grid h-4 w-4 place-items-center rounded-full transition-colors duration-300',
                        phase >= 3 ? 'bg-success text-white' : 'border border-border'
                      )}
                      style={{ transitionDelay: ok ? `${i * 200}ms` : undefined }}
                    >
                      {phase >= 3 && <Check className="h-2.5 w-2.5" />}
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={false}
              animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 6 }}
              transition={{ duration: ok ? 0.35 : 0 }}
              className="rounded-xl bg-fg p-3 text-[13px] leading-snug text-white"
            >
              <span className="mb-1 flex items-center gap-1.5 text-[11px] text-white/60">
                <ShieldCheck className="h-3 w-3" /> Grounded in retrieved files
              </span>
              {task.out}
            </motion.div>
          </div>
        </div>
      </div>
    </Fig>
  );
};
