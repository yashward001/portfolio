import { Github, Linkedin } from 'lucide-react';

import { profile } from '@/content/profile';

import { Badge } from '../ui/badge';

export const SkillsSnapshot = () => {
  return (
    <section className="space-y-6 rounded-2xl border border-border/70 bg-card/80 p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-xl">Skills Snapshot</h3>
        <div className="flex items-center gap-2">
          <a
            href={profile.github}
            className="focus-ring rounded-md border border-border p-2 hover:text-accent"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.linkedin}
            className="focus-ring rounded-md border border-border p-2 hover:text-accent"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>

      {profile.skillGroups ? (
        <div className="space-y-3">
          {profile.skillGroups.map((group) => (
            <div key={group.category} className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="min-w-[8rem] text-xs font-medium uppercase tracking-wide text-muted">{group.category}</span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {profile.skills.slice(0, 12).map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      )}
    </section>
  );
};
