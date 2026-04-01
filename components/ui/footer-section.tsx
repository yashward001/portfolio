'use client';

import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, Terminal } from 'lucide-react';

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: 'NAVIGATE',
    links: [
      { title: '/home',     href: '/'         },
      { title: '/projects', href: '/projects' },
      { title: '/about',    href: '/about'    },
      { title: '/resume',   href: '/resume'   },
      { title: '/contact',  href: '/contact'  },
    ],
  },
  {
    label: 'FEATURED',
    links: [
      { title: 'ATLAS',        href: '/projects/atlas-agentic-desktop-automation' },
      { title: 'NanoExchange', href: '/projects/nanoexchange-trading-platform'    },
      { title: 'Loop.AI',      href: '/projects/loop-ai-email-dashboard'          },
      { title: 'All →',        href: '/projects'                                  },
    ],
  },
  {
    label: 'WRITING',
    links: [
      { title: 'Blog',              href: '/blog'                            },
      { title: 'Reliable APIs',     href: '/blog/designing-reliable-apis'   },
      { title: 'Portfolio Notes',   href: '/blog/what-recruiters-notice'    },
    ],
  },
  {
    label: 'CONNECT',
    links: [
      { title: 'GitHub',   href: 'https://github.com/yashward001',                          icon: Github,   external: true },
      { title: 'LinkedIn', href: 'https://linkedin.com/in/yashwardhan-singh-tomar',         icon: Linkedin, external: true },
      { title: 'Email',    href: 'mailto:yashward001@e.ntu.edu.sg',                         icon: Mail,     external: true },
    ],
  },
];

export const FooterSection = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 w-full border-t border-[#003d0f]">
      {/* Top glow line */}
      <div
        className="absolute left-1/2 top-0 h-px w-1/3 -translate-x-1/2 -translate-y-px"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,65,0.45) 0%, transparent 70%)' }}
      />

      <div className="container py-12 lg:py-16">
        <div className="grid w-full gap-10 xl:grid-cols-3 xl:gap-8">

          {/* ── Identity block ─────────────────────────── */}
          <AnimatedContainer className="space-y-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-[#00ff41]" style={{ filter: 'drop-shadow(0 0 6px #00ff41)' }} />
              <span className="font-mono text-xs text-[#006622]">
                <span className="text-[#00ff41]">root@yst</span>:~$
              </span>
            </div>

            <div className="space-y-1 font-mono text-[11px] text-[#004d1a]">
              <p className="text-[#006622]">Yashwardhan Singh Tomar</p>
              <p>CS @ Nanyang Technological University</p>
              <p>Singapore · <span className="text-[#003d0f]">Open to opportunities</span></p>
            </div>

            <p className="font-mono text-[10px] text-[#003d0f]">
              © {year} · Built with Next.js + TypeScript
            </p>
          </AnimatedContainer>

          {/* ── Link columns ───────────────────────────── */}
          <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
            {footerLinks.map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.1 + index * 0.08}>
                <div>
                  {/* Section label */}
                  <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00ff41]">
                    [{section.label}]
                  </h3>

                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.title}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#006622] transition-colors duration-200 hover:text-[#00ff41] hover:[text-shadow:0_0_6px_#00ff41]"
                          >
                            {link.icon && <link.icon className="h-3 w-3" />}
                            {link.title}
                          </a>
                        ) : (
                          <Link
                            href={link.href as Route}
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#006622] transition-colors duration-200 hover:text-[#00ff41] hover:[text-shadow:0_0_6px_#00ff41]"
                          >
                            {link.icon && <link.icon className="h-3 w-3" />}
                            {link.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        {/* ── Bottom prompt bar ──────────────────────── */}
        <AnimatedContainer delay={0.45}>
          <div className="mt-10 border-t border-[#003d0f] pt-5 flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] text-[#004d1a]">
              root@yst:~$ <span className="animate-blink text-[#00ff41]">█</span>
            </span>
            <span className="font-mono text-[10px] text-[#003d0f]">
              v{year}.04 · SYSTEM ONLINE
            </span>
          </div>
        </AnimatedContainer>
      </div>
    </footer>
  );
};

/* ── AnimatedContainer ─────────────────────────────────────────────────── */

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -6, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
