'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Database, Mail, Sparkles, Workflow } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Fig, useTimeline } from '../kit';

/* Mail arrives, gets a label from a rule or (when ambiguous) the LLM, and lands in its lane
   as a one-line summary. Repeat threads come from the PostgreSQL summary cache. */

const LANES = ['Urgent', 'Deadlines', 'Admin', 'Opportunities'] as const;
type Lane = (typeof LANES)[number];

const MAIL: { from: string; subject: string; lane: Lane; via: 'rule' | 'LLM' | 'cache'; summary: string }[] = [
  { from: 'Course coordinator', subject: 'Assignment 3 deadline moved', lane: 'Deadlines', via: 'rule', summary: 'Assignment 3 now due Friday, 11:59 PM.' },
  { from: 'Careers office', subject: 'Re: quick question about your application', lane: 'Opportunities', via: 'LLM', summary: 'Recruiter wants a 20-minute call this week.' },
  { from: 'Student services', subject: 'Action required: update your address', lane: 'Admin', via: 'rule', summary: 'Confirm your address in the portal.' },
  { from: 'Project teammate', subject: 'need this before the demo!!', lane: 'Urgent', via: 'LLM', summary: 'Teammate needs the slides before tomorrow’s demo.' },
  { from: 'Hall office', subject: 'Room inspection schedule', lane: 'Admin', via: 'rule', summary: 'Inspection on Tuesday morning.' },
  { from: 'Course coordinator', subject: 'Re: Assignment 3 deadline moved', lane: 'Deadlines', via: 'cache', summary: 'Same thread: due Friday, 11:59 PM.' }
];
const T = MAIL.map((_, i) => 0.4 + i * 1.3);

export const InboxTriage = () => {
  const { ref, step, ok } = useTimeline(T, T[T.length - 1]! + 3.5);
  const arrived = MAIL.slice(0, step + 1);
  const waiting = MAIL.length - arrived.length;

  return (
    <Fig
      title="Category first, summary second"
      note="Rules give deterministic labels for common patterns; the LLM only handles the ambiguous ones. Summaries are cached in PostgreSQL, so a repeat thread costs no inference."
      illustrative="Example inbox"
    >
      <div ref={ref} className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> {waiting} left to triage
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Workflow className="h-3.5 w-3.5" /> rule
          </span>
          <span className="inline-flex items-center gap-1.5 text-accent">
            <Sparkles className="h-3.5 w-3.5" /> LLM fallback
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" /> summary cache
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LANES.map((lane) => {
            const items = arrived.filter((m) => m.lane === lane);
            return (
              <div key={lane} className="flex min-h-[150px] flex-col rounded-2xl bg-bg p-2.5">
                <p className="flex items-center justify-between px-1 pb-2 text-[13px] font-medium">
                  {lane}
                  <span className={cn('rounded-full px-1.5 text-[11px] tabular-nums', items.length ? 'bg-fg text-white' : 'text-subtle')}>
                    {items.length}
                  </span>
                </p>
                <ul className="space-y-2">
                  <AnimatePresence initial={false}>
                    {items.map((m) => (
                      <motion.li
                        key={m.subject + m.via}
                        layout={ok}
                        initial={ok ? { opacity: 0, y: -24, scale: 0.96 } : false}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                        className="rounded-xl border border-border bg-card p-2.5"
                      >
                        <p className="flex items-center justify-between gap-2 text-[11px] text-subtle">
                          <span className="truncate">{m.from}</span>
                          <Via via={m.via} />
                        </p>
                        <p className="mt-1 text-[12.5px] leading-snug">{m.summary}</p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </Fig>
  );
};

const Via = ({ via }: { via: 'rule' | 'LLM' | 'cache' }) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-px text-[10px] font-medium',
      via === 'LLM' ? 'bg-accent/15 text-accent' : 'bg-bg text-muted'
    )}
  >
    {via === 'rule' && <Workflow className="h-2.5 w-2.5" />}
    {via === 'LLM' && <Sparkles className="h-2.5 w-2.5" />}
    {via === 'cache' && <Database className="h-2.5 w-2.5" />}
    {via}
  </span>
);
