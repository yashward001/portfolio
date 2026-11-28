'use client';

import { animate, useInView } from 'framer-motion';
import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Fig, useMotionOk } from '../kit';

/* Black–Scholes, live: analytical Greeks next to finite-difference estimates of the same thing. */

const erf = (x: number) => {
  // Abramowitz & Stegun 7.1.26 (|error| < 1.5e-7)
  const s = Math.sign(x);
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-a * a);
  return s * y;
};
const N = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));
const phi = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

type P = { S: number; K: number; sigma: number; T: number; r: number; call: boolean };

const price = ({ S, K, sigma, T, r, call }: P) => {
  const sq = sigma * Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / sq;
  const d2 = d1 - sq;
  const df = Math.exp(-r * T);
  return call ? S * N(d1) - K * df * N(d2) : K * df * N(-d2) - S * N(-d1);
};

const analytic = (p: P) => {
  const { S, K, sigma, T, r, call } = p;
  const sq = sigma * Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / sq;
  const d2 = d1 - sq;
  const df = Math.exp(-r * T);
  const common = (-S * phi(d1) * sigma) / (2 * Math.sqrt(T));
  return {
    delta: call ? N(d1) : N(d1) - 1,
    gamma: phi(d1) / (S * sq),
    vega: (S * phi(d1) * Math.sqrt(T)) / 100, // per 1 vol point
    theta: (call ? common - r * K * df * N(d2) : common + r * K * df * N(-d2)) / 365 // per day
  };
};

const finiteDiff = (p: P) => {
  const h = p.S * 0.01;
  const v = price(p);
  const up = price({ ...p, S: p.S + h });
  const dn = price({ ...p, S: p.S - h });
  const ds = 0.001;
  const dt = 1 / 365;
  return {
    delta: (up - dn) / (2 * h),
    gamma: (up - 2 * v + dn) / (h * h),
    vega: (price({ ...p, sigma: p.sigma + ds }) - price({ ...p, sigma: p.sigma - ds })) / (2 * ds) / 100,
    theta: -(price({ ...p, T: p.T + dt }) - price({ ...p, T: p.T - dt })) / (2 * dt) / 365
  };
};

const W = 560;
const H = 220;
const PAD = { l: 36, r: 12, t: 12, b: 26 };

