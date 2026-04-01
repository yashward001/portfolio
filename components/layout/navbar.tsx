'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';

import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

import { CommandPalette, type CommandItem } from './command-palette';
import { ThemeToggle } from './theme-toggle';

const pageLinks: Array<{ href: Route; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' }
];

export const Navbar = ({ commandItems }: { commandItems: CommandItem[] }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-bg/75 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="focus-ring rounded-md font-display text-sm tracking-wide">
          {profile.name}
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {pageLinks.map((item) => {
            const isRouteActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'focus-ring rounded-md px-3 py-2 text-sm transition-colors',
                  isRouteActive ? 'text-fg' : 'text-muted hover:text-fg'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <CommandPalette items={commandItems} />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
