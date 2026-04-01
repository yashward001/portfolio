import type { Metadata } from 'next';

import { ProjectsGrid } from '@/components/sections/projects-grid';
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
      <div className="border-b border-[#003d0f] pb-4">
        <p className="font-mono text-xs text-[#006622]">
          <span className="text-[#00ff41]">root@yst</span>
          <span className="text-[#006622]">:~/projects$</span>
          {' '}ls -la
        </p>
        <p className="mt-1 font-mono text-[10px] text-[#004d1a]">
          total {projects.length} — sorted by date desc
        </p>
      </div>
      <h1
        className="font-mono text-2xl font-bold uppercase tracking-wide text-[#00ff41]"
        style={{ textShadow: '0 0 12px rgba(0,255,65,0.4)' }}
      >
        All Projects
      </h1>
      <ProjectsGrid projects={projects} />
    </div>
  );
}
