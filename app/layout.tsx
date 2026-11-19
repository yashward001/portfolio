import type { Metadata, Viewport } from 'next';
import { Inter_Tight, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { Analytics } from '@/components/layout/analytics';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { baseMetadata } from '@/lib/metadata';

import '@/styles/globals.css';

const sans = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500']
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: '#f5f5f3'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-fg px-4 py-2 text-sm text-white focus:not-sr-only"
        >
          Skip to content
        </a>
        <div className="mx-auto flex min-h-screen w-full max-w-[920px] flex-col px-4 sm:px-6">
          <SiteHeader />
          <main id="main" className="flex-1 pb-20 pt-10 sm:pt-14">
            {children}
          </main>
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
