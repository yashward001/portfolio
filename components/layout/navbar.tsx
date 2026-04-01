'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { CommandPalette, type CommandItem } from './command-palette';

const pageLinks: Array<{ href: Route; label: string }> = [
  { href: '/',         label: 'HOME'     },
  { href: '/projects', label: 'PROJECTS' },
  { href: '/about',    label: 'ABOUT'    },
  { href: '/resume',   label: 'RESUME'   },
  { href: '/contact',  label: 'CONTACT'  }
];

export const Navbar = ({ commandItems }: { commandItems: CommandItem[] }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#003d0f] bg-black/95 backdrop-blur-sm">
      <nav className="container flex h-14 items-center justify-between gap-3">
        {/* Terminal prompt */}
        <Link
          href="/"
          className="focus-ring font-mono text-xs text-[#006622] transition-colors hover:text-[#00ff41]"
        >
          <span className="text-[#00ff41]">root@yst</span>
          <span className="text-[#006622]">:~$</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-0 lg:flex">
          {pageLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'focus-ring px-4 py-2 font-mono text-xs tracking-widest transition-colors',
                  active
                    ? 'bg-[#003d0f] text-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.2)]'
                    : 'text-[#006622] hover:bg-[#003d0f]/60 hover:text-[#00ff41]'
                )}
              >
                /{item.label}
              </Link>
            );
          })}
        </div>

        {/* Command palette */}
        <CommandPalette items={commandItems} />
      </nav>
    </header>
  );
};
