import type { Metadata } from 'next';
import { ArrowUpRight, Github, Linkedin, Mail, Phone } from 'lucide-react';

import { ContactForm } from '@/components/sections/contact-form';
import { PageHeader } from '@/components/ui/page-header';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch about ML and software engineering roles or collaborations.',
  openGraph: { images: [{ url: '/api/og?title=Contact' }] }
};

const CHANNELS = [
  {
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
    external: false
  },
  {
    label: 'LinkedIn',
    value: profile.linkedin.replace(/^https?:\/\/(www\.)?/, ''),
    href: profile.linkedin,
    icon: Linkedin,
    external: true
  },
  {
    label: 'GitHub',
    value: profile.github.replace(/^https?:\/\/(www\.)?/, ''),
    href: profile.github,
    icon: Github,
    external: true
  },
  {
    label: 'Phone',
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s+/g, '')}`,
    icon: Phone,
    external: false
  }
];

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        label="Contact"
        title={
          <>
            Let&apos;s <span className="text-accent">talk.</span>
          </>
        }
      >
        Open to ML and software engineering roles, research collaborations, or
        just a good conversation about AI systems. Investors interested in Soft
        Launch are very welcome too. Email is the fastest way to reach me.
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
        <ul className="card divide-y divide-border self-start">
          {CHANNELS.map(({ label, value, href, icon: Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="focus-ring group flex items-center gap-4 px-5 py-4 transition hover:bg-bg/60"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-bg text-fg">
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-subtle">{label}</span>
                  <span className="block truncate text-[15px] font-medium">
                    {value}
                  </span>
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-subtle transition group-hover:text-fg"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>

        <ContactForm email={profile.email} />
      </div>
    </div>
  );
}
