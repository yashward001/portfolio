import type { Metadata } from 'next';

import { ContactForm } from '@/components/sections/contact-form';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for internships and software engineering opportunities.',
  openGraph: {
    images: [{ url: '/api/og?title=Contact' }]
  }
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-4">
        <h1 className="font-display text-4xl">Contact</h1>
        <p className="text-muted">For internship or collaboration opportunities, use the form or reach out directly.</p>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            Phone:{' '}
            <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="text-accent">
              {profile.phone}
            </a>
          </li>
          <li>
            Email:{' '}
            <a href={`mailto:${profile.email}`} className="text-accent">
              {profile.email}
            </a>
          </li>
          <li>
            Alternate Email:{' '}
            <a href="mailto:yashwardhansingh.tomar@outlook.com" className="text-accent">
              yashwardhansingh.tomar@outlook.com
            </a>
          </li>
          <li>
            GitHub:{' '}
            <a href={profile.github} className="text-accent" target="_blank" rel="noreferrer">
              {profile.github}
            </a>
          </li>
          <li>
            LinkedIn:{' '}
            <a href={profile.linkedin} className="text-accent" target="_blank" rel="noreferrer">
              {profile.linkedin}
            </a>
          </li>
        </ul>
      </div>
      <ContactForm />
    </section>
  );
}
