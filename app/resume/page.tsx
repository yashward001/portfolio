import type { Metadata } from 'next';
import { Download, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

import { PageHeader } from '@/components/ui/page-header';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Resume of Yashwardhan Singh Tomar.',
  openGraph: {
    images: [{ url: '/api/og?title=Resume' }]
  }
};

const Section = ({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="border-t border-border pt-6 first:border-t-0 first:pt-0">
    <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-subtle">
      {title}
    </h2>
    {children}
  </section>
);

export default function ResumePage() {
  const jobs = profile.timeline.filter((e) => !e.education);
  const education = profile.timeline.filter((e) => e.education);

  return (
    <div className="space-y-12">
      <PageHeader label="Resume" title={profile.name}>
        <p>
          {profile.location} ·{' '}
          <a
            href={`mailto:${profile.email}`}
            className="link-underline text-fg"
          >
            {profile.email}
          </a>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={profile.resumeUrl}
            download
            className="btn-primary focus-ring"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary focus-ring"
          >
            Open in new tab <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </PageHeader>

      <div className="card space-y-8 p-6 sm:p-10">
        <Section title="Education">
          {education.map((entry) => (
            <div key={entry.org}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="font-semibold">{entry.org}</h3>
                <p className="shrink-0 text-sm text-subtle">
                  {entry.start} – {entry.end}
                </p>
              </div>
              <p className="text-sm text-muted">{entry.title}</p>
              <ul className="mt-2 space-y-1 text-[15px] text-fg/80">
                {entry.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section title="Experience">
          <div className="space-y-7">
            {jobs.map((entry) => (
              <div key={entry.org + entry.start}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="font-semibold">{entry.org}</h3>
                  <p className="shrink-0 text-sm text-subtle">
                    {entry.start} – {entry.end}
                  </p>
                </div>
                <p className="text-sm text-muted">
                  {entry.title} · {entry.location}
                </p>
                <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-fg/80 marker:text-accent">
                  {entry.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Skills">
          <dl className="space-y-2 text-[15px]">
            {(profile.skillGroups ?? []).map((group) => (
              <div key={group.category} className="sm:flex sm:gap-2">
                <dt className="shrink-0 font-medium">{group.category}:</dt>
                <dd className="text-fg/80">{group.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Leadership & activities">
          <p className="text-[15px] text-fg/80">
            {profile.leadership
              .map((item) => `${item.role}, ${item.org}`)
              .join(' · ')}
          </p>
        </Section>

        <Section title="Awards">
          {profile.awards.map((award) => (
            <div
              key={award.title}
              className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <p className="text-[15px]">
                <span className="font-semibold">{award.title}</span>{' '}
                <span className="text-fg/80">{award.detail}</span>
              </p>
              <p className="shrink-0 text-sm text-subtle">{award.date}</p>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}
