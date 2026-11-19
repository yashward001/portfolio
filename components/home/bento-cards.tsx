import { ArrowUpRight, Trophy } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { profile } from '@/content/profile';
import { city, shortOrg, shortTitle, yearRange } from '@/lib/experience';
import { cn } from '@/lib/utils';

/* ─── Shell ─────────────────────────────────────────────────────────────── */

export const BentoCard = ({
  label,
  className,
  children
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) => (
  <section aria-label={label} className={cn('card flex flex-col', className)}>
    <div className="absolute left-3.5 top-3.5 z-10">
      <span className="card-label">{label}</span>
    </div>
    {children}
  </section>
);

/* ─── Experience ────────────────────────────────────────────────────────── */

export const ExperienceCard = () => {
  const jobs = profile.timeline.filter((entry) => !entry.education);

  return (
    <BentoCard label="My experience" className="h-[272px]">
      <ol className="fade-y no-scrollbar relative mt-12 flex-1 overflow-y-auto px-5 pb-6 pt-3">
        <span
          aria-hidden
          className="absolute bottom-6 left-[23px] top-5 w-px bg-fg/80"
        />
        {jobs.map((entry) => (
          <li
            key={entry.org + entry.start}
            className="relative pb-4 pl-6 last:pb-2"
          >
            <span
              aria-hidden
              className="absolute left-0 top-[6px] h-[7px] w-[7px] rounded-full bg-fg ring-4 ring-card"
            />
            <p className="text-[13.5px] font-medium leading-snug">
              {shortTitle(entry)} <span className="text-muted">at</span>{' '}
              {shortOrg(entry)}
            </p>
            <p className="mt-0.5 text-xs text-subtle">
              {yearRange(entry)} · {city(entry)}
            </p>
          </li>
        ))}
      </ol>
    </BentoCard>
  );
};

/* ─── Collection (Hot Wheels) ───────────────────────────────────────────── */

export const CollectionCard = () => (
  <BentoCard label="What I collect" className="h-[272px]">
    <div className="mt-14 px-5">
      <p className="text-[15px] font-semibold leading-tight">
        Hot Wheels Premium
      </p>
      <p className="text-[15px] font-semibold leading-tight">
        &apos;09 Porsche 911
      </p>
      <p className="mt-1 text-xs text-subtle">
        Rarest of 300+ cars · 6 years of hunting
      </p>
    </div>
    <div className="relative mx-auto mt-auto h-[120px] w-[72%] translate-y-3 overflow-hidden rounded-t-2xl border border-black/[0.06] bg-bg shadow-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://i.ebayimg.com/images/g/keAAAOSwqCZmogO8/s-l1200.jpg"
        alt="Hot Wheels Premium '09 Porsche 911 die-cast car"
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 hover:scale-105"
      />
    </div>
  </BentoCard>
);

/* ─── Location ──────────────────────────────────────────────────────────── */

const streetPattern = [
  'repeating-linear-gradient(28deg, transparent 0 22px, rgba(17,17,17,0.10) 22px 23px)',
  'repeating-linear-gradient(-62deg, transparent 0 31px, rgba(17,17,17,0.08) 31px 32px)',
  'repeating-linear-gradient(95deg, transparent 0 57px, rgba(17,17,17,0.12) 57px 59px)',
  'repeating-linear-gradient(8deg, transparent 0 83px, rgba(17,17,17,0.10) 83px 85px)'
].join(',');

export const LocationCard = () => (
  <BentoCard label="Based in" className="h-[272px]">
    <div
      aria-hidden
      className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_30%,transparent_78%)]"
      style={{ backgroundImage: streetPattern }}
    />
    <span
      aria-hidden
      className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
    >
      <span className="animate-ping-soft absolute inset-0 rounded-full bg-accent" />
      <span className="relative block h-3 w-3 rounded-full bg-accent ring-4 ring-white" />
    </span>
    <div className="relative mt-auto pb-6 text-center">
      <p className="text-[22px] font-medium uppercase tracking-[0.42em] [text-indent:0.42em]">
        {profile.location}
      </p>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
        {profile.coordinates}
      </p>
    </div>
  </BentoCard>
);

/* ─── Award ─────────────────────────────────────────────────────────────── */

export const AwardCard = ({ className }: { className?: string }) => {
  const award = profile.awards[0];
  if (!award) return null;

  return (
    <BentoCard label="Latest win" className={cn('min-h-[220px]', className)}>
      <div className="mt-14 flex flex-1 flex-col px-5 pb-5">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/10 text-accent">
          <Trophy className="h-5 w-5" aria-hidden />
        </span>
        <p className="mt-4 text-[15px] font-semibold leading-snug">
          {award.title}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          {award.detail}
        </p>
        <p className="mt-auto pt-3 text-xs text-subtle">{award.date}</p>
      </div>
    </BentoCard>
  );
};

/* ─── Toolbox ───────────────────────────────────────────────────────────── */

export const ToolboxCard = ({ className }: { className?: string }) => (
  <BentoCard label="Toolbox" className={className}>
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

/* ─── Closing CTA ───────────────────────────────────────────────────────── */

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
