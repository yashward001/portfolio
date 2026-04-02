import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ProjectCard } from '@/components/sections/project-card';
import { SkillsSnapshot } from '@/components/sections/skills-snapshot';
import { StatsRow } from '@/components/sections/stats-row';
import { ParticleTextEffect } from '@/components/ui/particle-text-effect';
import { Reveal } from '@/components/ui/reveal';
import { SectionTitle } from '@/components/ui/section-title';
import { profile } from '@/content/profile';
import { getFeaturedProjects } from '@/lib/content';

const HERO_WORDS = [
  'YASHWARDHAN',   // identity anchor
  'AGENTIC AI',    // ATLAS — state machine + Playwright + Gemini
  'LLM SYSTEMS',   // core expertise
  'NANOEXCHANGE',  // C++20 deterministic matching engine
  'PYTORCH',       // ML depth — STM, Gigin, quant work
  'RAG PIPELINES', // enterprise RAG platform
];

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <div className="space-y-20">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative overflow-hidden border border-[#003d0f] bg-black"
      >
        {/* Particle canvas — full bleed, no padding */}
        <ParticleTextEffect words={HERO_WORDS} interval={3500} />

        {/* Scanline overlay on the canvas area only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)'
          }}
        />

        {/* Text + CTAs */}
        <div className="relative z-10 space-y-5 border-t border-[#003d0f] p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#006622]">
            root@yst:~$ <span className="text-[#004d1a]">./profile.sh</span>
          </p>

          <p className="max-w-2xl font-mono text-sm text-[#006622]">
            <span className="text-[#004d1a]"># </span>
            {profile.valueProp}
          </p>

          <div className="flex flex-wrap gap-3">
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

          <p className="font-mono text-[10px] text-[#003d0f]">
            right-click + drag on canvas to scatter particles
          </p>
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
