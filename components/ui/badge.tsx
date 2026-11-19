import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const Badge = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => <span className={cn('chip', className)}>{children}</span>;
