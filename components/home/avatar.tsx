import Image from 'next/image';

import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

const initials = profile.name
  .split(' ')
  .filter(Boolean)
  .map((part) => part[0])
  .filter((_, i, all) => i === 0 || i === all.length - 1)
  .join('');

/** Inline avatar that sits inside the hero headline. Sized in `em` so it scales with the text. */
export const Avatar = ({ className }: { className?: string }) => (
  <span
    className={cn(
      // inline-block + overflow-hidden puts the baseline at the bottom edge, so the
      // -0.2em offset centres the 1.15em box on the cap height of the headline.
      'relative inline-block h-[1.15em] w-[1.15em] shrink-0 overflow-hidden rounded-[0.32em] align-[-0.2em] ring-[3px] ring-white',
      'shadow-[0_8px_24px_-8px_rgba(17,17,17,0.35)]',
      className
    )}
  >
    {profile.avatar ? (
      <Image
        src={profile.avatar}
        alt=""
        fill
        sizes="80px"
        className="object-cover"
        priority
      />
    ) : (
      <span
        aria-hidden
        className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_120%_at_20%_10%,#3a3a3a_0%,#121212_60%)] text-[0.42em] font-semibold tracking-[-0.04em] text-white"
      >
        {initials}
        <span className="absolute bottom-[0.18em] right-[0.18em] h-[0.12em] w-[0.12em] rounded-full bg-accent" />
      </span>
    )}
  </span>
);
