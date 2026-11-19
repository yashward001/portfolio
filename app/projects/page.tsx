import type { Metadata } from 'next';

import { ProjectsGrid } from '@/components/sections/projects-grid';
import { PageHeader } from '@/components/ui/page-header';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Case studies in ML systems, LLM tooling, trading infrastructure, and full-stack products.',
  openGraph: {
    images: [{ url: '/api/og?title=Projects' }]
  }
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="space-y-12">
      <PageHeader
        label="Projects"
        title={
          <>
            Things I&apos;ve <span className="text-accent">built.</span>
          </>
        }
      >
        {projects.length} case studies across ML systems, LLM tooling, trading
        infrastructure and full-stack products. Each one covers the problem,
        constraints, architecture and tradeoffs.
      </PageHeader>
      <ProjectsGrid projects={projects} />
    </div>
  );
}
