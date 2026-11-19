'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import Link from 'next/link';

import { BentoCard } from '@/components/home/bento-cards';
import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

/* Soft Launch's own brand gradient, used only inside this card so it reads as a separate company. */
const BRAND = 'bg-[linear-gradient(120deg,#ff3d71_0%,#ff7a3d_100%)]';
const EASE = [0.22, 1, 0.36, 1] as const;

/** Child variant that plays after the card unfolds (inherits the card's hidden/show state). */
const step = (
  delay: number,
  from: Record<string, number | string> = { opacity: 0, y: 10 }
) => ({
  variants: {
    hidden: from,
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.45, delay, ease: EASE }
    }
  }
});

const FLOW = ['Match', 'Plan', 'Real date'];

export const NowBuildingCard = ({
  wave = 0,
  className
}: {
  wave?: number;
  className?: string;
}) => {
  const v = profile.venture;
  if (!v) return null;
  const t0 = wave * 0.09 + 0.45;

  return (
    <BentoCard label="Now building" wave={wave} className={className}>
      <div className="grid gap-8 px-6 pb-6 pt-16 sm:px-8 sm:pb-8 md:grid-cols-[1.15fr_1fr] md:gap-10">
        {/* ── Story ─────────────────────────────────────────── */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                'grid h-9 w-9 place-items-center rounded-xl text-white shadow-chip',
                BRAND
              )}
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="currentColor"
              >
                <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4h2c.7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
              </svg>
            </span>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em]">
              {v.name}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff3d71]/25 bg-[#ff3d71]/[0.06] px-2.5 py-1 text-xs font-medium text-[#d61f57]">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="animate-ping-soft absolute inset-0 rounded-full bg-[#ff3d71]" />
                <span className="relative h-2 w-2 rounded-full bg-[#ff3d71]" />
              </span>
              {v.status}
            </span>
          </div>

          <p className="mt-5 text-[clamp(1.5rem,3.4vw,2rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
            {v.tagline}
          </p>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            {v.summary}
          </p>
          <p className="mt-3 text-sm text-subtle">
            {v.role} with {v.cofounder}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5 md:mt-auto md:pt-6">
            <a
              href={v.pitchUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary focus-ring !px-5 !py-3 !text-sm"
            >
              Read the pitch <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={v.deckUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary focus-ring !px-4 !py-2.5 !text-sm"
            >
              Investor deck <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">
            <Link
              href={`/projects/${v.slug}`}
              className="link-underline font-medium text-fg"
            >
              Read the case study
            </Link>
            <span className="mx-2 text-subtle" aria-hidden>
              /
            </span>
            Investor?{' '}
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent(`${v.name}: investor intro`)}`}
              className="link-underline font-medium text-fg"
            >
              Let&apos;s talk
            </a>
          </p>
        </div>

        {/* ── Product moment: match → plan → booked table ──────── */}
        <div aria-hidden className="relative rounded-[22px] bg-bg p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-medium text-muted">
            {FLOW.map((label, i) => (
              <span key={label} className="flex flex-1 items-center gap-2">
                <motion.span
                  className="whitespace-nowrap"
                  variants={{
                    hidden: { color: '#8f8f8f' },
                    show: {
                      color: '#121212',
                      transition: { delay: t0 + i * 0.55 }
                    }
                  }}
                >
                  {label}
                </motion.span>
                {i < FLOW.length - 1 && (
                  <span className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-border">
                    <motion.span
                      className={cn('absolute inset-0 origin-left', BRAND)}
                      variants={{
                        hidden: { scaleX: 0 },
                        show: {
                          scaleX: 1,
                          transition: {
                            duration: 0.5,
                            delay: t0 + i * 0.55 + 0.1,
                            ease: EASE
                          }
                        }
                      }}
                    />
                  </span>
                )}
              </span>
            ))}
          </div>

          <div className="space-y-2.5 text-[13px]">
            <motion.div
              {...step(t0)}
              className="flex items-center gap-2.5 rounded-2xl bg-card p-3 shadow-chip"
            >
              <span
                className={cn(
                  'grid h-8 w-8 place-items-center rounded-full text-xs font-semibold text-white',
                  BRAND
                )}
              >
                R
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">Riya</span>
                <span className="block text-xs text-subtle">
                  Matched this week
                </span>
              </span>
              <span className="rounded-full bg-bg px-2 py-1 text-[11px] text-muted">
                late night ramen
              </span>
            </motion.div>

            <motion.div
              {...step(t0 + 0.55)}
              className="rounded-2xl bg-card p-3 shadow-chip"
            >
              <span className="flex items-center justify-between">
                <span className="font-medium">Ramen bar, Hauz Khas</span>
                <span className="rounded-full bg-[#ff3d71]/10 px-2 py-0.5 text-[11px] font-medium text-[#d61f57]">
                  20% off
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-subtle">
                Picked for you two
              </span>
            </motion.div>

            <div className="space-y-1.5 px-1">
              <motion.p
                {...step(t0 + 0.9, { opacity: 0, x: -10 })}
                className="w-fit rounded-2xl rounded-bl-md bg-card px-3 py-2 shadow-chip"
              >
                Thursday after work?
              </motion.p>
              <motion.p
                {...step(t0 + 1.2, { opacity: 0, x: 10 })}
                className="ml-auto w-fit rounded-2xl rounded-br-md bg-fg px-3 py-2 text-white"
              >
                7:30 works. Booking it now
              </motion.p>
            </div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.85, y: 8 },
                show: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 380,
                    damping: 16,
                    delay: t0 + 1.65
                  }
                }
              }}
              className={cn(
                'flex items-center gap-2 rounded-2xl px-3 py-2.5 font-medium text-white shadow-card',
                BRAND
              )}
            >
              <Check className="h-4 w-4" strokeWidth={3} />
              Table booked, Thu 7:30 PM
            </motion.div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
};
