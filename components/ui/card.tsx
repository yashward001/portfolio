import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => (
  <article
    className={cn(
      'border border-[#003d0f] bg-[#0a0f0a] p-5 transition-all duration-200 hover:border-[#00ff41] hover:shadow-[0_0_18px_rgba(0,255,65,0.15)]',
      className
    )}
  >
    {children}
  </article>
);
