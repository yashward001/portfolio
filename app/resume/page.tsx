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
                {entry.org} · {entry.start} - {entry.end}
              </p>
              <p className="text-muted">{entry.detail}</p>
            </div>
          ))}
        </div>
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
