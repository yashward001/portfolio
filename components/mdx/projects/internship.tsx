'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Cpu, Database, ShieldCheck, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { EASE, Fig, useTimeline } from '../kit';

/* The extension reads the page, a local model enriches it, and only a normalised record
   leaves the device. Raw page content never crosses the line. */

const POSTINGS = [
  { ats: 'Greenhouse', title: 'Software Engineering Intern', company: 'Northwind Labs', location: 'Singapore', deadline: '30 Nov', category: 'Software Engineering', runtime: 'WebGPU' },
  { ats: 'Lever', title: 'ML Research Intern', company: 'Kestrel AI', location: 'Remote', deadline: '12 Dec', category: 'Machine Learning', runtime: 'WebGPU' },
  { ats: 'Workday', title: 'Data Analyst Intern', company: 'Bluebay Logistics', location: 'Singapore', deadline: '5 Jan', category: 'Data', runtime: 'WASM fallback' },
  { ats: 'LinkedIn', title: 'Product Engineer Intern', company: 'Orbit Pay', location: 'Hybrid', deadline: '20 Jan', category: 'Software Engineering', runtime: 'WebGPU' }
];
const FIELDS = ['title', 'company', 'location', 'deadline'] as const;
const PH = [0, 0.8, 1.3, 1.8, 2.3, 3.1, 4.1, 5.1];
const CYCLE = 6.8;

export const PrivacyBoundary = () => {
  const times = POSTINGS.flatMap((_, i) => PH.map((t) => i * CYCLE + t));
  const { ref, step, ok } = useTimeline(times, POSTINGS.length * CYCLE);
  const pi = step < 0 ? 0 : Math.floor(step / PH.length);
  const ph = step < 0 ? -1 : step % PH.length;
  const p = POSTINGS[pi]!;
  const tracked = POSTINGS.slice(0, ph >= 7 ? pi + 1 : pi);

  return (
    <Fig
      title="Only structured fields leave the browser"
      note="A Manifest V3 extension captures fields from supported job pages. Enrichment runs on-device (WebGPU, with a WASM fallback), and only the normalised record syncs to Supabase."
      illustrative="Example postings"
    >
      <div ref={ref} className="grid gap-4 p-5 sm:grid-cols-[0.9fr_1.1fr] sm:p-6">
        {/* the page */}
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-bg px-3 py-2 text-[11px] text-subtle">
            <span className="h-2 w-2 rounded-full bg-fg/15" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={p.ats} initial={ok ? { opacity: 0 } : false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {p.ats.toLowerCase()}.com/jobs/…
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="space-y-2 p-3">
            {FIELDS.map((f, i) => (
              <div
                key={f}
                className={cn(
                  'rounded-md px-1.5 py-0.5 transition-all duration-300',
                  ph >= i + 1 ? 'bg-accent/10 outline outline-2 outline-accent' : 'outline outline-2 outline-transparent',
                  f === 'title' ? 'text-[14px] font-semibold' : 'text-[12px] text-muted'
                )}
              >
                {f === 'deadline' ? `Apply by ${p.deadline}` : p[f]}
              </div>
            ))}
            <div className="space-y-1.5 pt-1" aria-hidden>
              {[92, 100, 78, 96, 64].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-fg/[0.08]" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* on device */}
        <div className="flex flex-col gap-2 rounded-2xl bg-bg p-3">
          <p className="flex items-center justify-between text-[11px] text-subtle">
            On this device
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium transition-colors',
                ph >= 5 ? 'bg-fg text-white' : 'bg-card'
              )}
            >
              <Cpu className="h-3 w-3" /> {p.runtime}
            </span>
          </p>
          <div className="flex-1 rounded-xl bg-fg p-3 font-mono text-[11px] leading-6 text-white/85">
            {'{'}
            {FIELDS.map((f, i) => (
              <motion.div
                key={`${pi}-${f}`}
                className="truncate pl-3"
                initial={false}
                animate={{ opacity: ph >= i + 1 ? 1 : 0.12 }}
                transition={{ duration: ok ? 0.25 : 0 }}
              >
                <span className="text-white/45">{f}: </span>
                <span className="text-[#ffb27a]">&quot;{f === 'deadline' ? p.deadline : p[f]}&quot;</span>
              </motion.div>
            ))}
            <motion.div
              className="truncate pl-3"
              initial={false}
              animate={{ opacity: ph >= 5 ? 1 : 0 }}
              transition={{ duration: ok ? 0.3 : 0 }}
            >
              <span className="text-white/45">category: </span>
              <span className="text-[#8fd3ff]">&quot;{p.category}&quot;</span>
            </motion.div>
            {'}'}
          </div>
        </div>

        {/* boundary */}
        <div className="relative flex h-8 items-center justify-center sm:col-span-2">
          <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-fg/25" />
          <span className="relative z-10 flex items-center gap-2 bg-card px-2 py-1 text-[11px] text-subtle">
            <ShieldCheck className="h-4 w-4 text-success" />
            device boundary: only the record above crosses
          </span>
          <motion.span
            className="absolute z-20 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-white"
            initial={false}
            animate={{ opacity: ph === 6 ? 1 : 0, scale: ph === 6 ? 1 : 0.6 }}
            transition={{ duration: ok ? 0.25 : 0 }}
            style={{ left: '6%', top: 'calc(50% - 10px)' }}
          >
            <X className="h-3 w-3" /> raw page
          </motion.span>
        </div>

        {/* cloud */}
        <div className="flex min-h-[96px] flex-col gap-2 rounded-2xl border border-border p-3 sm:col-span-2">
          <p className="flex items-center gap-1.5 text-[11px] text-subtle">
            <Database className="h-3 w-3" /> Supabase · your dashboard
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {tracked.map((t) => (
                <motion.li
                  key={t.company}
                  layout={ok}
                  initial={ok ? { opacity: 0, x: -24 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="rounded-lg bg-bg px-2.5 py-1.5"
                >
                  <p className="truncate text-[12px] font-medium">{t.title}</p>
                  <p className="flex justify-between text-[11px] text-subtle">
                    <span className="truncate">{t.company}</span>
                    <span className="shrink-0">due {t.deadline}</span>
                  </p>
                </motion.li>
              ))}
            </AnimatePresence>
            {tracked.length === 0 && <li className="text-[12px] text-subtle">No applications tracked yet.</li>}
          </ul>
        </div>
      </div>
    </Fig>
  );
};
