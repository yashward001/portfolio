import { profile } from '@/content/profile';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-[#003d0f]">
      <div className="container py-8">
        <pre className="overflow-x-auto font-mono text-xs text-[#006622]">
{`┌──────────────────────────────────────────────────────────────────┐
│ © ${year} ${profile.name.toUpperCase().padEnd(43)}│
│ BUILT WITH NEXT.JS + TYPESCRIPT                                  │
│                                                                  │`}
        </pre>
        <pre className="font-mono text-xs text-[#006622]">
{`│ `}
          {profile.socials.map((s, i) => (
            <span key={s.label}>
              <a
                href={s.href}
                className="text-[#00cc33] transition-colors hover:text-[#00ff41] hover:[text-shadow:0_0_8px_#00ff41]"
                target="_blank"
                rel="noreferrer"
              >
                [{s.label.toUpperCase()}]
              </a>
              {i < profile.socials.length - 1 ? ' ' : ''}
            </span>
          ))}
        </pre>
        <pre className="font-mono text-xs text-[#006622]">
{`│                                                                  │
│ root@yst:~$ `}<span className="animate-blink text-[#00ff41]">█</span>{`                                                   │
└──────────────────────────────────────────────────────────────────┘`}
        </pre>
      </div>
    </footer>
  );
};
