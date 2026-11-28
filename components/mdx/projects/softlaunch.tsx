'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, Check, Heart, MapPin, Radio } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { EASE, Fig, useTimeline } from '../kit';

/* Swipe → match → shortlist → propose → accept, synced live between two phones. */

const SHARED = ['Ramen', 'Indie gigs', 'Rooftops'];
const VENUES = [
  { name: 'Ramen bar', area: 'Hauz Khas', shared: 2 },
  { name: 'Live music café', area: 'Shahpur Jat', shared: 1 },
  { name: 'Rooftop lounge', area: 'Connaught Place', shared: 1 }
];
const T = [0, 1.1, 2.2, 3.5, 4.9, 5.9, 7.0, 8.0, 9.0];
// 0 deck · 1 swiped · 2 match · 3 shortlist (A) · 4 propose → in flight · 5 B sees proposal
// 6 B accepts → in flight · 7 booked on both · 8 hold

const BRAND = 'bg-[linear-gradient(120deg,#ff3d71_0%,#ff7a3d_100%)]';

export const TwoPhoneSync = () => {
  const { ref, step, ok } = useTimeline(T, 12.5);

  const packet = step === 4 ? 'right' : step === 6 ? 'left' : null;

  return (
    <Fig
      title="The whole loop, on two phones at once"
      note="Swipes and matches are stored in Postgres, venues are ranked by the interests a match actually shares, and the propose / accept flow syncs live between both phones over Supabase Realtime. Booking is stubbed in the prototype."
      illustrative="Prototype flow"
    >
      <div ref={ref} className="flex items-center justify-center gap-2 p-5 sm:gap-6 sm:p-8">
        <Phone who="Aarav">
          <Screen step={step} side="A" ok={ok} />
        </Phone>

        {/* realtime channel */}
        <div className="relative flex w-10 flex-col items-center gap-2 sm:w-24">
          <Radio className={cn('h-4 w-4 transition-colors', packet ? 'text-accent' : 'text-subtle')} />
          <div className="relative h-[2px] w-full bg-border">
            <AnimatePresence>
              {packet && ok && (
                <motion.span
                  key={packet}
                  className="absolute -top-[5px] h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_hsl(var(--accent))]"
                  initial={{ left: packet === 'right' ? '0%' : '100%', opacity: 0 }}
                  animate={{ left: packet === 'right' ? '100%' : '0%', opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                />
              )}
            </AnimatePresence>
          </div>
          <span className="hidden text-center text-[10px] leading-tight text-subtle sm:block">Supabase Realtime</span>
        </div>

        <Phone who="Riya">
          <Screen step={step} side="B" ok={ok} />
        </Phone>
      </div>
    </Fig>
  );
};

const Phone = ({ who, children }: { who: string; children: ReactNode }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative aspect-[9/17] w-[132px] overflow-hidden rounded-[26px] border-[5px] border-fg bg-card shadow-card sm:w-[176px]">
      <span className="absolute left-1/2 top-1.5 z-20 h-1.5 w-10 -translate-x-1/2 rounded-full bg-fg" />
      {children}
    </div>
    <span className="text-[12px] text-muted">{who}</span>
  </div>
);

const Screen = ({ step, side, ok }: { step: number; side: 'A' | 'B'; ok: boolean }) => {
  const other = side === 'A' ? 'Riya' : 'Aarav';
  const view =
    step < 1 ? 'deck' : step < 2 ? 'swipe' : step < 3 ? 'match' : step >= 7 ? 'booked' : side === 'A' ? (step < 4 ? 'shortlist' : 'sent') : step < 5 ? 'match' : 'proposal';
  const accepted = side === 'B' && step >= 6;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={view}
        className="absolute inset-0 flex flex-col px-2.5 pb-3 pt-6 text-[11px] sm:px-3"
        initial={ok ? { opacity: 0, scale: 0.96 } : false}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {(view === 'deck' || view === 'swipe') && (
          <div className="relative flex-1">
            <motion.div
              className={cn('absolute inset-0 flex flex-col justify-end rounded-2xl p-2.5 text-white', BRAND)}
              initial={false}
              animate={view === 'swipe' ? { x: 160, rotate: 18, opacity: 0 } : { x: 0, rotate: 0, opacity: 1 }}
              transition={{ duration: ok ? 0.6 : 0, ease: EASE }}
            >
              <p className="text-[13px] font-semibold">{other}, 22</p>
              <p className="mt-1 flex flex-wrap gap-1">
                {SHARED.slice(0, 2).map((s) => (
                  <span key={s} className="rounded-full bg-white/25 px-1.5 text-[9.5px]">
                    {s}
                  </span>
                ))}
              </p>
            </motion.div>
            {view === 'swipe' && (
              <span className="absolute inset-0 grid place-items-center">
                <Heart className="h-9 w-9 fill-accent text-accent" />
              </span>
            )}
          </div>
        )}

        {view === 'match' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <span className={cn('grid h-11 w-11 place-items-center rounded-full text-white', BRAND)}>
              <Heart className="h-5 w-5 fill-white" />
            </span>
            <p className="text-[13px] font-semibold">It’s a match</p>
            <p className="text-muted">You both like</p>
            <p className="flex flex-wrap justify-center gap-1">
              {SHARED.map((s) => (
                <span key={s} className="rounded-full bg-accent/15 px-1.5 text-[9.5px] text-accent">
                  {s}
                </span>
              ))}
            </p>
          </div>
        )}

        {view === 'shortlist' && (
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="font-semibold">Plan the date</p>
            {VENUES.map((v, i) => (
              <motion.div
                key={v.name}
                initial={ok ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ok ? i * 0.12 : 0 }}
                className={cn('rounded-xl border p-1.5', i === 0 ? 'border-accent bg-accent/10' : 'border-border')}
              >
                <p className="font-medium leading-tight">{v.name}</p>
                <p className="flex items-center gap-0.5 text-[9.5px] text-subtle">
                  <MapPin className="h-2.5 w-2.5" /> {v.area} · {v.shared} shared
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {view === 'sent' && (
          <div className="flex flex-1 flex-col justify-center gap-2 text-center">
            <p className="font-semibold">Proposal sent</p>
            <p className="rounded-xl bg-bg p-2 text-[10.5px] leading-snug">
              Ramen bar, Hauz Khas
              <br />
              Thu · 7:30 PM
            </p>
            <p className="text-subtle">Waiting for {other}…</p>
          </div>
        )}

        {view === 'proposal' && (
          <div className="flex flex-1 flex-col justify-center gap-2 text-center">
            <p className="font-semibold">Aarav proposed</p>
            <p className="rounded-xl bg-bg p-2 text-[10.5px] leading-snug">
              Ramen bar, Hauz Khas
              <br />
              Thu · 7:30 PM
            </p>
            <div className="flex gap-1.5">
              <span className="flex-1 rounded-full border border-border py-1 text-muted">Decline</span>
              <motion.span
                className={cn('flex-1 rounded-full py-1 font-medium text-white', accepted ? 'bg-success' : 'bg-fg')}
                animate={accepted && ok ? { scale: [1, 0.9, 1] } : undefined}
                transition={{ duration: 0.3 }}
              >
                {accepted ? <Check className="mx-auto h-3.5 w-3.5" /> : 'Accept'}
              </motion.span>
            </div>
          </div>
        )}

        {view === 'booked' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <motion.span
              className="grid h-11 w-11 place-items-center rounded-full bg-success text-white"
              initial={ok ? { scale: 0.4 } : false}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14 }}
            >
              <CalendarCheck className="h-5 w-5" />
            </motion.span>
            <p className="text-[13px] font-semibold">Table booked</p>
            <p className="text-muted">Thu · 7:30 PM</p>
            <p className="text-[10px] text-subtle">Ramen bar, Hauz Khas</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
