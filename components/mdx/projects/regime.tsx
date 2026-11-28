'use client';

import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Fig, gauss, rng, useMotionOk } from '../kit';

/* A synthetic series with known regimes, read by a rolling window. The window only ever sees
   the past, and the label it produces is drawn behind the price as it goes. */

type Regime = 'Calm' | 'Trending' | 'High volatility';
const SEGMENTS: { regime: Regime; n: number; mu: number; sd: number }[] = [
  { regime: 'Calm', n: 55, mu: 0.0002, sd: 0.004 },
  { regime: 'Trending', n: 55, mu: 0.0042, sd: 0.006 },
  { regime: 'High volatility', n: 45, mu: -0.002, sd: 0.02 },
  { regime: 'Calm', n: 45, mu: 0, sd: 0.0045 },
  { regime: 'Trending', n: 50, mu: -0.0045, sd: 0.006 }
];
const WIN = 20;

const DATA = (() => {
  const r = rng(42);
  const rets: number[] = [];
  const truth: Regime[] = [];
  for (const s of SEGMENTS)
    for (let i = 0; i < s.n; i++) {
      rets.push(s.mu + s.sd * gauss(r));
      truth.push(s.regime);
    }
  let p = 100;
  const price = rets.map((x) => (p *= Math.exp(x)));
  const pred: (Regime | null)[] = rets.map((_, t) => {
    if (t < WIN) return null;
    const w = rets.slice(t - WIN, t);
    const mean = w.reduce((a, b) => a + b, 0) / WIN;
    const sd = Math.sqrt(w.reduce((a, b) => a + (b - mean) ** 2, 0) / (WIN - 1));
    if (sd > 0.011) return 'High volatility';
    if (Math.abs(mean) > 0.0022) return 'Trending';
    return 'Calm';
  });
  const stats = rets.map((_, t) => {
    if (t < WIN) return null;
    const w = rets.slice(t - WIN, t);
    const mean = w.reduce((a, b) => a + b, 0) / WIN;
    const sd = Math.sqrt(w.reduce((a, b) => a + (b - mean) ** 2, 0) / (WIN - 1));
    return { mean, sd };
  });
  return { rets, truth, price, pred, stats };
})();
const N = DATA.price.length;

const COLOR: Record<Regime, string> = {
  Calm: 'hsl(var(--success))',
  Trending: 'hsl(var(--fg))',
  'High volatility': 'hsl(var(--accent))'
};

const W = 640;
const H = 240;
const PAD = { l: 8, r: 8, t: 12, b: 34 };
const lo = Math.min(...DATA.price);
const hi = Math.max(...DATA.price);
const x = (i: number) => PAD.l + (i / (N - 1)) * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + ((hi - v) / (hi - lo)) * (H - PAD.t - PAD.b - 14);
const PATH = DATA.price.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');

export const RegimeTape = () => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.4 });
  const { ok, mounted } = useMotionOk();
  const [t, setT] = useState(WIN);

  useEffect(() => {
    if (!mounted) return;
    if (!ok) return setT(N - 1);
    if (!visible) return;
    const c = animate(WIN, N - 1, {
      duration: 11,
      ease: 'linear',
      repeat: Infinity,
      repeatDelay: 2.5,
      onUpdate: (v) => setT(Math.round(v))
    });
    return () => c.stop();
  }, [visible, ok, mounted]);

  const cur = DATA.pred[t] ?? 'Calm';
  const st = DATA.stats[t];

  // collapse predicted labels up to t into runs for the background bands
  const runs: { from: number; to: number; r: Regime }[] = [];
  for (let i = WIN; i <= t; i++) {
    const r = DATA.pred[i]!;
    const last = runs[runs.length - 1];
    if (last && last.r === r) last.to = i;
    else runs.push({ from: i, to: i, r });
  }
  const truthRuns: { from: number; to: number; r: Regime }[] = [];
  DATA.truth.forEach((r, i) => {
    const last = truthRuns[truthRuns.length - 1];
    if (last && last.r === r) last.to = i;
    else truthRuns.push({ from: i, to: i, r });
  });

  return (
    <Fig
      title="A rolling window reads the regime from the past 20 steps"
      note="Synthetic returns with known regimes. The window’s realised volatility and drift become features; here a toy threshold rule stands in for the trained classifier, so you can watch labels form out-of-sample as the window moves."
      illustrative="Synthetic series"
    >
      <div ref={ref} className="p-4 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <p className="text-[11px] text-subtle">Window says</p>
            <p className="text-[18px] font-semibold" style={{ color: COLOR[cur] }}>
              {cur}
            </p>
          </div>
          <div className="font-mono text-[12px] text-muted">
            <p>vol {st ? (st.sd * 100).toFixed(2) : '–'}%</p>
            <p>drift {st ? (st.mean * 100).toFixed(2) : '–'}%</p>
          </div>
          <div className="ml-auto flex flex-wrap gap-3 text-[11.5px] text-muted">
            {(Object.keys(COLOR) as Regime[]).map((r) => (
              <span key={r} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLOR[r], opacity: 0.7 }} />
                {r}
              </span>
            ))}
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="Synthetic price series with rolling-window regime labels">
          <defs>
            <clipPath id="rg-past">
              <rect x={0} y={0} width={x(t)} height={H} />
            </clipPath>
          </defs>
          {runs.map((r, i) => (
            <rect
              key={i}
              x={x(r.from)}
              width={Math.max(1, x(r.to) - x(r.from) + (W - PAD.l - PAD.r) / (N - 1))}
              y={PAD.t - 4}
              height={H - PAD.t - PAD.b - 6}
              fill={COLOR[r.r]}
              fillOpacity={0.1}
            />
          ))}
          <path d={PATH} fill="none" stroke="hsl(var(--fg))" strokeOpacity={0.12} strokeWidth={1.5} />
          <path d={PATH} fill="none" stroke="hsl(var(--fg))" strokeWidth={1.75} clipPath="url(#rg-past)" />
          {/* window bracket */}
          <rect
            x={x(t - WIN)}
            width={x(t) - x(t - WIN)}
            y={PAD.t - 6}
            height={H - PAD.t - PAD.b - 2}
            rx={6}
            fill="hsl(var(--accent))"
            fillOpacity={0.08}
            stroke="hsl(var(--accent))"
            strokeWidth={1.5}
          />
          <circle cx={x(t)} cy={y(DATA.price[t]!)} r={4} fill="hsl(var(--accent))" />
          {/* true regimes */}
          <text x={PAD.l} y={H - 20} className="fill-subtle text-[10px]">true regime</text>
          {truthRuns.map((r, i) => (
            <rect key={i} x={x(r.from)} width={x(r.to) - x(r.from)} y={H - 14} height={8} rx={2} fill={COLOR[r.r]} fillOpacity={0.55} />
          ))}
        </svg>
        <p className={cn('mt-2 text-[12px] text-subtle')}>
          Background: what the window concluded at each step. Bottom strip: the regime the data was generated from.
        </p>
      </div>
    </Fig>
  );
};