export const GreeksLab = () => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.4 });
  const { ok } = useMotionOk();
  const [p, setP] = useState<P>({ S: 105, K: 100, sigma: 0.25, T: 0.5, r: 0.04, call: true });
  const [sweeping, setSweeping] = useState(false);

  const sweep = () => {
    if (!ok) return;
    setSweeping(true);
    const c = animate(0.1, 0.7, {
      duration: 3.2,
      ease: 'easeInOut',
      onUpdate: (s) => setP((q) => ({ ...q, sigma: s })),
      onComplete: () => {
        animate(0.7, 0.25, {
          duration: 1.4,
          ease: 'easeOut',
          onUpdate: (s) => setP((q) => ({ ...q, sigma: s })),
          onComplete: () => setSweeping(false)
        });
      }
    });
    return () => c.stop();
  };

  useEffect(() => {
    if (visible && ok) sweep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, ok]);

  const v = price(p);
  const a = analytic(p);
  const fd = finiteDiff(p);

  // value curve across spot
  const SMIN = p.K * 0.5;
  const SMAX = p.K * 1.5;
  const pts = Array.from({ length: 81 }, (_, i) => SMIN + ((SMAX - SMIN) * i) / 80);
  const vals = pts.map((s) => price({ ...p, S: s }));
  const intr = pts.map((s) => Math.max(p.call ? s - p.K : p.K - s, 0));
  const YMAX = Math.max(...vals, ...intr) * 1.05;
  const sx = (s: number) => PAD.l + ((s - SMIN) / (SMAX - SMIN)) * (W - PAD.l - PAD.r);
  const sy = (y: number) => PAD.t + (1 - y / YMAX) * (H - PAD.t - PAD.b);
  const path = (ys: number[]) => ys.map((y, i) => `${i ? 'L' : 'M'}${sx(pts[i]!).toFixed(1)},${sy(y).toFixed(1)}`).join('');

  const set = (k: keyof P) => (e: React.ChangeEvent<HTMLInputElement>) => setP((q) => ({ ...q, [k]: Number(e.target.value) }));

  const rows: { name: string; key: keyof typeof a; unit: string; dp: number }[] = [
    { name: 'Delta', key: 'delta', unit: '', dp: 4 },
    { name: 'Gamma', key: 'gamma', unit: '', dp: 5 },
    { name: 'Vega', key: 'vega', unit: 'per vol pt', dp: 4 },
    { name: 'Theta', key: 'theta', unit: 'per day', dp: 4 }
  ];

  return (
    <Fig
      title="Pricing and Greeks, cross-checked two ways"
      note="Every Greek is computed analytically and again by bumping the input and repricing. The two columns agreeing is the consistency check; the curve is the option’s value across spot prices, with the payoff at expiry dashed."
      illustrative="Live calculator"
    >
      <div ref={ref} className="grid gap-6 p-4 sm:p-6 md:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex gap-1 rounded-full bg-bg p-1">
              {(['Call', 'Put'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setP((q) => ({ ...q, call: k === 'Call' }))}
                  className={cn(
                    'focus-ring rounded-full px-3 py-1 text-[12.5px] transition-colors',
                    (k === 'Call') === p.call ? 'bg-fg text-white' : 'text-muted hover:text-fg'
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
            <p className="font-mono text-[13px]">
              <span className="text-subtle">value </span>
              <span className="text-[18px] font-semibold">{v.toFixed(3)}</span>
            </p>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="Option value across spot prices">
            <line x1={PAD.l} x2={W - PAD.r} y1={sy(0)} y2={sy(0)} stroke="hsl(var(--border))" />
            <line x1={sx(p.K)} x2={sx(p.K)} y1={PAD.t} y2={H - PAD.b} stroke="hsl(var(--border))" strokeDasharray="3 4" />
            <text x={sx(p.K)} y={H - 8} textAnchor="middle" className="fill-subtle font-mono text-[11px]">
              K={p.K}
            </text>
            <path d={path(intr)} fill="none" stroke="hsl(var(--fg))" strokeOpacity={0.35} strokeDasharray="5 5" strokeWidth={1.5} />
            <path d={path(vals)} fill="none" stroke="hsl(var(--accent))" strokeWidth={2.5} />
            {/* tangent = delta */}
            {(() => {
              const dx = (SMAX - SMIN) * 0.12;
              return (
                <line
                  x1={sx(p.S - dx)}
                  y1={sy(v - a.delta * dx)}
                  x2={sx(p.S + dx)}
                  y2={sy(v + a.delta * dx)}
                  stroke="hsl(var(--fg))"
                  strokeWidth={1.25}
                />
              );
            })()}
            <circle cx={sx(p.S)} cy={sy(v)} r={5.5} fill="hsl(var(--fg))" stroke="hsl(var(--card))" strokeWidth={2} />
            <text x={sx(p.S) + 9} y={sy(v) - 9} className="fill-fg text-[11px]">
              slope = delta
            </text>
          </svg>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            <Slider label="Spot S" value={p.S} min={60} max={140} step={0.5} fmt={(n) => n.toFixed(1)} onChange={set('S')} />
            <Slider label="Strike K" value={p.K} min={80} max={120} step={1} fmt={(n) => n.toFixed(0)} onChange={set('K')} />
            <Slider label="Volatility σ" value={p.sigma} min={0.05} max={0.8} step={0.01} fmt={(n) => `${(n * 100).toFixed(0)}%`} onChange={set('sigma')} highlight={sweeping} />
            <Slider label="Maturity T" value={p.T} min={0.05} max={2} step={0.05} fmt={(n) => `${n.toFixed(2)}y`} onChange={set('T')} />
            <Slider label="Rate r" value={p.r} min={0} max={0.1} step={0.005} fmt={(n) => `${(n * 100).toFixed(1)}%`} onChange={set('r')} />
            <button
              type="button"
              onClick={sweep}
              disabled={sweeping || !ok}
              className="focus-ring inline-flex items-center justify-center gap-1.5 self-end rounded-full border border-border px-3 py-1.5 text-[12px] font-medium transition hover:border-fg/30 disabled:opacity-50"
            >
              <Play className="h-3 w-3" /> Sweep σ
            </button>
          </div>
        </div>

        <div>
          <table className="w-full text-left text-[12.5px]">
            <thead>
              <tr className="text-[11px] text-subtle">
                <th className="pb-2 font-normal">Greek</th>
                <th className="pb-2 text-right font-normal">Analytical</th>
                <th className="pb-2 text-right font-normal">Finite diff.</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {rows.map((row) => {
                const diff = Math.abs(a[row.key] - fd[row.key]);
                return (
                  <tr key={row.name} className="border-t border-border">
                    <td className="py-2.5 font-sans">
                      <span className="font-medium">{row.name}</span>
                      {row.unit && <span className="block text-[10.5px] text-subtle">{row.unit}</span>}
                    </td>
                    <td className="py-2.5 text-right">{a[row.key].toFixed(row.dp)}</td>
                    <td className="py-2.5 text-right">
                      {fd[row.key].toFixed(row.dp)}
                      <span className="block text-[10px] text-subtle">Δ {diff.toExponential(1)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-[11.5px] leading-relaxed text-subtle">
            Bumps: spot ±1%, vol ±0.1 pt, maturity ±1 day. Small differences are the expected truncation error of
            central differences.
          </p>
        </div>
      </div>
    </Fig>
  );
};

const Slider = ({
  label,
  value,
  min,
  max,
  step,
  fmt,
  onChange,
  highlight
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt: (n: number) => string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  highlight?: boolean;
}) => (
  <label className="block">
    <span className="flex items-baseline justify-between text-[11px] text-subtle">
      {label}
      <span className={cn('font-mono text-[12px]', highlight ? 'text-accent' : 'text-fg')}>{fmt(value)}</span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full accent-[hsl(var(--accent))]"
    />
  </label>
);
