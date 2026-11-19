import type { MDXComponents } from 'mdx/types';

import { ArchitectureDiagram } from '@/components/mdx/architecture-diagram';

// Typography comes from the `.prose` rules in styles/globals.css.
export const mdxComponents: MDXComponents = {
  ArchitectureDiagram,
  h2: (props) => <h2 className="scroll-mt-24" {...props} />,
  a: ({ href, ...props }) => {
    const external = href?.startsWith('http');
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...props}
      />
    );
  }
};
