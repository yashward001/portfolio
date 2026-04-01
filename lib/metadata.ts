import type { Metadata } from 'next';

const site = {
  name: 'Yashwardhan Singh Tomar | Portfolio',
  title: 'Yashwardhan Singh Tomar | Computer Science Portfolio',
  description:
    'Portfolio of Yashwardhan Singh Tomar, a Computer Science student focused on AI systems, product engineering, and high-impact software.',
  url: 'https://example-portfolio.vercel.app'
};

export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: '%s | Yashwardhan'
  },
  description: site.description,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: site.title,
    description: site.description,
    type: 'website',
    url: site.url,
    images: [{ url: '/api/og?title=Yash%20Patel', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: ['/api/og?title=Yash%20Patel']
  },
  robots: {
    index: true,
    follow: true
  }
};

export const siteConfig = site;
