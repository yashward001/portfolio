import type { Metadata } from 'next';

import { ContactForm } from '@/components/sections/contact-form';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for internships and software engineering opportunities.',
  openGraph: { images: [{ url: '/api/og?title=Contact' }] }
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr]">
      {/* Info panel */}
      <div className="space-y-5">
        {/* Terminal page header */}
        <div className="border-b border-[#003d0f] pb-3">
          <p className="font-mono text-xs text-[#006622]">
            <span className="text-[#00ff41]">root@yst</span>
            <span className="text-[#006622]">:~$</span>
            {' '}./contact.sh
          </p>
        </div>

        <h1 className="font-mono text-xl font-bold uppercase tracking-wide text-white">
          Contact
        </h1>

        <p className="font-mono text-xs text-white/70">
          For internship or collaboration opportunities, use the form or reach out directly.
        </p>

        <ul className="space-y-2 font-mono text-xs">
          <li>
            <span className="text-[#004d1a]">PHONE: </span>
            <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="text-[#33ff66] hover:text-[#00ff41]">
              {profile.phone}
            </a>
          </li>
          <li>
            <span className="text-[#004d1a]">EMAIL: </span>
            <a href={`mailto:${profile.email}`} className="text-[#33ff66] hover:text-[#00ff41]">
              {profile.email}
            </a>
          </li>
          <li>
            <span className="text-[#004d1a]">ALT:   </span>
            <a href="mailto:yashwardhansingh.tomar@outlook.com" className="text-[#33ff66] hover:text-[#00ff41]">
              yashwardhansingh.tomar@outlook.com
            </a>
          </li>
          <li>
            <span className="text-[#004d1a]">GH:    </span>
            <a href={profile.github} className="text-[#33ff66] hover:text-[#00ff41]" target="_blank" rel="noreferrer">
              {profile.github.replace('https://', '')}
            </a>
          </li>
          <li>
            <span className="text-[#004d1a]">LI:    </span>
            <a href={profile.linkedin} className="text-[#33ff66] hover:text-[#00ff41]" target="_blank" rel="noreferrer">
              {profile.linkedin.replace('https://', '')}
            </a>
          </li>
        </ul>
      </div>

      <ContactForm />
    </section>
  );
}
