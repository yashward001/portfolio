import Link from 'next/link';
import type { Route } from 'next';
import { cva, type VariantProps } from 'class-variance-authority';
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const buttonStyles = cva(
  'focus-ring inline-flex items-center justify-center border font-mono text-sm uppercase tracking-widest transition-all duration-150 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'border-[#00ff41] bg-transparent px-5 py-2.5 text-[#00ff41] hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.35)]',
        secondary:
          'border-[#003d0f] bg-transparent px-5 py-2.5 text-[#006622] hover:border-[#00ff41] hover:text-[#00ff41]',
        ghost:
          'border-transparent px-3 py-2 text-[#006622] hover:text-[#00ff41]'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

type SharedProps = VariantProps<typeof buttonStyles> & { className?: string };
type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const Button = ({ className, variant, ...props }: ButtonProps) => (
  <button className={cn(buttonStyles({ variant }), className)} {...props} />
);

export const ButtonLink = ({ className, variant, href, ...props }: LinkProps) =>
  href.startsWith('/') ? (
    <Link className={cn(buttonStyles({ variant }), className)} href={href as Route} {...props} />
  ) : (
    <a className={cn(buttonStyles({ variant }), className)} href={href} {...props} />
  );
