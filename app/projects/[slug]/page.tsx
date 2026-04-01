import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Clock3, Github } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from '@/components/mdx/mdx-components';
import { ProjectGallery } from '@/components/sections/project-gallery';
import { Badge } from '@/components/ui/badge';
import { getProjectBySlug, getProjects } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export const generateStaticParams = async () => getProjects().map((project) => ({ slug: project.slug }));

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
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

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <Link href="/projects" className="focus-ring inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>

      <ProjectGallery project={project} />

      <header className="space-y-4">
        <h1 className="font-display text-4xl tracking-tight">{project.title}</h1>
        <p className="text-muted">{project.summary}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>{project.role}</span>
          <span>•</span>
          <span>{formatDate(project.date)}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4" /> {project.readingMinutes} min read
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <p className="font-medium text-success">{project.impactMetric}</p>
        <div className="flex gap-3">
          {project.links.repo ? (
            <a
              href={project.links.repo}
              className="focus-ring inline-flex items-center gap-1 text-sm text-accent"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-4 w-4" /> Repository
            </a>
          ) : null}
          {project.links.live || project.links.demo ? (
            <a
              href={project.links.live ?? project.links.demo ?? '#'}
              className="focus-ring inline-flex items-center gap-1 text-sm text-accent"
              target="_blank"
              rel="noreferrer"
            >
              <ArrowUpRight className="h-4 w-4" /> Live Demo
            </a>
          ) : null}
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Architecture</p>
          <p className="mt-2 text-sm text-muted">System design, data flow, and implementation details are documented below.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Tradeoffs</p>
          <p className="mt-2 text-sm text-muted">Key technical choices and constraints are explicitly captured in each case study section.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Impact Metrics</p>
          <p className="mt-2 text-sm font-medium text-accent">{project.impactMetric}</p>
        </div>
      </section>

      <div className="prose">
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
    </article>
  );
}
