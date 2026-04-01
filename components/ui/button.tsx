import Link from 'next/link';
import type { Route } from 'next';
import { cva, type VariantProps } from 'class-variance-authority';
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const buttonStyles = cva(
  'focus-ring inline-flex items-center justify-center rounded-xl border text-sm font-medium transition duration-200 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'border-accent/70 bg-accent px-4 py-2 text-slate-950 shadow-[0_0_30px_-14px_hsl(var(--accent))] hover:-translate-y-0.5 hover:bg-accent/90',
        secondary: 'border-border bg-card/80 px-4 py-2 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent',
        ghost: 'border-transparent px-3 py-2 hover:bg-accent/10 hover:text-accent'
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

export const ButtonLink = ({ className, variant, href, ...props }: LinkProps) => (
  href.startsWith('/') ? (
    <Link className={cn(buttonStyles({ variant }), className)} href={href as Route} {...props} />
  ) : (
    <a className={cn(buttonStyles({ variant }), className)} href={href} {...props} />
  )
);
