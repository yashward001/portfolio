'use client';

import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useTransform
} from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { LEADERBOARD, MILESTONES } from './data';
import { EASE, useMotionOk } from './use-motion-ok';

/* S = Q × T is literally an area: qubits up, Toffoli gates across.
   Every milestone redraws the rectangle, so the score you see is the space it covers. */

const W = 640;
const H = 330;
const OX = 52; // plot origin (bottom-left)
const OY = 292;
const PW = 568;
const PH = 268;
const QMAX = Math.max(...MILESTONES.map((m) => m.q));
const TMAX = Math.max(...MILESTONES.map((m) => m.t));
const box = (q: number, t: number) => {
  const w = (t / TMAX) * PW;
  const h = (q / QMAX) * PH;
  return { x: OX, y: OY - h, width: w, height: h };
};

const DWELL = 2800;
const BASE = MILESTONES[0]!;
const LAST = MILESTONES.length - 1;

const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');
const fmtBillions = (n: number) => `${(n / 1e9).toFixed(2)}B`;

const Ticker = ({
  value,
  format,
  instant
}: {
  value: number;
  format: (n: number) => string;
  instant: boolean;
}) => {
  const mv = useMotionValue(value);
  const text = useTransform(mv, format);
  useEffect(() => {
    const controls = animate(mv, value, { duration: instant ? 0 : 0.9, ease: EASE });
    return () => controls.stop();
  }, [mv, value, instant]);
  return <motion.span>{text}</motion.span>;
};

