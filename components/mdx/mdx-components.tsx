import type { MDXComponents } from 'mdx/types';

import { ArchitectureDiagram } from '@/components/mdx/architecture-diagram';

export const mdxComponents: MDXComponents = {
  ArchitectureDiagram,
  h2: (props) => <h2 className="mt-10 scroll-mt-20 text-2xl font-semibold" {...props} />,
  h3: (props) => <h3 className="mt-8 text-xl font-semibold" {...props} />,
  p: (props) => <p className="leading-7 text-muted" {...props} />,
  li: (props) => <li className="my-1 text-muted" {...props} />,
  a: (props) => <a className="text-accent underline-offset-4 hover:underline" {...props} />
};
