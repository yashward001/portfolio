'use client';

import { animate, motion, useInView } from 'framer-motion';
import { Ban } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { EASE, Fig, useMotionOk, useTimeline } from '../kit';

/* ─── Long straddle payoff at expiry ───────────────────────────────────── */

const K = 100;
const CALL = 4;
const PUT = 4;
const SMIN = 70;
const SMAX = 130;
const YMIN = -12;
const YMAX = 24;
const W = 560;
const H = 250;
const PAD = { l: 40, r: 16, t: 14, b: 30 };
const px = (s: number) => PAD.l + ((s - SMIN) / (SMAX - SMIN)) * (W - PAD.l - PAD.r);
const py = (v: number) => PAD.t + ((YMAX - v) / (YMAX - YMIN)) * (H - PAD.t - PAD.b);

const callPnl = (s: number) => Math.max(s - K, 0) - CALL;
const putPnl = (s: number) => Math.max(K - s, 0) - PUT;
const total = (s: number) => callPnl(s) + putPnl(s);

const line = (f: (s: number) => number) =>
  [SMIN, K, SMAX].map((s, i) => `${i ? 'L' : 'M'}${px(s).toFixed(1)},${py(Math.max(YMIN, Math.min(YMAX, f(s)))).toFixed(1)}`).join('');

