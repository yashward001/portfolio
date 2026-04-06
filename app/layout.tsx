import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { Analytics } from '@/components/layout/analytics';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { TerminalCursor } from '@/components/ui/terminal-cursor';
import { getPosts, getProjects } from '@/lib/content';
import { baseMetadata } from '@/lib/metadata';

import '@/styles/globals.css';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = baseMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  const commandItems = [
    ...getProjects().map((project) => ({
      title: project.title,
      href: `/projects/${project.slug}`,
      type: 'project' as const,
      meta: project.tags.join(' ')
    })),
    ...getPosts().map((post) => ({
      title: post.title,
      href: `/blog/${post.slug}`,
      type: 'post' as const,
      meta: post.tags.join(' ')
    })),
    { title: 'All Projects', href: '/projects', type: 'page' as const, meta: 'case studies engineering' },
    { title: 'About', href: '/about', type: 'page' as const, meta: 'background' },
    { title: 'Resume', href: '/resume', type: 'page' as const, meta: 'experience' },
    { title: 'Contact', href: '/contact', type: 'page' as const, meta: 'reach out' }
  ];

  return (
    <html lang="en" className="dark">
      <body className={`${mono.variable} min-h-screen bg-black font-mono text-[#33ff66]`}>
        <a
          href="#main"
          className="sr-only fixed left-4 top-4 z-[100] bg-black px-4 py-2 text-[#00ff41] focus:not-sr-only focus:outline focus:outline-[#00ff41]"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <TerminalCursor />
        <Navbar commandItems={commandItems} />
        <main id="main" className="container py-10">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
