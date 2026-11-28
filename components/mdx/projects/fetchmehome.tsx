'use client';

import { animate, AnimatePresence, motion, useInView } from 'framer-motion';
import { Cat, Dog, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Fig, useMotionOk } from '../kit';

/* Location-aware matching: listings inside the radius that match every active filter. */

const MAP_W = 8; // km across
const MAP_H = 5;
const ME = { x: 3.9, y: 2.7 };

type Pet = {
  name: string;
  kind: 'Dog' | 'Cat';
  status: 'Adoption' | 'Lost';
  age: string;
  x: number;
  y: number;
};
const PETS: Pet[] = [
  { name: 'Biscuit', kind: 'Dog', status: 'Adoption', age: '2 yrs', x: 3.1, y: 2.1 },
  { name: 'Mochi', kind: 'Cat', status: 'Adoption', age: '8 mo', x: 4.8, y: 3.2 },
  { name: 'Rocky', kind: 'Dog', status: 'Lost', age: '5 yrs', x: 5.6, y: 1.6 },
  { name: 'Luna', kind: 'Cat', status: 'Lost', age: '3 yrs', x: 2.2, y: 3.6 },
  { name: 'Bruno', kind: 'Dog', status: 'Adoption', age: '1 yr', x: 6.9, y: 3.9 },
  { name: 'Pepper', kind: 'Cat', status: 'Adoption', age: '4 yrs', x: 1.1, y: 1.2 },
  { name: 'Coco', kind: 'Dog', status: 'Adoption', age: '6 mo', x: 4.4, y: 1.0 },
  { name: 'Simba', kind: 'Cat', status: 'Lost', age: '2 yrs', x: 7.2, y: 0.9 }
];
const dist = (p: { x: number; y: number }) => Math.hypot(p.x - ME.x, p.y - ME.y);

