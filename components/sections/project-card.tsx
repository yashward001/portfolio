import Link from 'next/link';
import { ArrowUpRight, Github, Sparkles } from 'lucide-react';

import type { Project } from '@/lib/types';
import { formatDate } from '@/lib/utils';

import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className="group h-full p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_hsl(var(--accent)/0.8)]">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted">
            <Sparkles className="h-3 w-3 text-accent" />
            {project.role}
          </span>
          <p className="text-xs text-muted">{formatDate(project.date)}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-xl leading-tight">{project.title}</h3>
          <p className="text-sm text-muted">{project.summary}</p>
        </div>

        <div className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-medium text-accent">
          {project.impactMetric}
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          {project.tags.length > 4 ? <Badge>+{project.tags.length - 4} more</Badge> : null}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <Link href={`/projects/${project.slug}`} className="focus-ring inline-flex items-center gap-1 text-sm text-accent">
            Open Case Study <ArrowUpRight className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            {project.links.repo ? (
              <a
                href={project.links.repo}
                className="focus-ring rounded p-1.5 text-muted hover:text-fg"
                aria-label="GitHub repository"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            ) : null}
            {project.links.live || project.links.demo ? (
              <a
                href={project.links.live ?? project.links.demo ?? '#'}
                className="focus-ring rounded p-1.5 text-muted hover:text-fg"
                aria-label="Live project link"
                target="_blank"
                rel="noreferrer"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
};
