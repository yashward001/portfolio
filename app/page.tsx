import { ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';

import { Avatar } from '@/components/home/avatar';
import {
  AwardCard,
  CollectionCard,
  ContactCta,
  ExperienceCard,
  LocationCard,
  ToolboxCard
} from '@/components/home/bento-cards';
import { FeaturedWorkCard } from '@/components/home/featured-work-card';
import { PlaylistCard } from '@/components/home/playlist-card';
import { Reveal } from '@/components/ui/reveal';
import { profile } from '@/content/profile';
import { getFeaturedProjects, getProjects } from '@/lib/content';
import { repoUrl } from '@/lib/utils';

const shortName = (title: string) => title.split(/ — |: | \(/)[0].trim();

export default function HomePage() {
  const featured = getFeaturedProjects();
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const more = getProjects()
    .filter((p) => !featuredSlugs.has(p.slug))
    .sort((a, b) => b.sortImpact - a.sortImpact)
    .slice(0, 4);

  return (
    <div className="space-y-24">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="hero-title" className="space-y-10">
        <h1
          id="hero-title"
          className="text-[clamp(2.25rem,7vw,3.6rem)] font-semibold leading-[1.12] tracking-[-0.035em]"
        >
          <span className="block">
            Hi, I&apos;m <Avatar className="mx-1" /> Yashwardhan!
          </span>
          <span className="block">
            <span className="text-subtle">I&apos;m an</span> AI engineer{' '}
            <span className="text-subtle">studying</span>
          </span>
          <span className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="text-accent">CS at NTU.</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-[15px] font-medium tracking-normal text-fg shadow-chip">
              <span className="relative flex h-2.5 w-2.5" aria-hidden>
                <span className="animate-ping-soft absolute inset-0 rounded-full bg-success" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              {profile.availability}
            </span>
          </span>
        </h1>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <a
            href={profile.resumeUrl}
            className="btn-primary focus-ring self-start"
          >
            <Download className="h-4 w-4" aria-hidden /> Download résumé
          </a>
          <p className="max-w-md text-[17px] leading-snug text-fg/85">
            I build production ML and LLM systems, most recently at Panasonic
            Research. Explore my work and reach out&nbsp;— I&apos;d love to
            connect.
          </p>
        </div>
      </section>

      {/* ── Bento ────────────────────────────────────────────────────── */}
      <Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <ExperienceCard />
          <PlaylistCard />
          <CollectionCard />
          <LocationCard />
          <FeaturedWorkCard
            className="sm:col-span-2"
            items={featured.map((p) => ({
              slug: p.slug,
              title: p.title,
              shortTitle: shortName(p.title),
              summary: p.summary,
              impact: p.impactMetric,
              repo: repoUrl(p.links.repo)
            }))}
          />
          <AwardCard className="sm:col-span-2 md:col-span-1" />
          <ToolboxCard className="sm:col-span-2" />
        </div>
      </Reveal>

      {/* ── More projects ───────────────────────────────────────────── */}
      <Reveal>
        <section aria-labelledby="more-work" className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <h2 id="more-work" className="text-2xl font-semibold sm:text-3xl">
              More projects
            </h2>
            <Link
              href="/projects"
              className="focus-ring group inline-flex items-center gap-1 rounded text-sm font-medium text-muted hover:text-fg"
            >
              View all{' '}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ul className="card divide-y divide-border">
            {more.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="focus-ring group flex items-center gap-4 px-6 py-5 transition hover:bg-bg/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{shortName(project.title)}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted">
                      {project.summary}
                    </p>
                  </div>
                  <span className="hidden text-sm text-subtle sm:block">
                    {new Date(project.date).getFullYear()}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-subtle transition group-hover:translate-x-0.5 group-hover:text-fg" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal>
        <ContactCta />
      </Reveal>
    </div>
  );
}
