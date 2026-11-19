import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { CollectionCard, ContactCta } from '@/components/home/bento-cards';
import { NowBuildingCard } from '@/components/home/now-building-card';
import { PlaylistCard } from '@/components/home/playlist-card';
import { AwardLinks } from '@/components/ui/award-links';
import { PageHeader } from '@/components/ui/page-header';
import { Reveal } from '@/components/ui/reveal';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Background, experience, and what Yashwardhan Singh Tomar is working on.',
  openGraph: { images: [{ url: '/api/og?title=About' }] }
};

const FACTS = [
  { label: 'Based in', value: profile.location },
  { label: 'Studying', value: 'B.Eng. Computer Science, NTU' },
  { label: 'Graduating', value: 'Aug 2027' },
  { label: 'Focus', value: 'ML systems · Agentic AI · Full-stack' }
];

const RESEARCH = [
  {
    title: 'Efficient ML inference',
    desc: 'Transformer quantisation for edge deployment: INT8/FP16 Pareto analysis and latency–memory tradeoffs on constrained hardware.'
  },
  {
    title: 'Agentic system design',
    desc: 'Formal state machines for agent orchestration, capability registries, and production-grade fallback and recovery.'
  },
  {
    title: 'Neuromorphic computing',
    desc: 'Spiking neural networks (LIF neurons, STDP, surrogate gradients) and their intersection with transformer sequence modelling.'
  }
];

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">{children}</h2>
);

export default function AboutPage() {
  return (
    <div className="space-y-24">
      <PageHeader
        label="About"
        title={
          <>
            Engineering with <span className="text-accent">product taste.</span>
          </>
        }
      >
        <p>
          I&apos;m a Computer Science student at NTU Singapore who likes hard
          system constraints and user-facing polish in the same product. I enjoy
          end-to-end ownership: defining problem boundaries, making architecture
          decisions, and shipping things that feel intentional. Most of my work
          sits where applied ML and LLM systems meet full-stack product
          engineering.
        </p>
      </PageHeader>

      <Reveal>
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label} className="card p-5">
              <dt className="text-xs text-subtle">{fact.label}</dt>
              <dd className="mt-1.5 text-[15px] font-medium leading-snug">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <NowBuildingCard />

      <section aria-labelledby="experience">
        <Reveal>
          <SectionHeading>
            <span id="experience">Experience</span>
          </SectionHeading>
        </Reveal>
        <ol className="space-y-4">
          {profile.timeline.map((entry) => (
            <Reveal key={entry.org + entry.start}>
              <li className="card p-6 sm:p-7">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="text-lg font-semibold">{entry.org}</h3>
                  <p className="shrink-0 text-sm text-subtle">
                    {entry.start} – {entry.end}
                  </p>
                </div>
                <p className="mt-0.5 text-[15px] text-muted">
                  {entry.title} · {entry.location}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {entry.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-[15px] leading-relaxed text-fg/80"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                {entry.tags.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          <section aria-labelledby="awards" className="card p-6 sm:p-7">
            <h2 id="awards" className="text-xs font-medium text-subtle">
              Awards
            </h2>
            <ul className="mt-3 space-y-4">
              {profile.awards.map((award) => (
                <li key={award.title}>
                  <p className="font-semibold">{award.title}</p>
                  {award.placement && (
                    <p className="mt-0.5 text-sm font-medium text-accent">
                      {award.placement}
                    </p>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {award.detail}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <AwardLinks award={award} />
                    <p className="text-xs text-subtle">{award.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="leadership" className="card p-6 sm:p-7">
            <h2 id="leadership" className="text-xs font-medium text-subtle">
              Leadership &amp; activities
            </h2>
            <ul className="mt-3 space-y-4">
              {profile.leadership.map((item) => (
                <li key={item.role + item.org}>
                  <p className="font-semibold">{item.role}</p>
                  <p className="mt-1 text-sm text-muted">{item.org}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Reveal>

      <section aria-labelledby="skills">
        <Reveal>
          <SectionHeading>
            <span id="skills">Skills</span>
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            {(profile.skillGroups ?? []).map((group) => (
              <div key={group.category} className="card p-6">
                <h3 className="text-xs font-medium text-subtle">
                  {group.category}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="interests">
        <Reveal>
          <SectionHeading>
            <span id="interests">What I&apos;m exploring</span>
          </SectionHeading>
          <div className="grid gap-4 md:grid-cols-3">
            {RESEARCH.map((item) => (
              <div key={item.title} className="card p-6">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="outside">
        <Reveal>
          <SectionHeading>
            <span id="outside">Outside of code</span>
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            <PlaylistCard />
            <CollectionCard />
          </div>
        </Reveal>
      </section>

      <Reveal>
        <ContactCta />
      </Reveal>
    </div>
  );
}