export const SpacetimeShrink = () => {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.4 });
  const { mounted, ok } = useMotionOk();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(false);
  const [paused, setPaused] = useState(false);

  // Reduced motion: no autoplay, land on the result.
  useEffect(() => {
    if (mounted && !ok) setIndex(LAST);
  }, [mounted, ok]);

  const autoplay = ok && visible && !picked && !paused;
  useEffect(() => {
    if (!autoplay) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % MILESTONES.length),
      index === LAST ? DWELL * 2.2 : DWELL
    );
    return () => clearTimeout(id);
  }, [autoplay, index]);

  // Keep the active milestone visible in the strip (scrolls the strip only, never the page).
  const strip = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = strip.current;
    const tab = el?.children[index] as HTMLElement | undefined;
    if (!el || !tab) return;
    el.scrollTo({
      left: tab.offsetLeft - el.clientWidth / 2 + tab.clientWidth / 2,
      behavior: ok ? 'smooth' : 'auto'
    });
  }, [index, ok]);

  const m = MILESTONES[index]!;
  const cur = box(m.q, m.t);
  const base = box(BASE.q, BASE.t);
  const lb = box(LEADERBOARD.q, LEADERBOARD.t);
  const share = m.s / BASE.s;
  const spring = ok
    ? { type: 'spring' as const, stiffness: 120, damping: 20, mass: 0.9 }
    : { duration: 0 };

  return (
    <figure
      ref={ref}
      className="card not-prose my-10 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* readout */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-5 sm:grid-cols-[1fr_1fr_1.4fr] sm:p-6">
        <Stat label="Qubits, Q" tone="muted">
          <Ticker value={m.q} format={fmtInt} instant={!ok} />
        </Stat>
        <Stat label="Toffoli gates, T" tone="muted">
          <Ticker value={m.t} format={fmtInt} instant={!ok} />
        </Stat>
        <Stat label="Score, S = Q × T" tone="strong" className="col-span-2 sm:col-span-1">
          <Ticker value={m.s} format={fmtBillions} instant={!ok} />
          <span
            className={cn(
              'ml-2 align-middle text-sm font-medium',
              m.impr > 0 ? 'text-accent' : 'text-subtle'
            )}
          >
            {m.impr > 0 ? `−${m.impr.toFixed(1)}%` : m.impr < 0 ? `+${Math.abs(m.impr).toFixed(1)}%` : 'start'}
          </span>
        </Stat>
      </div>

      {/* the area */}
      <div className="border-y border-border bg-bg/50 px-2 sm:px-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          role="img"
          aria-label={`Score as an area. ${m.run}: ${fmtInt(m.q)} qubits by ${fmtInt(m.t)} Toffoli gates, ${Math.round(share * 100)}% of the original area.`}
        >
          <defs>
            <pattern id="st-toffoli" width="22" height="22" patternUnits="userSpaceOnUse">
              {/* a Toffoli: two controls and a ⊕ target */}
              <g stroke="hsl(var(--accent))" strokeWidth="1" fill="none" opacity="0.55">
                <line x1="11" y1="3" x2="11" y2="19" />
                <circle cx="11" cy="16" r="3.2" />
                <line x1="7.8" y1="16" x2="14.2" y2="16" />
              </g>
              <circle cx="11" cy="4" r="1.4" fill="hsl(var(--accent))" opacity="0.55" />
              <circle cx="11" cy="9" r="1.4" fill="hsl(var(--accent))" opacity="0.55" />
            </pattern>
          </defs>

          {/* axes */}
          <line x1={OX} y1={OY} x2={OX + PW + 6} y2={OY} stroke="hsl(var(--fg))" strokeOpacity={0.5} />
          <line x1={OX} y1={OY} x2={OX} y2={OY - PH - 6} stroke="hsl(var(--fg))" strokeOpacity={0.5} />
          <text x={OX + PW} y={OY + 26} textAnchor="end" className="fill-muted text-[13px]">
            Toffoli gates (time) →
          </text>
          <text
            x={OX - 14}
            y={OY - PH}
            textAnchor="end"
            transform={`rotate(-90 ${OX - 14} ${OY - PH})`}
            className="fill-muted text-[13px]"
          >
            ← Qubits (space)
          </text>

          {/* original circuit */}
          <rect
            {...base}
            fill="none"
            stroke="hsl(var(--fg))"
            strokeOpacity={0.35}
            strokeDasharray="5 5"
          />
          <text x={base.x + base.width - 8} y={base.y + 20} textAnchor="end" className="fill-subtle text-[13px]">
            original circuit
          </text>

          {/* current */}
          <motion.rect
            initial={false}
            animate={cur}
            transition={spring}
            fill="url(#st-toffoli)"
          />
          <motion.rect
            initial={false}
            animate={cur}
            transition={spring}
            fill="hsl(var(--accent))"
            fillOpacity={0.08}
            stroke="hsl(var(--accent))"
            strokeWidth={2}
          />
          <motion.text
            initial={false}
            animate={{ x: cur.x + 2, y: cur.y - 9 }}
            transition={spring}
            className="fill-accent font-mono text-[16px] font-semibold"
          >
            {`${(Math.round(share * 1000) / 10).toFixed(1)}% of the original area`}
          </motion.text>

          {/* community best, for honesty */}
          <rect
            {...lb}
            fill="none"
            stroke="hsl(var(--fg))"
            strokeWidth={1.25}
            strokeDasharray="1.5 3.5"
            strokeLinecap="round"
          />
          <text
            x={lb.x + 8}
            y={lb.y + 18}
            className="fill-fg text-[13px]"
            style={{ paintOrder: 'stroke', stroke: 'hsl(var(--card))', strokeWidth: 4, strokeLinejoin: 'round' }}
          >
            leaderboard best
          </text>
        </svg>
      </div>

      {/* what changed */}
      <div className="min-h-[124px] p-5 sm:p-6" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={m.run}
            initial={ok ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={ok ? { opacity: 0, y: -8 } : { opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <p className="font-mono text-xs text-subtle">{m.run}</p>
            <p className="mt-1 text-[16px] font-medium leading-snug">{m.change}</p>
            {m.call && (
              <p className="mt-2 text-sm leading-snug text-muted">
                <span className="font-medium text-accent">My call: </span>
                {m.call}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* timeline */}
      <div className="px-3 pb-4 sm:px-5">
        <div
          ref={strip}
          role="tablist"
          aria-label="Optimisation milestones"
          className="no-scrollbar relative flex gap-1 overflow-x-auto rounded-full bg-bg p-1"
        >
          {MILESTONES.map((item, i) => {
            const active = i === index;
            return (
              <button
                key={item.run}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setIndex(i);
                  setPicked(true);
                }}
                className={cn(
                  'focus-ring relative flex-1 whitespace-nowrap rounded-full px-2.5 py-1.5 font-mono text-[11.5px] transition-colors',
                  active ? 'text-white' : i < index ? 'text-fg' : 'text-subtle hover:text-fg'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="st-pill"
                    className="absolute inset-0 overflow-hidden rounded-full bg-fg"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  >
                    {autoplay && (
                      <motion.span
                        key={index}
                        className="absolute inset-y-0 left-0 bg-white/15"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{
                          duration: (index === LAST ? DWELL * 2.2 : DWELL) / 1000,
                          ease: 'linear'
                        }}
                      />
                    )}
                  </motion.span>
                )}
                <span className="relative inline-flex items-center gap-1">
                  {item.run}
                  {item.call && (
                    <span
                      aria-label="opened by my call"
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        active ? 'bg-white' : 'bg-accent'
                      )}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 px-2 text-xs text-subtle">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
          a stage opened by one of my rulings. Every run passed all 9,024 validation inputs.
        </p>
      </div>
    </figure>
  );
};

const Stat = ({
  label,
  tone,
  className,
  children
}: {
  label: string;
  tone: 'muted' | 'strong';
  className?: string;
  children: ReactNode;
}) => (
  <div className={className}>
    <p className="text-xs text-subtle">{label}</p>
    <p
      className={cn(
        'mt-1 font-mono tabular-nums tracking-tight',
        tone === 'strong' ? 'text-[28px] font-semibold leading-none' : 'text-[19px] leading-tight text-fg/85'
      )}
    >
      {children}
    </p>
  </div>
);