const fmt = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}`;

export const StraddlePayoff = () => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.4 });
  const { ok } = useMotionOk();
  const [s, setS] = useState(K + 14);
  const [touched, setTouched] = useState(false);

  // Until someone grabs the slider, the price wanders through both wings.
  useEffect(() => {
    if (!ok || !visible || touched) return;
    const c = animate(s, [s, 76, 124, s], {
      duration: 9,
      ease: 'easeInOut',
      repeat: Infinity,
      onUpdate: (v) => setS(v)
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok, visible, touched]);

  const v = total(s);
  const profit = v >= 0;

  return (
    <Fig
      title="Long straddle: buy a call and a put at the same strike"
      note="It pays when the price moves far in either direction, and loses at most the premium paid if it goes nowhere. Strike 100, premiums 4 + 4, so break-even is 92 or 108."
      illustrative="Example numbers"
    >
      <div ref={ref} className="p-4 sm:p-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="Long straddle profit and loss at expiry">
          <defs>
            <clipPath id="sd-profit">
              <rect x={PAD.l} y={PAD.t} width={W} height={py(0) - PAD.t} />
            </clipPath>
            <clipPath id="sd-loss">
              <rect x={PAD.l} y={py(0)} width={W} height={H} />
            </clipPath>
          </defs>
          {/* grid */}
          {[-8, 0, 8, 16].map((g) => (
            <g key={g}>
              <line x1={PAD.l} x2={W - PAD.r} y1={py(g)} y2={py(g)} stroke="hsl(var(--border))" strokeWidth={g === 0 ? 1.5 : 1} />
              <text x={PAD.l - 8} y={py(g) + 4} textAnchor="end" className="fill-subtle font-mono text-[11px]">
                {g > 0 ? `+${g}` : g}
              </text>
            </g>
          ))}
          {[80, 92, 100, 108, 120].map((t) => (
            <text key={t} x={px(t)} y={H - 8} textAnchor="middle" className={cn('font-mono text-[11px]', t === 92 || t === 108 ? 'fill-accent' : 'fill-subtle')}>
              {t}
            </text>
          ))}
          {/* shaded regions under the payoff */}
          <path d={`${line(total)}L${px(SMAX)},${py(0)}L${px(SMIN)},${py(0)}Z`} fill="hsl(var(--success))" fillOpacity={0.12} clipPath="url(#sd-profit)" />
          <path d={`${line(total)}L${px(SMAX)},${py(0)}L${px(SMIN)},${py(0)}Z`} fill="hsl(var(--accent))" fillOpacity={0.12} clipPath="url(#sd-loss)" />
          {/* legs */}
          <path d={line(callPnl)} fill="none" stroke="hsl(var(--fg))" strokeOpacity={0.35} strokeDasharray="4 4" />
          <path d={line(putPnl)} fill="none" stroke="hsl(var(--fg))" strokeOpacity={0.35} strokeDasharray="4 4" />
          <text x={px(126)} y={py(callPnl(126)) - 8} textAnchor="end" className="fill-subtle text-[11px]">call leg</text>
          <text x={px(74)} y={py(putPnl(74)) - 8} className="fill-subtle text-[11px]">put leg</text>
          {/* payoff */}
          <path d={line(total)} fill="none" stroke="hsl(var(--fg))" strokeWidth={2.5} strokeLinejoin="round" />
          {/* marker */}
          <line x1={px(s)} x2={px(s)} y1={PAD.t} y2={H - PAD.b} stroke="hsl(var(--fg))" strokeOpacity={0.2} />
          <circle cx={px(s)} cy={py(v)} r={6.5} fill={profit ? 'hsl(var(--success))' : 'hsl(var(--accent))'} stroke="hsl(var(--card))" strokeWidth={2.5} />
        </svg>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Read label="Price at expiry" value={s.toFixed(1)} />
          <Read label="Call leg" value={fmt(callPnl(s))} />
          <Read label="Put leg" value={fmt(putPnl(s))} />
          <Read label="Straddle P&L" value={fmt(v)} tone={profit ? 'good' : 'bad'} />
        </div>

        <label className="mt-4 block">
          <span className="sr-only">Price at expiry</span>
          <input
            type="range"
            min={SMIN}
            max={SMAX}
            step={0.5}
            value={s}
            onChange={(e) => {
              setTouched(true);
              setS(Number(e.target.value));
            }}
            className="w-full accent-[hsl(var(--accent))]"
          />
        </label>
        <p className="text-xs text-subtle">{touched ? 'Drag to move the price.' : 'Drag the slider to take over.'}</p>
      </div>
    </Fig>
  );
};

const Read = ({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'bad' }) => (
  <div className="rounded-xl bg-bg px-3 py-2">
    <p className="text-[11px] text-subtle">{label}</p>
    <p
      className={cn(
        'font-mono text-[16px] font-semibold tabular-nums',
        tone === 'good' && 'text-success',
        tone === 'bad' && 'text-accent'
      )}
    >
      {value}
    </p>
  </div>
);

/* ─── The decision loop ─────────────────────────────────────────────── */

const ACTIONS = ['Enter straddle', 'Hold', 'Exit'] as const;
const ROUNDS: { q: number[]; blocked?: number; why?: string }[] = [
  { q: [0.62, 0.31, 0.12] },
  { q: [0.71, 0.44, 0.2], blocked: 0, why: 'exposure cap reached' },
  { q: [0.18, 0.36, 0.58] }
];
const LOOP_T = [0, 1.1, 2.2, 3.3, 4.4];
const ROUND = 6.2;
const STAGES = [
  { label: 'Market + sentiment', sub: 'aligned timestamps' },
  { label: 'Transformer encoder', sub: 'sequence features' },
  { label: 'DQN', sub: 'Q-value per action' },
  { label: 'Risk constraints', sub: 'bounded exposure' },
  { label: 'Action', sub: 'then reward' }
];

export const DqnLoop = () => {
  const times = ROUNDS.flatMap((_, r) => LOOP_T.map((t) => r * ROUND + t));
  const { ref, step, ok } = useTimeline(times, ROUNDS.length * ROUND);
  const r = step < 0 ? 0 : Math.floor(step / LOOP_T.length);
  const stage = step < 0 ? -1 : step % LOOP_T.length;
  const round = ROUNDS[r]!;
  const allowed = round.q.map((q, i) => (i === round.blocked ? -Infinity : q));
  const choice = allowed.indexOf(Math.max(...allowed));

  return (
    <Fig
      title="Each step: encode the market, score actions, enforce risk, act"
      note="A DQN picks the action with the highest value, but only among actions the risk layer allows. The highest-value action isn’t always permitted."
      illustrative="Example values"
    >
      <div ref={ref} className="space-y-6 p-5 sm:p-6">
        <ol className="flex flex-wrap gap-2">
          {STAGES.map((st, i) => (
            <li
              key={st.label}
              className={cn(
                'rounded-xl border px-3 py-2 transition-all duration-300',
                stage === i ? 'border-accent bg-accent/10' : stage > i ? 'border-fg/20' : 'border-border opacity-60'
              )}
            >
              <span className="block text-[13px] font-medium">{st.label}</span>
              <span className="block text-[11px] text-subtle">{st.sub}</span>
            </li>
          ))}
        </ol>

        <div>
          <div className="flex items-baseline justify-between text-xs text-subtle">
            <span>Q-values, round {r + 1}</span>
            <span>{round.why && stage >= 3 ? `Blocked: ${round.why}` : ''}</span>
          </div>
          <ul className="mt-3 space-y-2.5">
            {ACTIONS.map((a, i) => {
              const blocked = round.blocked === i && stage >= 3;
              const chosen = stage >= 4 && i === choice;
              return (
                <li key={a} className="grid grid-cols-[110px_1fr_44px] items-center gap-3 text-[13px] sm:grid-cols-[130px_1fr_48px]">
                  <span className={cn('inline-flex items-center gap-1.5', chosen && 'font-semibold', blocked && 'text-subtle line-through')}>
                    {blocked && <Ban className="h-3.5 w-3.5 text-accent" />}
                    {a}
                  </span>
                  <span className="relative h-3 overflow-hidden rounded-full bg-bg">
                    <motion.span
                      className={cn(
                        'absolute inset-y-0 left-0 rounded-full',
                        chosen ? 'bg-accent' : blocked ? 'bg-fg/10' : 'bg-fg/30'
                      )}
                      initial={false}
                      animate={{ width: stage >= 2 ? `${round.q[i]! * 100}%` : '0%' }}
                      transition={{ duration: ok ? 0.6 : 0, ease: EASE }}
                    />
                  </span>
                  <span className="text-right font-mono text-[12px] text-muted">
                    {stage >= 2 ? round.q[i]!.toFixed(2) : '··'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Fig>
  );
};
