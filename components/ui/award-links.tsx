import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import type { Profile } from '@/lib/types';
import { cn } from '@/lib/utils';

type Award = Profile['awards'][number];

/** "Case study" + "SMU Newsroom ↗" links for an award, when it has them. */
export const AwardLinks = ({
  award,
  className
}: {
  award: Award;
  className?: string;
}) => {
  if (!award.projectSlug && !award.url) return null;

  return (
    <span
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]',
        className
      )}
    >
      {award.projectSlug && (
        <Link
          href={`/projects/${award.projectSlug}`}
          className="focus-ring link-underline rounded font-medium text-fg"
        >
          Case study
        </Link>
      )}
      {award.url && (
        <a
          href={award.url}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center gap-0.5 rounded text-muted transition hover:text-fg"
        >
          {award.source ?? 'Announcement'}{' '}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      )}
    </span>
  );
};
