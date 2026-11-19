'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

import { Avatar } from '@/components/home/avatar';
import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

/* The hero headline "decodes" like a language model: each word is sampled token by token,
   flickering through rejected candidates before it commits. One word shows its candidate
   distribution. Final text is always in the DOM for SEO / screen readers. */

type Candidate = { t: string; p: number };
type Piece =
  | {
      kind: 'token';
      text: string;
      tone?: 'subtle' | 'accent';
      alts?: string[];
      probe?: Candidate[];
    }
  | { kind: 'avatar' }
  | { kind: 'pill' };

const LINES: Piece[][] = [
  [
    { kind: 'token', text: 'Hi,', alts: ['Hey,', 'Hello,'] },
    { kind: 'token', text: 'I’m', alts: ['I am'] },
    { kind: 'avatar' },
    { kind: 'token', text: 'Yashwardhan!', alts: ['Yash!', 'Yashwar…'] }
  ],
  [
    { kind: 'token', text: 'I’m an', tone: 'subtle' },
    {
      kind: 'token',
      text: 'AI engineer',
      probe: [
        { t: 'AI engineer', p: 0.87 },
        { t: 'ML engineer', p: 0.09 },
        { t: 'systems nerd', p: 0.04 }
      ]
    },
    {
      kind: 'token',
      text: 'studying',
      tone: 'subtle',
      alts: ['building', 'learning']
    }
  ],
  [
    {
      kind: 'token',
      text: 'CS at NTU.',
      tone: 'accent',
      alts: ['CS @ NTU', 'CS at N…']
    },
    { kind: 'pill' }
  ]
];

const FLAT = LINES.flat();
const TOKEN_COUNT = FLAT.filter((p) => p.kind === 'token').length;

