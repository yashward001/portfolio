import type { Metadata } from 'next';

import { Timeline } from '@/components/sections/timeline';
import { SectionTitle } from '@/components/ui/section-title';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Yashwardhan Singh Tomar: education, internships, and technical focus.',
  openGraph: { images: [{ url: '/api/og?title=About' }] }
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      {/* Terminal page header */}
      <div className="border-b border-[#003d0f] pb-4">
        <p className="font-mono text-xs text-[#006622]">
          <span className="text-[#00ff41]">root@yst</span>
          <span className="text-[#006622]">:~/about$</span>
          {' '}cat bio.md
        </p>
      </div>

      <SectionTitle
        overline="About"
        title="Engineering with Product Taste"
        description="CS student who likes hard system constraints and user-facing polish in the same product."
      />

      <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <p className="font-mono text-sm text-[#00cc33]">
            I enjoy end-to-end ownership: defining problem boundaries, making architecture decisions,
            and shipping interfaces that feel intentional. Most of my work lives at the intersection
            of distributed systems and product engineering.
          </p>

          {/* Interests */}
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="border border-[#003d0f] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#006622]"
              >
                [{interest}]
              </span>
            ))}
          </div>

          {/* What I'm looking for */}
          <div className="border border-[#003d0f] bg-[#0a0f0a] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#006622]">
              &gt; QUERY: available_roles
            </p>
            <p className="mt-3 font-mono text-xs text-[#00cc33]">
              Research opportunities in ML systems, agentic AI, or efficient inference for the
              remainder of 2026, and full-time software engineering roles from mid-2027.
            </p>
          </div>
        </div>

        {/* Terminal timeline */}
        <div className="space-y-3">
          <p className="font-mono text-[10px] text-[#006622]">
            <span className="text-[#00ff41]">root@yst</span>
            <span className="text-[#006622]">:~/about$</span>
            {' '}git log --oneline
          </p>
          <Timeline />
        </div>
      </section>
    </div>
  );
}
