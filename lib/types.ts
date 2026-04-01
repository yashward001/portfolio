import { z } from 'zod';

export const socialSchema = z.object({
  label: z.string(),
  href: z.string().url()
});

export const profileSchema = z.object({
  name: z.string().min(2),
  headline: z.string().min(8),
  valueProp: z.string().min(10),
  location: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  resumeUrl: z.string(),
  github: z.string().url(),
  linkedin: z.string().url(),
  stats: z.array(z.object({ label: z.string(), value: z.string() })),
  skills: z.array(z.string()),
  skillGroups: z
    .array(z.object({ category: z.string(), items: z.array(z.string()) }))
    .optional(),
  interests: z.array(z.string()),
  timeline: z.array(
    z.object({
      title: z.string(),
      org: z.string(),
      start: z.string(),
      end: z.string(),
      detail: z.string()
    })
  ),
  socials: z.array(socialSchema)
});

export const projectFrontmatterSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(12),
  role: z.string(),
  date: z.string(),
  tags: z.array(z.string()).min(1),
  stack: z.array(z.string()).min(1),
  impactMetric: z.string().min(4),
  featured: z.boolean().default(false),
  cover: z.string(),
  links: z.object({
    repo: z.string().url().optional(),
    live: z.string().url().optional(),
    demo: z.string().url().optional()
  }),
  sortImpact: z.number().int().min(1).max(100)
});

export const postFrontmatterSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().min(12),
  publishedAt: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false)
});

export type Profile = z.infer<typeof profileSchema>;
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type Project = ProjectFrontmatter & {
  content: string;
  readingMinutes: number;
};

export type Post = PostFrontmatter & {
  content: string;
  readingMinutes: number;
};
