import type { Metadata } from 'next';
import { Clock3 } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from '@/components/mdx/mdx-components';
import { getPostBySlug, getPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export const generateStaticParams = async () => getPosts().map((post) => ({ slug: post.slug }));

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [{ url: `/api/og?title=${encodeURIComponent(post.title)}` }]
    }
  };
};

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-3">
        <h1 className="font-display text-4xl tracking-tight">{post.title}</h1>
        <p className="text-muted">{post.excerpt}</p>
        <div className="inline-flex items-center gap-2 text-sm text-muted">
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4" /> {post.readingMinutes} min read
          </span>
        </div>
      </header>

      <div className="prose">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight]
            }
          }}
        />
      </div>
    </article>
  );
}
