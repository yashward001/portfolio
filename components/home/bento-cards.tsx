'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';

import { profile } from '@/content/profile';
import { AwardLinks } from '@/components/ui/award-links';
import { city, shortOrg, shortTitle, yearRange } from '@/lib/experience';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Delay for content inside a card: waits for that card's diagonal wave to unfold. */
const after = (wave: number, extra = 0) => wave * 0.09 + 0.35 + extra;

/* ─── Shell ─────────────────────────────────────────────────────────────
   Cards unfold in diagonal wavefronts (row + col), like a systolic array
   streaming a matmul. `data-attn-*` hooks are driven by <AttentionField>. */

export const BentoCard = ({
  label,
  wave = 0,
  className,
  children
}: {
  label: string;
  wave?: number;
  className?: string;
  children: ReactNode;
}) => {
  const reduce = useReducedMotion();

  return (
    <motion.section
      aria-label={label}
      data-attn-card
      className={cn('card flex flex-col', className)}
      // Children declare `hidden`/`show` variants and inherit this card's state, so the
      // whole card choreographs from one observer. Low `amount` matters: Chrome counts the
      // clip-path when measuring visibility, and the clipped card is only ~30% "visible".
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {
          opacity: 0,
          scale: 0.94,
          clipPath: 'inset(22% 22% 22% 22% round 28px)'
        },
        show: {
          opacity: 1,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0% round 28px)',
          transition: { duration: 0.75, delay: wave * 0.09, ease: EASE }
        }
      }}
    >
      <div className="absolute left-3.5 top-3.5 z-10">
        <span data-attn-anchor className="card-label gap-1.5">
          {label}
          <span
            data-attn-value
            className="font-mono text-[10px] tabular-nums text-accent empty:hidden"
          />
        </span>
      </div>
      {children}
    </motion.section>
  );
};

/* ─── Experience ────────────────────────────────────────────────────── */

export const ExperienceCard = ({ wave = 0 }: { wave?: number }) => {
  const jobs = profile.timeline.filter((entry) => !entry.education);

  return (
    <BentoCard label="My experience" wave={wave} className="h-[272px]">
      <ol className="fade-y no-scrollbar relative mt-12 flex-1 overflow-y-auto px-5 pb-6 pt-3">
        <motion.span
          aria-hidden
          className="absolute bottom-6 left-[23px] top-5 w-px origin-top bg-fg/80"
          variants={{
            hidden: { scaleY: 0 },
            show: {
              ...{ scaleY: 1 },
              transition: { duration: 1.1, delay: after(wave), ease: EASE }
            }
          }}
        />
        {jobs.map((entry, i) => (
          <li
            key={entry.org + entry.start}
            className="relative pb-4 pl-6 last:pb-2"
          >
            <motion.span
              aria-hidden
              className="absolute left-0 top-[6px] h-[7px] w-[7px] rounded-full bg-fg ring-4 ring-card"
              variants={{
                hidden: { scale: 0 },
                show: {
                  ...{ scale: 1 },
                  transition: {
                    type: 'spring',
                    stiffness: 500,
                    damping: 15,
                    delay: after(wave, 0.15 + i * 0.16)
                  }
                }
              }}
            />
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -6 },
                show: {
                  ...{ opacity: 1, x: 0 },
                  transition: {
                    duration: 0.4,
                    delay: after(wave, 0.2 + i * 0.16),
                    ease: EASE
                  }
                }
              }}
            >
              <p className="text-[13.5px] font-medium leading-snug">
                {shortTitle(entry)} <span className="text-muted">at</span>{' '}
                {shortOrg(entry)}
              </p>
              <p className="mt-0.5 text-xs text-subtle">
                {yearRange(entry)} · {city(entry)}
              </p>
            </motion.div>
          </li>
        ))}
      </ol>
    </BentoCard>
  );
};

/* ─── Collection (Hot Wheels) ───────────────────────────────────────── */

