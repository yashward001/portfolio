'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { EASE, useMotionOk } from './use-motion-ok';

/* y² = x³ + 7 (secp256k1's curve, drawn over the reals so it can be seen). */

const W = 480;
const H = 300;
const X0 = -2.3;
const X1 = 3.0;
const YMAX = 6.2;
const sx = (x: number) => 24 + ((x - X0) / (X1 - X0)) * (W - 48);
const sy = (y: number) => H / 2 - (y / YMAX) * (H / 2 - 18);

const ROOT = -Math.cbrt(7);
const curvePath = (() => {
  const n = 90;
  const smax = Math.sqrt(X1 - ROOT);
  const upper: string[] = [];
  const lower: string[] = [];
  for (let i = n; i >= 0; i--) {
    const s = (i / n) * smax;
    const x = ROOT + s * s;
    upper.push(`${sx(x).toFixed(2)},${sy(Math.sqrt(Math.max(0, x ** 3 + 7))).toFixed(2)}`);
  }
  for (let i = 1; i <= n; i++) {
    const s = (i / n) * smax;
    const x = ROOT + s * s;
    lower.push(`${sx(x).toFixed(2)},${sy(-Math.sqrt(x ** 3 + 7)).toFixed(2)}`);
  }
  return `M${[...upper, ...lower].join('L')}`;
})();

type Pt = { x: number; y: number };

const add = (p: Pt, k: Pt) => {
  const l = (k.y - p.y) / (k.x - p.x);
  const x3 = l * l - p.x - k.x;
  const y3 = l * (p.x - x3) - p.y;
  return { l, sum: { x: x3, y: y3 }, third: { x: x3, y: -y3 } };
};

const onCurve = (x: number, sign: 1 | -1): Pt => ({ x, y: sign * Math.sqrt(x ** 3 + 7) });

const K = onCurve(0.5, 1);
const P = onCurve(-1.8, 1);
const MAIN = add(P, K);

const chord = (p: Pt, l: number, from: number, to: number) => ({
  x1: sx(from),
  y1: sy(p.y + l * (from - p.x)),
  x2: sx(to),
  y2: sy(p.y + l * (to - p.x))
});

const inView = (q: Pt) => q.x > X0 + 0.05 && q.x < X1 - 0.05 && Math.abs(q.y) < YMAX - 0.3;

/** Many inputs at once: the same addition, fanned out over other points P. */
const GHOSTS = [-1.85, -1.6, -1.2, -0.6, 0.0, 1.0, 1.6, 2.2, -1.4, -0.2, 1.3, 2.6]
  .flatMap((x, i) => [onCurve(x, i % 2 === 0 ? 1 : -1)])
  .filter((p) => Math.abs(p.x - K.x) > 0.15)
  .map((p) => ({ p, ...add(p, K) }))
  .filter((g) => inView(g.sum) && inView(g.third))
  .slice(0, 8);

const STEPS = [
  { at: 0, text: 'The curve: y² = x³ + 7. Bitcoin and Ethereum sign with it.' },
  { at: 1.6, text: 'Take a point P and a fixed point K.' },
  { at: 2.5, text: 'The line through them hits the curve a third time.' },
  { at: 3.6, text: 'Reflect that point across the x-axis to get P + K.' },
  { at: 4.8, text: 'Shor’s algorithm does this on a superposition of inputs, with every number 256 qubits wide.' }
];
const LOOP = 9.5; // seconds per cycle

const FORMULAS = [
  { tex: 'λ = (y_K − y_P) · (x_K − x_P)⁻¹ mod p', step: 2 },
  { tex: 'x₃ = λ² − x_P − x_K mod p', step: 3 },
  { tex: 'y₃ = λ · (x_P − x₃) − y_P mod p', step: 3 }
];

