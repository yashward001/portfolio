import Link from 'next/link';

import { SpotlightCard } from '@/components/ui/spotlight-card';
import type { Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <SpotlightCard as="article" className="group flex h-full flex-col border border-[#003d0f] transition-all duration-200 hover:border-[#00ff41] hover:shadow-[0_0_20px_rgba(0,255,65,0.12)]">
      {/* Terminal title bar */}
      <div className="flex items-center justify-between border-b border-[#003d0f] px-3 py-2 group-hover:border-[#00ff41]/40">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#006622]">
          ── [PROJECT] ──────────────────────
        </span>
        <span className="font-mono text-[10px] text-[#003d0f]">{formatDate(project.date)}</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Role badge */}
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#006622]">
          ROLE: {project.role}
        </span>

        {/* Title */}
        <h3 className="font-mono text-base font-bold uppercase tracking-wide text-[#00ff41] leading-tight">
          &gt; {project.title}
        </h3>

        {/* Summary */}
        <p className="font-mono text-xs text-[#33ff66] leading-relaxed">{project.summary}</p>

        {/* Impact metric */}
        <div className="border border-[#003d0f] bg-black/50 px-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#006622]">IMPACT: </span>
          <span className="font-mono text-xs text-[#33ff66]">{project.impactMetric}</span>
        </div>

        {/* Stack */}
        <p className="font-mono text-[10px] text-[#006622]">
          <span className="text-[#004d1a]">STACK: </span>
          {project.stack.slice(0, 5).join(' · ')}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="border border-[#003d0f] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#006622]"
            >
              [{tag}]
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="border border-[#003d0f] px-1.5 py-0.5 font-mono text-[10px] text-[#004d1a]">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* Footer links */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <Link
            href={`/projects/${project.slug}`}
            className="focus-ring font-mono text-xs text-[#33ff66] transition-colors hover:text-[#00ff41] hover:[text-shadow:0_0_6px_#00ff41]"
          >
            [OPEN CASE STUDY ▶]
          </Link>
          <div className="flex items-center gap-2">
            {project.links.repo && (
              <a
                href={project.links.repo}
                className="focus-ring font-mono text-[10px] text-[#006622] transition-colors hover:text-[#00ff41]"
                aria-label="GitHub repository"
                target="_blank"
                rel="noreferrer"
              >
                [GH]
              </a>
            )}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
};
