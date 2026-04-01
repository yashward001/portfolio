import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => (
  <article className={cn('rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm', className)}>{children}</article>
);
