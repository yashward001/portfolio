import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export const Badge = ({ children, className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted',
      className
    )}
  >
    {children}
  </span>
);
