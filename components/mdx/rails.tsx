'use client';

import { FlowRail } from './flow-rail';

/* Named pipelines for MDX (MDX can't pass arrays as props here, so each one is baked in). */

export const NanoRail = () => (
  <FlowRail
    title="One path through the engine, end to end"
    nodes={[
      { label: 'Command', sub: 'New / Cancel / Modify, fixed-width' },
      { label: 'Matching engine', sub: 'price-time priority' },
      { label: 'Events', sub: 'Ack / Reject / Fill / Cancelled / Modified' },
      { label: 'Binary log', sub: 'NXLG header, NXTL trailer' },
      { label: 'Replay', sub: 'same log, fresh engine' },
      { label: 'State hash', sub: '64-bit, canonical order' }
    ]}
  />
);

export const StraddleRail = () => (
  <FlowRail
    title="Research-to-deployment pipeline"
    nodes={[
      { label: 'Data layer', sub: 'market + sentiment, aligned timestamps' },
      { label: 'Feature layer', sub: 'rolling windows + sequence embeddings' },
      { label: 'Policy layer', sub: 'DQN, risk-adjusted actions' },
      { label: 'Evaluation', sub: 'out-of-sample backtests, stress checks' }
    ]}
  />
);

export const LoopRail = () => (
  <FlowRail
    title="Request flow"
    nodes={[
      { label: 'Gmail OAuth', sub: 'scoped permissions' },
      { label: 'Sync jobs', sub: 'FastAPI' },
      { label: 'Classify', sub: 'rules first, LLM fallback' },
      { label: 'Summarise', sub: 'cached in PostgreSQL' },
      { label: 'Dashboard', sub: 'React, category-first' }
    ]}
  />
);

export const SweeRail = () => (
  <FlowRail
    title="System layers"
    nodes={[
      { label: 'Next.js UI', sub: 'tasks + streamed responses' },
      { label: 'FastAPI', sub: 'orchestration + routing' },
      { label: 'FAISS', sub: 'code + docs embeddings' },
      { label: 'Agents', sub: 'role-specific prompts' },
      { label: 'Validation', sub: 'format + quality checks' }
    ]}
  />
);

export const CreditRail = () => (
  <FlowRail
    title="Modelling pipeline"
    nodes={[
      { label: 'Leak-safe windows', sub: 'features end at the snapshot' },
      { label: 'Temporal aggregates', sub: 'per-borrower history' },
      { label: 'LightGBM', sub: 'class-imbalance handling' },
      { label: 'Calibration', sub: 'ranking metrics + thresholds' },
      { label: 'Importance', sub: 'explainability for risk teams' }
    ]}
  />
);

export const FetchRail = () => (
  <FlowRail
    title="MERN architecture"
    nodes={[
      { label: 'React', sub: 'protected routes, profile dashboards' },
      { label: 'Express / Node API', sub: 'listings, messaging metadata, auth' },
      { label: 'MongoDB', sub: 'schema tuned for geo + status filters' }
    ]}
  />
);

export const RegimeRail = () => (
  <FlowRail
    title="Research workflow"
    nodes={[
      { label: 'Data prep', sub: 'aligned returns + volatility windows' },
      { label: 'Rolling features', sub: 'computed from the past only' },
      { label: 'Regime classifier', sub: 'temporal validation' },
      { label: 'Volatility forecast', sub: 'out-of-sample evaluation' }
    ]}
  />
);

export const OptionsRail = () => (
  <FlowRail
    title="Engine modules"
    nodes={[
      { label: 'Pricing core', sub: 'vectorised Black–Scholes' },
      { label: 'Risk module', sub: 'Greeks + sensitivity grids' },
      { label: 'Cross-checks', sub: 'finite differences' },
      { label: 'Reports', sub: 'scenario outputs + diagnostics' }
    ]}
  />
);

export const LstmRail = () => (
  <FlowRail
    title="Experiment pipeline"
    nodes={[
      { label: 'Feature prep', sub: 'lagged, normalised series' },
      { label: 'LSTM training', sub: 'early stopping' },
      { label: 'Windowed validation', sub: 'no look-ahead' },
      { label: 'Evaluation', sub: 'directional accuracy + errors' }
    ]}
  />
);

export const InternRail = () => (
  <FlowRail
    title="Where each piece runs"
    nodes={[
      { label: 'MV3 extension', sub: 'captures fields on supported pages' },
      { label: 'On-device model', sub: 'WebGPU, WASM fallback' },
      { label: 'Supabase', sub: 'normalised records only' },
      { label: 'Next.js dashboard', sub: 'timeline, status board, reminders' }
    ]}
  />
);
