import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/button';

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
};

/* In the terminal theme we skip the magnetic physics — sharp buttons only */
export const MagneticButton = ({ href, children, variant = 'primary' }: MagneticButtonProps) => (
  <ButtonLink href={href} variant={variant}>
    {children}
  </ButtonLink>
);