export const CollectionCard = ({ wave = 0 }: { wave?: number }) => (
  <BentoCard label="What I collect" wave={wave} className="group h-[272px]">
    <div className="mt-14 px-5">
      <p className="text-[15px] font-semibold leading-tight">
        Hot Wheels Premium
      </p>
      <p className="text-[15px] font-semibold leading-tight">
        &apos;09 Porsche 911
      </p>
      <p className="mt-1 text-xs text-subtle">
        Rarest of 300+ cars, 6 years of hunting
      </p>
    </div>

    <div className="relative mt-auto h-[132px]">
      {/* speed streaks: fire once as the car arrives */}
      {[0, 1, 2].map((n) => (
        <motion.span
          key={n}
          aria-hidden
          className="absolute left-0 h-[2px] w-1/3 origin-right rounded-full bg-gradient-to-r from-transparent to-fg/40"
          style={{ top: `${38 + n * 22}%` }}
          variants={{
            hidden: { opacity: 0, scaleX: 0.2, x: -60 },
            show: {
              ...{
                opacity: [0, 0.7, 0],
                scaleX: [0.2, 1, 0.4],
                x: [-60, 10, 40]
              },
              transition: {
                duration: 0.9,
                delay: after(wave, 0.1 + n * 0.05),
                ease: 'easeOut'
              }
            }
          }}
        />
      ))}
      <motion.div
        className="absolute bottom-0 left-[14%] h-[120px] w-[72%] translate-y-3 overflow-hidden rounded-t-2xl border border-black/[0.06] bg-bg shadow-card"
        variants={{
          hidden: { x: '-150%', skewX: -14 },
          show: {
            ...{ x: '0%', skewX: 0 },
            transition: {
              type: 'spring',
              stiffness: 130,
              damping: 12,
              delay: after(wave, 0.1)
            }
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.ebayimg.com/images/g/keAAAOSwqCZmogO8/s-l1200.jpg"
          alt="Hot Wheels Premium '09 Porsche 911 die-cast car"
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:translate-x-1.5 group-hover:scale-[1.06]"
        />
      </motion.div>
    </div>
  </BentoCard>
);

/* ─── Location ──────────────────────────────────────────────────────── */

// Hand-placed "streets" so the map draws itself in instead of being a static texture.
const ROADS: Array<[number, number, number, number, number]> = [
  [-10, 64, 310, 18, 2.2],
  [-10, 176, 310, 110, 2.2],
  [44, -10, 92, 282, 2.2],
  [204, -10, 172, 282, 2.4],
  [-10, 104, 310, 146, 1],
  [-10, 22, 150, 282, 1],
  [120, -10, 310, 204, 1],
  [252, -10, 282, 282, 1],
  [-10, 226, 310, 244, 1],
  [0, 144, 142, -10, 1],
  [150, 282, 310, 62, 1],
  [62, -10, 30, 282, 0.7],
  [-10, 252, 202, -10, 0.7],
  [-10, 132, 310, 80, 0.7]
];

export const LocationCard = ({ wave = 0 }: { wave?: number }) => (
  <BentoCard label="Based in" wave={wave} className="h-[272px]">
    <svg
      aria-hidden
      viewBox="0 0 300 272"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,#000_30%,transparent_80%)]"
    >
      {ROADS.map(([x1, y1, x2, y2, w], i) => (
        <motion.path
          key={i}
          d={`M${x1} ${y1} L${x2} ${y2}`}
          stroke="rgba(17,17,17,0.14)"
          strokeWidth={w}
          strokeLinecap="round"
          fill="none"
          variants={{
            hidden: { pathLength: 0 },
            show: {
              ...{ pathLength: 1 },
              transition: {
                duration: 1.1,
                delay: after(wave, i * 0.05),
                ease: EASE
              }
            }
          }}
        />
      ))}
      <motion.path
        d="M-10 206 C 60 188, 110 222, 170 200 S 262 190, 310 210"
        stroke="hsl(var(--accent) / 0.35)"
        strokeWidth={1.5}
        strokeDasharray="3 5"
        fill="none"
        variants={{
          hidden: { pathLength: 0 },
          show: {
            ...{ pathLength: 1 },
            transition: { duration: 1.6, delay: after(wave, 0.3), ease: EASE }
          }
        }}
      />
    </svg>

    <motion.span
      aria-hidden
      className="absolute left-1/2 top-[38%] -ml-1.5 -mt-1.5"
      variants={{
        hidden: { y: -90, opacity: 0 },
        show: {
          ...{ y: 0, opacity: 1 },
          transition: {
            type: 'spring',
            stiffness: 420,
            damping: 14,
            delay: after(wave, 0.8)
          }
        }
      }}
    >
      <span className="animate-ping-soft absolute inset-0 rounded-full bg-accent" />
      <span className="relative block h-3 w-3 rounded-full bg-accent ring-4 ring-white" />
    </motion.span>

    <div className="relative mt-auto pb-6 text-center">
      <motion.p
        className="text-[22px] font-medium uppercase [text-indent:0.42em]"
        variants={{
          hidden: { letterSpacing: '0.9em', opacity: 0 },
          show: {
            ...{ letterSpacing: '0.42em', opacity: 1 },
            transition: { duration: 1, delay: after(wave, 0.5), ease: EASE }
          }
        }}
      >
        {profile.location}
      </motion.p>
      <p className="mt-1.5 font-mono text-[10px] tracking-[0.12em] text-subtle">
        {profile.coordinates}
      </p>
    </div>
  </BentoCard>
);

/* ─── Award ─────────────────────────────────────────────────────────── */

const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2 + (i % 2) * 0.2;
  const dist = 34 + (i % 3) * 14;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    size: 3 + (i % 3)
  };
});