type Phase = {
  step: number;
  alt: number | null;
  probe: 'off' | 'filling' | 'picked';
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const TokenHeadline = () => {
  const reduceMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Phase>({
    step: -1,
    alt: null,
    probe: 'off'
  });
  const [elapsed, setElapsed] = useState<number | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      setPhase({ step: FLAT.length, alt: null, probe: 'off' });
      return;
    }
    let cancelled = false;
    const started = performance.now();
    setElapsed(null);

    (async () => {
      setPhase({ step: -1, alt: null, probe: 'off' });
      await wait(350);
      for (let i = 0; i < FLAT.length; i++) {
        if (cancelled) return;
        const piece = FLAT[i];
        if (piece.kind === 'token' && piece.alts) {
          for (let a = 0; a < piece.alts.length; a++) {
            setPhase({ step: i, alt: a, probe: 'off' });
            await wait(75);
            if (cancelled) return;
          }
        }
        if (piece.kind === 'token' && piece.probe) {
          setPhase({ step: i, alt: null, probe: 'filling' });
          await wait(650);
          if (cancelled) return;
          setPhase({ step: i, alt: null, probe: 'picked' });
          await wait(420);
          if (cancelled) return;
        }
        setPhase({ step: i + 1, alt: null, probe: 'off' });
        await wait(piece.kind === 'token' ? 95 : 160);
      }
      if (!cancelled) setElapsed((performance.now() - started) / 1000);
    })();

    return () => {
      cancelled = true;
    };
  }, [run, reduceMotion]);

  const done = phase.step >= FLAT.length;
  let index = -1;

  return (
    <div className="space-y-4">
      <h1
        id="hero-title"
        aria-label={`Hi, I’m Yashwardhan! I’m an AI engineer studying CS at NTU. ${profile.availability}.`}
        className="text-[clamp(2.25rem,7vw,3.6rem)] font-semibold leading-[1.12] tracking-[-0.035em]"
      >
        {LINES.map((line, li) => (
          <span
            key={li}
            aria-hidden
            className={cn(
              li === 2 ? 'flex flex-wrap items-center gap-x-5 gap-y-3' : 'block'
            )}
          >
            {line.map((piece, pi) => {
              index += 1;
              const i = index;
              const committed = phase.step > i;
              const active = phase.step === i;
              const space = pi < line.length - 1 && li !== 2 ? ' ' : null;

              if (piece.kind === 'avatar') {
                return (
                  <Fragment key={pi}>
                    <motion.span
                      className="inline-block"
                      initial={false}
                      animate={
                        committed
                          ? { scale: 1, rotate: 0, opacity: 1 }
                          : { scale: 0.2, rotate: -25, opacity: 0 }
                      }
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 18
                      }}
                    >
                      <Avatar className="mx-1" />
                    </motion.span>
                    {space}
                  </Fragment>
                );
              }

              if (piece.kind === 'pill') {
                return (
                  <motion.span
                    key={pi}
                    initial={false}
                    animate={
                      committed
                        ? { opacity: 1, x: 0, scale: 1 }
                        : { opacity: 0, x: -16, scale: 0.9 }
                    }
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-[15px] font-medium tracking-normal text-fg shadow-chip"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping-soft absolute inset-0 rounded-full bg-success" />
                      <span className="relative h-2.5 w-2.5 rounded-full bg-success" />
                    </span>
                    {profile.availability}
                  </motion.span>
                );
              }

              const altText =
                active && phase.alt !== null ? piece.alts?.[phase.alt] : null;

              return (
                <Fragment key={pi}>
                  <span
                    className={cn(
                      'relative inline-block whitespace-nowrap',
                      piece.tone === 'subtle' && 'text-subtle',
                      piece.tone === 'accent' && 'text-accent'
                    )}
                  >
                    <motion.span
                      className="inline-block"
                      initial={false}
                      animate={
                        committed
                          ? { opacity: 1, filter: 'blur(0px)', y: '0em' }
                          : { opacity: 0, filter: 'blur(12px)', y: '0.18em' }
                      }
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {piece.text}
                    </motion.span>

                    {/* rejected candidate flicker */}
                    {altText && (
                      <span className="absolute left-0 top-0 text-fg/20 [filter:blur(1px)]">
                        {altText}
                      </span>
                    )}

                    {/* caret while this token is being sampled */}
                    {active && !altText && phase.probe === 'off' && (
                      <span className="absolute left-0 top-[0.12em] h-[0.9em] w-[0.08em] animate-pulse rounded bg-accent" />
                    )}

                    {/* candidate distribution */}
                    <AnimatePresence>
                      {active && piece.probe && phase.probe !== 'off' && (
                        <ProbeCard
                          key="probe"
                          candidates={piece.probe}
                          picked={phase.probe === 'picked'}
                        />
                      )}
                    </AnimatePresence>
                  </span>
                  {space}
                </Fragment>
              );
            })}
          </span>
        ))}
      </h1>

      <div className="h-5">
        <AnimatePresence>
          {done && elapsed !== null && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 font-mono text-[11px] text-subtle"
            >
              <span>
                Sampled {TOKEN_COUNT} tokens in {elapsed.toFixed(2)}s
              </span>
              <span aria-hidden>·</span>
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="focus-ring inline-flex items-center gap-1 rounded text-muted transition hover:text-accent"
              >
                <RotateCcw className="h-3 w-3" aria-hidden /> Replay
              </button>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProbeCard = ({
  candidates,
  picked
}: {
  candidates: Candidate[];
  picked: boolean;
}) => (
  <motion.span
    initial={{ opacity: 0, y: -6, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.18 } }}
    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
    className="absolute left-0 top-full z-30 mt-2 block w-60 rounded-2xl border border-black/[0.06] bg-card p-3 text-left font-sans text-[13px] font-normal leading-normal tracking-normal text-fg shadow-card"
  >
    <span className="mb-2 block font-mono text-[10px] text-subtle">
      next token · top-3
    </span>
    {candidates.map((c, i) => (
      <span
        key={c.t}
        className={cn(
          'flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors duration-200',
          picked && i === 0 && 'bg-accent/10'
        )}
      >
        <span
          className={cn(
            'w-24 shrink-0 truncate',
            picked && i !== 0 && 'text-subtle'
          )}
        >
          {c.t}
        </span>
        <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
          <motion.span
            className={cn(
              'absolute inset-y-0 left-0 rounded-full',
              i === 0 ? 'bg-accent' : 'bg-fg/30'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${c.p * 100}%` }}
            transition={{
              duration: 0.55,
              delay: i * 0.07,
              ease: [0.22, 1, 0.36, 1]
            }}
          />
        </span>
        <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted">
          {c.p.toFixed(2)}
        </span>
      </span>
    ))}
  </motion.span>
);
