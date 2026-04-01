import type { Metadata } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/section-title';
import { getPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Engineering notes on systems, product, and career growth.',
  openGraph: {
    images: [{ url: '/api/og?title=Blog' }]
  }
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="space-y-8">
      <SectionTitle overline="Blog" title="Engineering Notes" description="MDX posts with implementation details and lessons learned." />
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.slug} className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl">
                <Link href={`/blog/${post.slug}`} className="focus-ring rounded hover:text-accent">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-muted">{formatDate(post.publishedAt)}</p>
            </div>
            <p className="text-sm text-muted">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
