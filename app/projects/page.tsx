import type { Metadata } from 'next';

import { ProjectsGrid } from '@/components/sections/projects-grid';
import { SectionTitle } from '@/components/ui/section-title';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Project portfolio with systems, ML, and full-stack case studies.',
  openGraph: {
    images: [{ url: '/api/og?title=Projects' }]
  }
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="space-y-8">
      <SectionTitle
        overline="Projects"
        title="Case Studies"
        description="Filter by domain and sort by impact or recency."
      />
      <ProjectsGrid projects={projects} />
    </div>
  );
}
