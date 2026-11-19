import { ArrowUpRight, Github } from 'lucide-react';
import Link from 'next/link';

import type { Project } from '@/lib/types';
import { repoUrl } from '@/lib/utils';

export const ProjectCard = ({ project }: { project: Project }) => {
  const repo = repoUrl(project.links.repo);
  return (
    <article className="card group flex h-full flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(17,17,17,0.04),0_20px_40px_-20px_rgba(17,17,17,0.22)]">
      <div className="flex items-center justify-between gap-3 text-xs text-subtle">
        <span className="truncate">{project.role}</span>
        <span className="shrink-0">{new Date(project.date).getFullYear()}</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug">
        <Link
          href={`/projects/${project.slug}`}
          className="focus-ring rounded after:absolute after:inset-0"
        >
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {project.summary}
      </p>

      <p className="mt-4 rounded-2xl bg-accent/[0.07] px-3.5 py-2.5 text-[13px] leading-snug text-fg/85">
        <span className="font-medium text-accent">Impact · </span>
        {project.impactMetric}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((item) => (
          <li key={item} className="chip">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between pt-5 text-sm">
        <span className="inline-flex items-center gap-1 font-medium transition group-hover:text-accent">
          Case study <ArrowUpRight className="h-4 w-4" />
        </span>
        {repo && (
          <a
            href={repo}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} source code on GitHub`}
            className="focus-ring relative z-10 grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-bg hover:text-fg"
          >
            <Github className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
};
