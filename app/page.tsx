import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { HeroGlow } from '@/components/sections/hero-glow';
import { ProjectCard } from '@/components/sections/project-card';
import { SkillsSnapshot } from '@/components/sections/skills-snapshot';
import { StatsRow } from '@/components/sections/stats-row';
import { KineticHeadline } from '@/components/ui/kinetic-headline';
import { Reveal } from '@/components/ui/reveal';
import { SectionTitle } from '@/components/ui/section-title';
import { profile } from '@/content/profile';
import { getFeaturedProjects } from '@/lib/content';

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <div className="space-y-20">
      {/* ── Hero ── */}
      <section id="hero" className="relative overflow-hidden border border-[#003d0f] bg-[#0a0f0a] p-6 sm:p-10">
        <HeroGlow />
        <div className="relative z-10 space-y-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#006622]">
            COMPUTER SCIENCE PORTFOLIO · NTU SINGAPORE
          </p>
          <KineticHeadline text="I design intelligent systems and ship polished software products." />
          <p className="max-w-2xl font-mono text-sm text-[#006622]">
            <span className="text-[#004d1a]"># </span>
            {profile.valueProp}
          </p>
        </div>

        <div className="relative z-10 mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="focus-ring border border-[#00ff41] bg-transparent px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.35)]"
          >
            /PROJECTS
          </Link>
          <Link
            href="/resume"
            className="focus-ring border border-[#003d0f] bg-transparent px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-[#006622] transition-all hover:border-[#00ff41] hover:text-[#00ff41]"
          >
            /RESUME
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats">
        <Reveal>
          <StatsRow />
        </Reveal>
      </section>

      {/* ── Featured Projects ── */}
      <section id="featured-projects" className="space-y-5">
        <Reveal>
          <SectionTitle
            overline="Selected Work"
            title="Featured Case Studies"
            description="Architecture-first engineering projects."
          />
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-3">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.05}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Link
            href="/projects"
            className="focus-ring inline-flex items-center gap-2 font-mono text-xs text-[#006622] transition-colors hover:text-[#00ff41]"
          >
            root@yst:~$ ls /projects <ArrowRight className="h-3 w-3" />
          </Link>
        </Reveal>
      </section>

      {/* ── Skills ── */}
      <section id="skills">
        <Reveal>
          <SkillsSnapshot />
        </Reveal>
      </section>
    </div>
  );
}
