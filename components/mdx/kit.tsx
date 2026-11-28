'use client';

import { useInView } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { EASE, useMotionOk } from './quantum/use-motion-ok';

export { EASE, useMotionOk };

/* Shared pieces for the animated case-study figures. */

export const Fig = ({
  title,
  note,
  illustrative,
  className,
  children
}: {
  title?: string;
  note?: ReactNode;
  /** Adds an "Illustrative" tag: the figure explains a mechanism with sample data. */
  illustrative?: boolean | string;
  className?: string;
  children: ReactNode;
}) => (
  <figure className={cn('card not-prose my-10 overflow-hidden', className)}>
    {children}
    {(title || note || illustrative) && (
      <figcaption className="flex flex-col-reverse items-start gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-between sm:gap-4">
        <span className="min-w-0">
          {title && <span className="block text-sm font-medium">{title}</span>}
          {note && (
            <span className="mt-0.5 block text-xs leading-relaxed text-subtle">{note}</span>
          )}
        </span>
        {illustrative && (
          <span className="chip shrink-0 !px-2 !py-0.5 !text-[11px]">
            {typeof illustrative === 'string' ? illustrative : 'Illustrative'}
          </span>
        )}
      </figcaption>
    )}
  </figure>
);

/**
 * Steps through `times` (seconds from start) while the element is on screen, then loops.
 * Reduced motion: jumps straight to the last step. SSR and first render: step -1.
 */
export const useTimeline = (times: number[], loopAt: number, amount = 0.3) => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount });
  const { mounted, ok } = useMotionOk();
  const [step, setStep] = useState(-1);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!ok || !visible) return;
    const timers = times.map((t, i) => setTimeout(() => setStep(i), t * 1000));
    const loop = setTimeout(() => setCycle((c) => c + 1), loopAt * 1000);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(loop);
    };
    // times/loopAt are constants per figure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok, visible, cycle]);

  return {
    ref,
    step: mounted && !ok ? times.length - 1 : step,
    ok,
    mounted,
    cycle,
    visible
  };
};

/** `go` turns true once the element has been seen (immediately under reduced motion). */
export const useSeen = (amount = 0.4) => {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount });
  const { mounted, ok } = useMotionOk();
  return { ref, go: mounted && (!ok || seen), ok, mounted };
};

/** Small deterministic PRNG so server and client draw identical sample data. */
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Standard normal sample from a uniform source (Box–Muller). */
export const gauss = (r: () => number) => {
  const u = Math.max(r(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
};

export const Dot = ({ className }: { className?: string }) => (
  <span className={cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full', className)} />
);