export const AwardCard = ({
  wave = 0,
  className
}: {
  wave?: number;
  className?: string;
}) => {
  const award = profile.awards[0];
  const [burst, setBurst] = useState(0);
  const reduce = useReducedMotion();
  if (!award) return null;

  return (
    <BentoCard
      label="Latest win"
      wave={wave}
      className={cn('min-h-[220px]', className)}
    >
      <div
        className="mt-14 flex flex-1 flex-col px-5 pb-5"
        onMouseEnter={() => !reduce && setBurst((b) => b + 1)}
      >
        <span className="relative grid h-10 w-10 place-items-center">
          <span className="absolute inset-0 rounded-2xl bg-accent/10" />
          <motion.span
            className="relative text-accent"
            key={`t${burst}`}
            animate={
              burst
                ? { rotate: [0, -14, 12, -6, 0], scale: [1, 1.25, 1] }
                : undefined
            }
            transition={{ duration: 0.6 }}
          >
            <Trophy className="h-5 w-5" aria-hidden />
          </motion.span>
          <AnimatePresence>
            {burst > 0 &&
              SPARKS.map((s, i) => (
                <motion.span
                  key={`${burst}-${i}`}
                  aria-hidden
                  className={cn(
                    'absolute left-1/2 top-1/2 rounded-full',
                    i % 3 === 0 ? 'bg-fg' : 'bg-accent'
                  )}
                  style={{
                    width: s.size,
                    height: s.size,
                    marginLeft: -s.size / 2,
                    marginTop: -s.size / 2
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: s.x, y: s.y, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              ))}
          </AnimatePresence>
        </span>
        <p className="mt-4 text-[15px] font-semibold leading-snug">
          {award.title}
        </p>
        {award.placement && (
          <p className="mt-1 text-[13px] font-medium text-accent">
            {award.placement}
          </p>
        )}
        <p className="mt-1.5 line-clamp-4 text-[13px] leading-relaxed text-muted">
          {award.detail}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <AwardLinks award={award} />
          <p className="shrink-0 text-xs text-subtle">{award.date}</p>
        </div>
      </div>
    </BentoCard>
  );
};

/* ─── Toolbox ───────────────────────────────────────────────────────── */

export const ToolboxCard = ({
  wave = 0,
  className
}: {
  wave?: number;
  className?: string;
}) => (
  <BentoCard label="Toolbox" wave={wave} className={className}>
    <div className="mt-14 grid gap-4 px-6 pb-6 sm:grid-cols-2">
      {(profile.skillGroups ?? []).map((group) => (
        <div key={group.category}>
          <p className="mb-2 text-xs font-medium text-subtle">
            {group.category}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </BentoCard>
);

/* ─── Closing CTA ───────────────────────────────────────────────────── */

export const ContactCta = () => (
  <section className="card flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">
        Have a role or project in mind?
      </h2>
      <p className="mt-2 max-w-md text-[15px] text-muted">
        I&apos;m looking for ML and software engineering roles. Happy to chat
        about anything AI systems.
      </p>
    </div>
    <div className="flex shrink-0 flex-wrap gap-3">
      <a href={`mailto:${profile.email}`} className="btn-primary focus-ring">
        Email me
      </a>
      <Link href="/contact" className="btn-secondary focus-ring">
        Contact <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  </section>
);
