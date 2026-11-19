'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

const NAV: Array<{ href: Route; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' }
];

export const SiteHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on navigation
  useEffect(() => setOpen(false), [pathname]);

  // Close on Escape / outside click
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      )
        setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <header className="relative z-40 flex items-center justify-between pt-8 sm:pt-12">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/"
          aria-label="Home"
          className="focus-ring flex items-end gap-1 rounded-lg"
        >
          <span className="text-2xl font-bold leading-none tracking-[-0.06em]">
            yst
          </span>
          <span
            className="mb-[3px] h-1.5 w-1.5 rounded-full bg-accent"
            aria-hidden
          />
        </Link>
        <a
          href={`mailto:${profile.email}`}
          className="focus-ring link-underline hidden truncate rounded text-[15px] sm:inline"
        >
          {profile.email}
        </a>
      </div>

      <nav aria-label="Primary" className="flex items-center gap-1">
        <ul className="mr-2 hidden items-center gap-1 md:flex">
          {NAV.slice(1).map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'focus-ring rounded-full px-3 py-1.5 text-sm transition',
                    active
                      ? 'bg-card text-fg shadow-chip'
                      : 'text-muted hover:text-fg'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-card shadow-chip transition hover:scale-105 md:hidden"
        >
          <span className="relative block h-3 w-4" aria-hidden>
            <span
              className={cn(
                'absolute left-0 top-0 h-[1.5px] w-4 rounded bg-fg transition',
                open && 'top-[5px] rotate-45'
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-[5px] h-[1.5px] w-4 rounded bg-fg transition',
                open && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'absolute left-0 top-[10px] h-[1.5px] w-2.5 rounded bg-fg transition-all',
                open && 'top-[5px] w-4 -rotate-45'
              )}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="site-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="card absolute right-0 top-full mt-3 w-64 origin-top-right p-2 md:hidden"
          >
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'focus-ring flex rounded-2xl px-4 py-2.5 text-[15px] transition hover:bg-bg',
                      pathname === item.href
                        ? 'font-medium text-fg'
                        : 'text-muted'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2 border-t border-border px-4 pb-2 pt-3">
              <a
                href={`mailto:${profile.email}`}
                className="block truncate text-sm text-muted hover:text-fg"
              >
                {profile.email}
              </a>
              <div className="mt-2 flex gap-4 text-sm">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 hover:text-accent"
                >
                  LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 hover:text-accent"
                >
                  GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
