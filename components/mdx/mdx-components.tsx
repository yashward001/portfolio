import type { MDXComponents } from 'mdx/types';

import { ArchitectureDiagram } from '@/components/mdx/architecture-diagram';
import {
  AtlasCapabilityDoc,
  AtlasEvidence,
  AtlasPlanner,
  AtlasStateMachine
} from '@/components/mdx/projects/atlas';
import { LeakSafeWindows, ThresholdExplorer } from '@/components/mdx/projects/credit';
import { CropPlanner } from '@/components/mdx/projects/farmora';
import { PetRadar } from '@/components/mdx/projects/fetchmehome';
import { PrivacyBoundary } from '@/components/mdx/projects/internship';
import { InboxTriage } from '@/components/mdx/projects/loopai';
import { LstmUnroll, WalkForward } from '@/components/mdx/projects/lstm';
import { OrderBookReplay } from '@/components/mdx/projects/nanoexchange';
import { GreeksLab } from '@/components/mdx/projects/options';
import { DagRun } from '@/components/mdx/projects/pipeline';
import { RagPipeline } from '@/components/mdx/projects/rag';
import { RegimeTape } from '@/components/mdx/projects/regime';
import { TwoPhoneSync } from '@/components/mdx/projects/softlaunch';
import { DqnLoop, StraddlePayoff } from '@/components/mdx/projects/straddle';
import { SweeRouter } from '@/components/mdx/projects/swee';
import { PointAddition } from '@/components/mdx/quantum/point-addition';
import {
  MechanismSplit,
  ProtocolRace
} from '@/components/mdx/quantum/protocol-race';
import { SpacetimeShrink } from '@/components/mdx/quantum/spacetime-shrink';
import {
  CreditRail,
  FetchRail,
  InternRail,
  LoopRail,
  LstmRail,
  NanoRail,
  OptionsRail,
  RegimeRail,
  StraddleRail,
  SweeRail
} from '@/components/mdx/rails';

// Typography comes from the `.prose` rules in styles/globals.css.
export const mdxComponents: MDXComponents = {
  ArchitectureDiagram,
  CreditRail,
  FetchRail,
  InternRail,
  LoopRail,
  LstmRail,
  NanoRail,
  OptionsRail,
  RegimeRail,
  StraddleRail,
  SweeRail,
  // Shrinking Shor
  PointAddition,
  SpacetimeShrink,
  ProtocolRace,
  MechanismSplit,
  // per-project figures
  AtlasStateMachine,
  AtlasPlanner,
  AtlasEvidence,
  AtlasCapabilityDoc,
  OrderBookReplay,
  SweeRouter,
  StraddlePayoff,
  DqnLoop,
  InboxTriage,
  LeakSafeWindows,
  ThresholdExplorer,
  RagPipeline,
  PetRadar,
  PrivacyBoundary,
  RegimeTape,
  GreeksLab,
  DagRun,
  WalkForward,
  LstmUnroll,
  CropPlanner,
  TwoPhoneSync,
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
