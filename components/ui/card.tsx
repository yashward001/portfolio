import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const Card = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => <article className={cn('card p-6', className)}>{children}</article>;
