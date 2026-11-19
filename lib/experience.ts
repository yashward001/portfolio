import type { Profile } from '@/lib/types';

type TimelineEntry = Profile['timeline'][number];

/** "Solution Architect Intern, Information Technology Division" → "Solution Architect Intern" */
export const shortTitle = (entry: TimelineEntry) =>
  entry.title.split(/,| · /)[0].trim();

/** "Singapore Business Federation (SBF)" → "SBF"; "Gigin.ai" → "Gigin.ai" */
export const shortOrg = (entry: TimelineEntry) =>
  entry.org.match(/\(([^)]+)\)/)?.[1] ?? entry.org;

/** "On-site, Bengaluru, India" → "Bengaluru"; "Part-time, Singapore" → "Singapore" */
export const city = (entry: TimelineEntry) =>
  entry.location
    .split(',')
    .map((part) => part.trim())
    .filter(
      (part) => !/^(on-?site|remote|hybrid|part-?time|full-?time)$/i.test(part)
    )[0] ?? entry.location;

/** "Aug 2026" + "Oct 2026" → "2026"; "Aug 2023" + "Aug 2027" → "2023–2027" */
export const yearRange = (entry: TimelineEntry) => {
  const a = entry.start.split(' ').pop();
  const b = entry.end.split(' ').pop();
  return a === b ? a : `${a}–${b}`;
};
