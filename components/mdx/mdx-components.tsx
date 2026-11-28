import type { MDXComponents } from 'mdx/types';

import { ArchitectureDiagram } from '@/components/mdx/architecture-diagram';
import { PointAddition } from '@/components/mdx/quantum/point-addition';
import {
  MechanismSplit,
  ProtocolRace
} from '@/components/mdx/quantum/protocol-race';
import { SpacetimeShrink } from '@/components/mdx/quantum/spacetime-shrink';

// Typography comes from the `.prose` rules in styles/globals.css.
export const mdxComponents: MDXComponents = {
  ArchitectureDiagram,
  PointAddition,
  SpacetimeShrink,
  ProtocolRace,
  MechanismSplit,
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
