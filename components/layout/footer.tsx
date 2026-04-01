import { profile } from '@/content/profile';

export const Footer = () => {
  return (
    <footer className="border-t border-border/70 py-8">
      <div className="container flex flex-col items-start justify-between gap-4 text-sm text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {profile.name}. Built with Next.js + TypeScript.</p>
        <div className="flex items-center gap-4">
          {profile.socials.map((social) => (
            <a key={social.label} href={social.href} className="focus-ring rounded text-muted hover:text-fg" target="_blank" rel="noreferrer">
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
