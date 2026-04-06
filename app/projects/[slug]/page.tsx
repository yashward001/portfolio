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
      {/* Back link */}
      <Link href="/projects" className="focus-ring inline-flex items-center gap-2 font-mono text-xs text-[#006622] transition-colors hover:text-[#00ff41]">
        <ArrowLeft className="h-3 w-3" /> cd ../projects
      </Link>

      {/* Terminal page header */}
      <div className="border-b border-[#003d0f] pb-3">
        <p className="font-mono text-xs text-[#006622]">
          <span className="text-[#00ff41]">root@yst</span>
          <span className="text-[#006622]">:~/projects$</span>
          {' '}cat {project.slug}.md
        </p>
      </div>

      <ProjectGallery project={project} />

      <header className="space-y-4">
        <h1 className="font-mono text-3xl font-bold uppercase tracking-wide text-[#00ff41]"
          style={{ textShadow: '0 0 16px rgba(0,255,65,0.4)' }}>
          {project.title}
        </h1>
        <p className="font-mono text-sm text-white/75">{project.summary}</p>

        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-[#00aa44]">
          <span>ROLE: {project.role}</span>
          <span className="text-[#003d0f]">|</span>
          <span>{formatDate(project.date)}</span>
          <span className="text-[#003d0f]">|</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3 w-3" /> {project.readingMinutes} min read
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="border border-[#003d0f] bg-[#0a0f0a] px-3 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#006622]">IMPACT: </span>
          <span className="font-mono text-xs text-[#33ff66]">{project.impactMetric}</span>
        </div>

        <div className="flex gap-4">
          {project.links.repo && (
            <a href={project.links.repo} className="focus-ring inline-flex items-center gap-1 font-mono text-xs text-[#33ff66] transition-colors hover:text-[#00ff41]" target="_blank" rel="noreferrer">
              <Github className="h-3 w-3" /> [REPOSITORY]
            </a>
          )}
          {(project.links.live || project.links.demo) && (
            <a href={project.links.live ?? project.links.demo ?? '#'} className="focus-ring inline-flex items-center gap-1 font-mono text-xs text-[#33ff66] transition-colors hover:text-[#00ff41]" target="_blank" rel="noreferrer">
              <ArrowUpRight className="h-3 w-3" /> [LIVE DEMO]
            </a>
          )}
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        {[
          { label: 'ARCHITECTURE', body: 'System design, data flow, and implementation details documented below.' },
          { label: 'TRADEOFFS',    body: 'Key technical choices and constraints explicitly captured in each section.' },
          { label: 'IMPACT',       body: project.impactMetric }
        ].map(({ label, body }) => (
          <div key={label} className="border border-[#003d0f] bg-[#0a0f0a] p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#006622]">{label}</p>
            <p className="mt-1.5 font-mono text-xs text-[#33ff66]">{body}</p>
          </div>
        ))}
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
