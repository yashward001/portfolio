import type { Metadata } from 'next';
import { Download } from 'lucide-react';

import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Resume of Yashwardhan Singh Tomar.',
  openGraph: {
    images: [{ url: '/api/og?title=Resume' }]
  }
};

export default function ResumePage() {
  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <h1 className="font-display text-4xl">Resume</h1>
        <p className="text-muted">Concise experience snapshot with technical impact and ownership.</p>
      </header>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl">{profile.name}</h2>
        <p className="text-sm text-muted">{profile.headline}</p>
        <div className="mt-5 space-y-4 text-sm">
          {profile.timeline.map((entry) => (
            <div key={`${entry.title}-${entry.org}`}>
              <p className="font-medium">{entry.title}</p>
              <p className="text-muted">
                {entry.org} · {entry.location} · {entry.start} - {entry.end}
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="mt-8 font-display text-lg">Awards</h3>
        <div className="mt-3 space-y-2 text-sm">
          {profile.awards.map((award) => (
            <div key={award.title}>
              <p className="font-medium">
                {award.title} · {award.date}
              </p>
              <p className="text-muted">{award.detail}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 font-display text-lg">Leadership & Activities</h3>
        <p className="mt-3 text-sm text-muted">
          {profile.leadership.map((item) => `${item.role}, ${item.org}`).join(' · ')}
        </p>
      </div>

      <a
        href={profile.resumeUrl}
        className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:text-accent"
      >
        <Download className="h-4 w-4" /> Download PDF
      </a>
    </section>
  );
}
