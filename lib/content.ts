import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

import type { Post, Project } from '@/lib/types';
import { postFrontmatterSchema, projectFrontmatterSchema } from '@/lib/types';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

const estimateReadingTime = (input: string) => {
  const words = input.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
};

const readDirectory = (directory: string) => {
  const target = path.join(CONTENT_ROOT, directory);
  if (!fs.existsSync(target)) return [];
  return fs.readdirSync(target).filter((file) => file.endsWith('.mdx'));
};

const parseCollection = <T extends z.ZodSchema>(
  directory: 'projects' | 'posts',
  schema: T
): Array<z.infer<T> & { content: string; readingMinutes: number }> => {
  const files = readDirectory(directory);

  return files.map((file) => {
    const fullPath = path.join(CONTENT_ROOT, directory, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);

    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      throw new Error(
        `Invalid frontmatter in ${directory}/${file}: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`
      );
    }

    return {
      ...parsed.data,
      content,
      readingMinutes: estimateReadingTime(content)
    };
  });
};

export const getProjects = () => {
  return parseCollection('projects', projectFrontmatterSchema)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((project) => project as Project);
};

export const getFeaturedProjects = () => getProjects().filter((project) => project.featured).slice(0, 3);

export const getProjectBySlug = (slug: string) => getProjects().find((project) => project.slug === slug);

export const getPosts = () => {
  return parseCollection('posts', postFrontmatterSchema)
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map((post) => post as Post);
};

export const getPostBySlug = (slug: string) => getPosts().find((post) => post.slug === slug);

export const validateContent = () => {
  getProjects();
  getPosts();
  return true;
};
