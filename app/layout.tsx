import type { Metadata } from 'next';
import { JetBrains_Mono, Manrope, Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';

import { Analytics } from '@/components/layout/analytics';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { SignatureGrid } from '@/components/layout/signature-grid';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { getPosts, getProjects } from '@/lib/content';
import { baseMetadata } from '@/lib/metadata';

import '@/styles/globals.css';

const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} ${mono.variable} min-h-screen font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <a href="#main" className="focus-ring sr-only fixed left-4 top-4 z-[100] rounded bg-bg px-4 py-2 focus:not-sr-only">
            Skip to content
          </a>
          <ScrollProgress />
          <SignatureGrid />
          <Navbar commandItems={commandItems} />
          <main id="main" className="container py-10">
            {children}
          </main>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
