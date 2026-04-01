import type { Metadata } from 'next';

import { Timeline } from '@/components/sections/timeline';
import { Badge } from '@/components/ui/badge';
import { SectionTitle } from '@/components/ui/section-title';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Yashwardhan Singh Tomar: education, internships, and technical focus.',
  openGraph: {
    images: [{ url: '/api/og?title=About' }]
  }
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <SectionTitle
        overline="About"
        title="Engineering with Product Taste"
        description="I am a CS student who likes hard system constraints and user-facing polish in the same product."
      />

      <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <p className="text-muted">
            I enjoy end-to-end ownership: defining problem boundaries, making architecture decisions, and shipping interfaces
            that feel intentional. Most of my work lives at the intersection of distributed systems and product engineering.
          </p>

          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <Badge key={interest}>{interest}</Badge>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-xl">What I&apos;m Looking For</h3>
            <p className="mt-3 text-sm text-muted">
              Research opportunities in ML systems, agentic AI, or efficient inference for the remainder of 2026,
              and full-time software engineering roles from mid-2027.
            </p>
          </div>
        </div>

        <Timeline />
      </section>
    </div>
  );
}
