import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from '@/components/mdx/mdx-components';
import { getProjectBySlug, getProjects } from '@/lib/content';
import { formatDate, repoUrl } from '@/lib/utils';

export const generateStaticParams = async () =>
  getProjects().map((project) => ({ slug: project.slug }));

export const generateMetadata = async ({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      images: [{ url: `/api/og?title=${encodeURIComponent(project.title)}` }]
    }
  };
};

export default function ProjectDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const live = project.links.live ?? project.links.demo;
  const repo = repoUrl(project.links.repo);

  return (
    <article className="mx-auto max-w-[720px]">
      <Link
        href="/projects"
        className="focus-ring group inline-flex items-center gap-1.5 rounded text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />{' '}
        All projects
      </Link>

      <header className="mt-8 space-y-5">
        <p className="text-sm text-subtle">
          {project.role} · {formatDate(project.date)} · {project.readingMinutes}{' '}
          min read
        </p>
        <h1 className="text-[clamp(2rem,5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
          {project.title}
        </h1>
        <p className="text-lg leading-relaxed text-muted">{project.summary}</p>

        {(repo || live) && (
          <div className="flex flex-wrap gap-3 pt-1">
            {repo && (
              <a
                href={repo}
                target="_blank"
                rel="noreferrer"
                className="btn-primary focus-ring"
              >
                <Github className="h-4 w-4" /> View code
              </a>
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary focus-ring"
              >
                Live demo <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </header>

      <div className="card mt-10 grid gap-6 p-6 sm:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-xs font-medium text-subtle">Impact</p>
          <p className="mt-1.5 text-[15px] font-medium leading-snug">
            {project.impactMetric}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-subtle">Stack</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="prose mt-6">
        <MDXRemote
          source={project.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight]
            }
          }}
        />
      </div>

      <div className="mt-16 border-t border-border pt-8">
        <Link
          href="/projects"
          className="focus-ring group inline-flex items-center gap-1.5 rounded font-medium hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />{' '}
          Back to all projects
        </Link>
      </div>
    </article>
  );
}
