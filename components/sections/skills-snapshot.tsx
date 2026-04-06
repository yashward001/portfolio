import { Github, Linkedin } from 'lucide-react';

import { profile } from '@/content/profile';

const CATEGORY_PREFIX: Record<string, string> = {
  'Languages':     'LANG',
  'ML / AI':       'ML/AI',
  'Web & Backend': 'WEB',
  'Data & Infra':  'DATA',
  'Tools':         'TOOLS'
};

export const SkillsSnapshot = () => {
  return (
    <section className="border border-[#003d0f] bg-[#0a0f0a] p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-[#00ff41]">
          root@yst:~$ skills --list
        </span>
        <div className="flex items-center gap-2">
          <a
            href={profile.github}
            className="focus-ring border border-[#003d0f] p-1.5 text-[#006622] transition-colors hover:border-[#00ff41] hover:text-[#00ff41]"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
          <a
            href={profile.linkedin}
            className="focus-ring border border-[#003d0f] p-1.5 text-[#006622] transition-colors hover:border-[#00ff41] hover:text-[#00ff41]"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Grouped rows */}
      {profile.skillGroups ? (
        <div className="space-y-2.5">
          {profile.skillGroups.map((group) => (
            <div key={group.category} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="w-[4.5rem] shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#004d1a]">
                [{CATEGORY_PREFIX[group.category] ?? group.category}]
              </span>
              <span className="font-mono text-xs text-[#33ff66]">
                {group.items.join(' · ')}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {profile.skills.slice(0, 12).map((skill) => (
            <span
              key={skill}
              className="border border-[#003d0f] px-2 py-0.5 font-mono text-xs text-[#006622]"
            >
              [{skill}]
            </span>
          ))}
        </div>
      )}
    </section>
  );
};