export const PointAddition = () => {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.35 });
  const { mounted, ok } = useMotionOk();
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  // Reduced motion: show the finished picture, no loop.
  const final = STEPS.length - 1;
  const shown = mounted && !ok ? final : step;

  useEffect(() => {
    if (!ok || !visible) return;
    const timers = STEPS.map((s, i) => setTimeout(() => setStep(i), s.at * 1000));
    const loop = setTimeout(() => setCycle((c) => c + 1), LOOP * 1000);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(loop);
    };
  }, [ok, visible, cycle]);

  const on = (n: number) => shown >= n;
  const t = (delay = 0) => ({ duration: ok ? 0.7 : 0, delay: ok ? delay : 0, ease: EASE });
  const c = chord(P, MAIN.l, P.x - 0.35, MAIN.third.x + 0.35);

  return (
    <figure ref={ref} className="card not-prose my-10 overflow-hidden">
      <div className="relative bg-[radial-gradient(ellipse_at_70%_20%,hsl(var(--accent)/0.07),transparent_60%)]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          role="img"
          aria-label="Elliptic-curve point addition: the line through P and K meets the curve at a third point, whose reflection is P + K."
        >
          <defs>
            <clipPath id="pa-plot">
              <rect x="0" y="0" width={W} height={H} />
            </clipPath>
          </defs>

          {/* axes */}
          <line x1={sx(X0)} x2={sx(X1)} y1={sy(0)} y2={sy(0)} stroke="hsl(var(--border))" />
          <line x1={sx(0)} x2={sx(0)} y1={12} y2={H - 12} stroke="hsl(var(--border))" />

          <motion.path
            d={curvePath}
            fill="none"
            stroke="hsl(var(--fg))"
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: mounted && (!ok || visible) ? 1 : 0 }}
            transition={{ duration: ok ? 1.4 : 0, ease: EASE }}
          />

          <g clipPath="url(#pa-plot)">
            {/* superposition fan-out */}
            {GHOSTS.map((g, i) => {
              const xs = [g.p.x, K.x, g.third.x];
              const gc = chord(g.p, g.l, Math.min(...xs) - 0.2, Math.max(...xs) + 0.2);
              return (
                <motion.g
                  key={i}
                  initial={false}
                  animate={{ opacity: on(4) ? 1 : 0 }}
                  transition={t(i * 0.06)}
                >
                  <line {...gc} stroke="hsl(var(--accent))" strokeOpacity={0.22} strokeWidth={1} />
                  <circle cx={sx(g.p.x)} cy={sy(g.p.y)} r={2.5} fill="hsl(var(--fg))" fillOpacity={0.35} />
                  <circle cx={sx(g.sum.x)} cy={sy(g.sum.y)} r={3} fill="hsl(var(--accent))" fillOpacity={0.55} />
                </motion.g>
              );
            })}

            {/* chord through P and K */}
            <motion.line
              {...c}
              stroke="hsl(var(--accent))"
              strokeWidth={1.75}
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: on(2) ? 1 : 0, opacity: on(2) ? 1 : 0 }}
              transition={{ duration: ok ? 0.9 : 0, ease: EASE }}
            />
            {/* reflection */}
            <motion.line
              x1={sx(MAIN.third.x)}
              x2={sx(MAIN.third.x)}
              y1={sy(MAIN.third.y)}
              y2={sy(MAIN.sum.y)}
              stroke="hsl(var(--fg))"
              strokeOpacity={0.45}
              strokeDasharray="4 5"
              initial={false}
              animate={{ opacity: on(3) ? 1 : 0 }}
              transition={t()}
            />
          </g>

          <Dot pt={P} label="P" show={on(1)} transition={t()} />
          <Dot pt={K} label="K" show={on(1)} transition={t(0.15)} />
          <Dot pt={MAIN.third} label="" hollow show={on(2)} transition={t(0.7)} />
          <Dot pt={MAIN.sum} label="P + K" accent show={on(3)} transition={t(0.35)} pulse={ok && on(3)} />
        </svg>
      </div>

      <figcaption className="grid gap-4 border-t border-border p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-8">
        <p className="min-h-[3em] text-[15px] leading-snug text-fg" aria-live="polite">
          {STEPS[shown]?.text}
        </p>
        <ul className="space-y-1 font-mono text-[12px] leading-relaxed">
          {FORMULAS.map((f) => (
            <li
              key={f.tex}
              className={cn(
                'whitespace-nowrap transition-colors duration-500',
                shown === f.step ? 'text-accent' : 'text-subtle'
              )}
            >
              {f.tex}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
};

const Dot = ({
  pt,
  label,
  show,
  transition,
  accent,
  hollow,
  pulse
}: {
  pt: Pt;
  label: string;
  show: boolean;
  transition: object;
  accent?: boolean;
  hollow?: boolean;
  pulse?: boolean;
}) => {
  const cx = sx(pt.x);
  const cy = sy(pt.y);
  const color = accent ? 'hsl(var(--accent))' : 'hsl(var(--fg))';
  return (
    <motion.g
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.2 }}
      transition={transition}
      style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box' }}
    >
      {pulse && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={6}
          fill="none"
          stroke={color}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: 1.4, repeat: 2, ease: 'easeOut' }}
          style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box' }}
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={hollow ? 5 : 6}
        fill={hollow ? 'hsl(var(--card))' : color}
        stroke={color}
        strokeWidth={hollow ? 1.5 : 0}
      />
      {label && (
        <text
          x={accent ? cx - 14 : cx + 10}
          y={cy + (pt.y > 0 ? -10 : 5)}
          textAnchor={accent ? 'end' : 'start'}
          className="fill-fg font-mono text-[14px] font-medium"
          style={accent ? { fill: color } : undefined}
        >
          {label}
        </text>
      )}
    </motion.g>
  );
};
