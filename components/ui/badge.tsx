import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export const Badge = ({ children, className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center border border-[#003d0f] bg-black px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-[#006622]',
      className
    )}
  >
    [{children}]
  </span>
);
