import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { HeroGlow } from '@/components/sections/hero-glow';
import { ProjectCard } from '@/components/sections/project-card';
import { SkillsSnapshot } from '@/components/sections/skills-snapshot';
import { StatsRow } from '@/components/sections/stats-row';
import { KineticHeadline } from '@/components/ui/kinetic-headline';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Reveal } from '@/components/ui/reveal';
import { SectionTitle } from '@/components/ui/section-title';
import { profile } from '@/content/profile';
import { getFeaturedProjects } from '@/lib/content';

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <div className="space-y-24">
      <section id="hero" className="relative overflow-hidden rounded-[28px] border border-border/70 bg-card/45 p-8 sm:p-12">
        <HeroGlow />
        <Reveal className="relative z-10 space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Computer Science Portfolio</p>
          <KineticHeadline text="I design intelligent systems and ship polished software products." />
          <p className="max-w-2xl text-lg text-muted">{profile.valueProp}</p>
        </Reveal>

        <Reveal delay={0.1} className="relative z-10 mt-8 flex flex-wrap gap-3">
          <MagneticButton href="/projects">Projects</MagneticButton>
          <MagneticButton href="/resume" variant="secondary">
            Resume
          </MagneticButton>
        </Reveal>
      </section>

      <section id="stats">
        <Reveal>
          <StatsRow />
        </Reveal>
      </section>

      <section id="featured-projects" className="space-y-6">
        <SectionTitle
          overline="Selected Work"
          title="Featured Case Studies"
          description="Architecture-first engineering projects with measurable impact."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.04}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <Link href="/projects" className="focus-ring inline-flex items-center gap-2 text-sm text-accent">
          See all projects <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section id="skills">
        <Reveal>
          <SkillsSnapshot />
        </Reveal>
      </section>
    </div>
  );
}
