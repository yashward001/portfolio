import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

/** A project's repo link, or undefined when it only points at a GitHub profile (no specific repository). */
export const repoUrl = (repo?: string) => {
  if (!repo) return undefined;
  const path = repo
    .replace(/^https?:\/\/github\.com\/?/i, '')
    .replace(/\/+$/, '');
  return path.includes('/') ? repo : undefined;
};