export const PetRadar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.4 });
  const { ok, mounted } = useMotionOk();
  const [radius, setRadius] = useState(1.2);
  const [status, setStatus] = useState<'All' | 'Adoption' | 'Lost'>('All');
  const [kinds, setKinds] = useState<Record<'Dog' | 'Cat', boolean>>({ Dog: true, Cat: true });

  // first view: sweep the radius out so the map fills in
  useEffect(() => {
    if (!mounted) return;
    if (!ok) return setRadius(3);
    if (!visible) return;
    const c = animate(1.2, 3, { duration: 2.2, ease: 'easeOut', onUpdate: setRadius });
    return () => c.stop();
  }, [visible, ok, mounted]);

  const matches = PETS.filter(
    (p) => dist(p) <= radius && kinds[p.kind] && (status === 'All' || p.status === status)
  ).sort((a, b) => dist(a) - dist(b));

  const toPct = (p: { x: number; y: number }) => ({ left: `${(p.x / MAP_W) * 100}%`, top: `${(p.y / MAP_H) * 100}%` });

  return (
    <Fig
      title="Adoption listings and lost-pet alerts, filtered by where you are"
      note="One search across both workflows: status, species and distance. Lost-pet reports pulse so they stand out from adoption listings."
      illustrative="Example listings"
    >
      <div ref={ref} className="p-4 sm:p-6">
        {/* controls */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-full bg-bg p-1">
            {(['All', 'Adoption', 'Lost'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  'focus-ring rounded-full px-3 py-1 text-[12.5px] transition-colors',
                  status === s ? 'bg-fg text-white' : 'text-muted hover:text-fg'
                )}
              >
                {s}
              </button>
            ))}
          </div>
          {(['Dog', 'Cat'] as const).map((k) => {
            const Icon = k === 'Dog' ? Dog : Cat;
            return (
              <button
                key={k}
                type="button"
                aria-pressed={kinds[k]}
                onClick={() => setKinds((v) => ({ ...v, [k]: !v[k] }))}
                className={cn(
                  'focus-ring inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12.5px] transition-colors',
                  kinds[k] ? 'border-fg bg-fg text-white' : 'border-border text-muted'
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {k}s
              </button>
            );
          })}
          <label className="ml-auto flex items-center gap-2 text-[12.5px] text-muted">
            Within <span className="w-12 font-mono text-fg">{radius.toFixed(1)} km</span>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.1}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-24 accent-[hsl(var(--accent))] sm:w-32"
            />
          </label>
        </div>

        {/* map */}
        <div className="relative aspect-[8/5] overflow-hidden rounded-2xl border border-border bg-[#f1f0ea]">
          <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="none">
            <path d="M-20,380 C160,330 260,420 420,360 S700,260 820,300" fill="none" stroke="#cfe0ea" strokeWidth="26" />
            <rect x="80" y="250" width="150" height="110" rx="26" fill="#dfe9d6" />
            <rect x="560" y="40" width="120" height="90" rx="22" fill="#dfe9d6" />
            {[100, 200, 300, 400].map((y) => (
              <line key={y} x1="0" x2="800" y1={y} y2={y} stroke="#fff" strokeWidth="7" />
            ))}
            {[130, 260, 390, 520, 650].map((x) => (
              <line key={x} x1={x} x2={x} y1="0" y2="500" stroke="#fff" strokeWidth="7" />
            ))}
            <line x1="0" y1="470" x2="800" y2="40" stroke="#fff" strokeWidth="11" />
          </svg>

          {/* radius */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/60 bg-accent/[0.07]"
            style={{
              ...toPct(ME),
              width: `${((radius * 2) / MAP_W) * 100}%`,
              aspectRatio: '1 / 1'
            }}
          />

          {/* pets */}
          {PETS.map((p) => {
            const on = matches.includes(p);
            const Icon = p.kind === 'Dog' ? Dog : Cat;
            return (
              <motion.div
                key={p.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={toPct(p)}
                initial={false}
                animate={{ opacity: on ? 1 : 0.28, scale: on ? 1 : 0.8 }}
                transition={{ duration: ok ? 0.25 : 0 }}
              >
                {p.status === 'Lost' && on && ok && (
                  <span className="animate-ping-soft absolute inset-0 rounded-full bg-accent" />
                )}
                <span
                  className={cn(
                    'relative grid h-8 w-8 place-items-center rounded-full border-2 border-card shadow-chip',
                    p.status === 'Lost' ? 'bg-accent text-white' : 'bg-card text-fg'
                  )}
                  title={`${p.name}, ${p.status}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </motion.div>
            );
          })}

          {/* me */}
          <div className="absolute -translate-x-1/2 -translate-y-full text-fg" style={toPct(ME)}>
            <MapPin className="h-7 w-7 fill-fg text-card" />
          </div>
        </div>

        {/* results */}
        <div className="mt-4">
          <p className="text-[12px] text-subtle">
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}, nearest first
          </p>
          <ul className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
            <AnimatePresence initial={false} mode="popLayout">
              {matches.map((p) => (
                <motion.li
                  key={p.name}
                  layout={ok}
                  initial={ok ? { opacity: 0, scale: 0.9 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-[132px] rounded-xl border border-border px-3 py-2"
                >
                  <p className="flex items-center justify-between gap-2 text-[13px] font-medium">
                    {p.name}
                    <span
                      className={cn(
                        'rounded-full px-1.5 text-[10px] font-medium',
                        p.status === 'Lost' ? 'bg-accent/15 text-accent' : 'bg-success/15 text-success'
                      )}
                    >
                      {p.status}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-subtle">
                    {p.kind} · {p.age} · {dist(p).toFixed(1)} km
                  </p>
                </motion.li>
              ))}
            </AnimatePresence>
            {matches.length === 0 && (
              <li className="text-[13px] text-muted">Nothing here. Widen the radius or turn a filter back on.</li>
            )}
          </ul>
        </div>
      </div>
    </Fig>
  );
};
