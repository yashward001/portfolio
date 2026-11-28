'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Lock, Mic, RotateCw, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { EASE, Fig, useTimeline } from '../kit';

/* ─── 1. The state machine, walked by one example session ───────────────── */

const STATES = [
  'idle',
  'listening',
  'transcribing',
  'planning',
  'awaiting_approval',
  'executing',
  'step_success',
  'step_failed',
  'retrying',
  'completed',
  'error'
] as const;
type State = (typeof STATES)[number];

const EVENTS = [
  'START_VOICE',
  'TRANSCRIPT_READY',
  'PLAN_READY',
  'USER_APPROVED',
  'STEP_DONE',
  'STEP_FAILED',
  'RETRY',
  'ABORT',
  'RESET'
];

const WALK: { state: State; event?: string; note: string }[] = [
  { state: 'idle', note: 'Waiting for the user.' },
  { state: 'listening', event: 'START_VOICE', note: 'Mic audio streams to Gemini Live.' },
  { state: 'transcribing', note: 'Intent is extracted from speech.' },
  { state: 'planning', event: 'TRANSCRIPT_READY', note: 'Gemini picks capabilities from the registry.' },
  { state: 'awaiting_approval', event: 'PLAN_READY', note: 'A high-risk step pauses for a human.' },
  { state: 'executing', event: 'USER_APPROVED', note: 'Playwright runs step 1.' },
  { state: 'step_success', event: 'STEP_DONE', note: 'Screenshot evidence captured.' },
  { state: 'executing', note: 'Step 2 starts.' },
  { state: 'step_failed', event: 'STEP_FAILED', note: 'The selector didn’t resolve in time.' },
  { state: 'retrying', event: 'RETRY', note: 'Retry logic kicks in.' },
  { state: 'executing', note: 'Step 2 again.' },
  { state: 'step_success', event: 'STEP_DONE', note: 'Evidence captured.' },
  { state: 'completed', note: 'Full transcript streamed to the UI.' }
];
const WALK_T = WALK.map((_, i) => i * 1.15);

export const AtlasStateMachine = () => {
  const { ref, step, ok } = useTimeline(WALK_T, WALK_T[WALK_T.length - 1]! + 3);
  const cur = WALK[Math.max(0, step)]!;
  const fired = WALK.slice(0, step + 1).filter((w) => w.event);

  return (
    <Fig
      title="11 states, 9 events, no undefined transitions"
      note="One example session. The highlighted state is where the UI is; every interaction phase is an explicit node."
    >
      <div ref={ref} className="p-5 sm:p-6">
        <ul className="flex flex-wrap gap-2">
          {STATES.map((s) => {
            const active = step >= 0 && cur.state === s;
            const visited = WALK.slice(0, step + 1).some((w) => w.state === s);
            return (
              <li
                key={s}
                className={cn(
                  'relative rounded-full px-3 py-1.5 font-mono text-[12.5px] transition-colors duration-300',
                  active ? 'text-white' : visited ? 'text-fg' : 'text-subtle',
                  s === 'error' && !active && 'text-subtle/70'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="atlas-state"
                    className={cn(
                      'absolute inset-0 rounded-full',
                      s === 'step_failed' || s === 'retrying' ? 'bg-accent' : 'bg-fg'
                    )}
                    transition={ok ? { type: 'spring', stiffness: 380, damping: 32 } : { duration: 0 }}
                  />
                )}
                {!active && (
                  <span
                    className={cn(
                      'absolute inset-0 rounded-full border',
                      visited ? 'border-fg/25 bg-bg' : 'border-border'
                    )}
                  />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                  {s === 'awaiting_approval' && <Lock className="h-3 w-3" aria-hidden />}
                  {s === 'listening' && <Mic className="h-3 w-3" aria-hidden />}
                  {s === 'retrying' && <RotateCw className="h-3 w-3" aria-hidden />}
                  {s}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1.2fr_1fr]">
          <div className="min-h-[92px] rounded-2xl bg-bg p-4" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={ok ? { opacity: 0, y: 6 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                <p className="font-mono text-xs text-accent">
                  {cur.event ? `${cur.event} →` : '→'} {cur.state}
                </p>
                <p className="mt-1.5 text-[15px] leading-snug">{cur.note}</p>
                {cur.state === 'awaiting_approval' && (
                  <motion.span
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-fg px-3 py-1 text-xs font-medium text-white"
                    initial={ok ? { scale: 1 } : false}
                    animate={ok ? { scale: [1, 1, 0.92, 1] } : undefined}
                    transition={{ duration: 1, times: [0, 0.6, 0.75, 1] }}
                  >
                    <Check className="h-3 w-3" /> Approve
                  </motion.span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div>
            <p className="text-xs text-subtle">Events fired</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {EVENTS.map((e) => {
                const n = fired.filter((f) => f.event === e).length;
                return (
                  <li
                    key={e}
                    className={cn(
                      'rounded-md border px-1.5 py-0.5 font-mono text-[11px] transition-colors duration-300',
                      n ? 'border-accent/40 bg-accent/10 text-fg' : 'border-border text-subtle'
                    )}
                  >
                    {e}
                    {n > 1 && <span className="ml-1 text-accent">×{n}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </Fig>
  );
};

/* ─── 2. The planner can only choose; it can't write code ─────────────── */

type App = 'Gmail' | 'Slack' | 'Spotify' | 'Notion' | 'Outlook' | 'Google Docs';
const REGISTRY: { id: string; app: App }[] = [
  { id: 'gmail.search', app: 'Gmail' },
  { id: 'gmail.open_message', app: 'Gmail' },
  { id: 'gmail.compose', app: 'Gmail' },
  { id: 'slack.open_channel', app: 'Slack' },
  { id: 'slack.post_message', app: 'Slack' },
  { id: 'spotify.play', app: 'Spotify' },
  { id: 'notion.create_page', app: 'Notion' },
  { id: 'notion.search', app: 'Notion' },
  { id: 'outlook.new_event', app: 'Outlook' },
  { id: 'outlook.reply', app: 'Outlook' },
  { id: 'docs.open', app: 'Google Docs' },
  { id: 'docs.share', app: 'Google Docs' }
];
const PLAN = [
  { id: 'gmail.search', params: '{ query: "invoice" }', risk: 'low' },
  { id: 'gmail.open_message', params: '{ index: 0 }', risk: 'low' },
  { id: 'slack.post_message', params: '{ channel: "#finance" }', risk: 'medium' }
];
const UTTERANCE = 'Find the latest invoice in Gmail and post it to #finance on Slack';
const PLAN_T = [0, 1.6, 2.6, 3.3, 4.0, 5.0];

export const AtlasPlanner = () => {
  const { ref, step, ok } = useTimeline(PLAN_T, 9.5);
  const picked = PLAN.slice(0, Math.max(0, step - 1)).map((p) => p.id);

  return (
    <Fig
      title="The model selects capability IDs. It never writes Playwright code."
      note="The registry is passed to Gemini 2.5 Flash as tools, so the plan is a typed list of pre-approved actions with parameters filled in."
      illustrative="Example plan"
    >
      <div ref={ref} className="grid gap-5 p-5 sm:p-6 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 text-xs text-subtle">
            <Mic className="h-3.5 w-3.5" /> Voice command
          </p>
          <p className="mt-2 min-h-[3.2em] text-[15px] leading-snug">
            {ok ? (
              <Typed text={UTTERANCE} show={step >= 0} />
            ) : (
              <>“{UTTERANCE}”</>
            )}
          </p>

          <p className="mt-5 text-xs text-subtle">Capability registry (Firestore)</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {REGISTRY.map((c) => {
              const on = picked.includes(c.id);
              return (
                <li
                  key={c.id}
                  className={cn(
                    'rounded-md border px-1.5 py-0.5 font-mono text-[11px] transition-all duration-500',
                    on
                      ? 'border-accent bg-accent text-white'
                      : step >= 1
                        ? 'border-border text-subtle/60'
                        : 'border-border text-muted'
                  )}
                >
                  {c.id}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl bg-bg p-4">
          <p className="text-xs text-subtle">Execution plan returned by the model</p>
          <ol className="mt-3 space-y-2">
            {PLAN.map((p, i) => (
              <motion.li
                key={p.id}
                initial={false}
                animate={{ opacity: step >= i + 2 ? 1 : 0, x: step >= i + 2 ? 0 : 16 }}
                transition={{ duration: ok ? 0.45 : 0, ease: EASE }}
                className="rounded-xl border border-border bg-card px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[12px] font-medium">
                    {i + 1}. {p.id}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px]',
                      p.risk === 'medium' ? 'bg-accent/15 text-accent' : 'bg-bg text-subtle'
                    )}
                  >
                    {p.risk === 'medium' && <Lock className="h-2.5 w-2.5" />}
                    risk: {p.risk}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-muted">{p.params}</p>
              </motion.li>
            ))}
          </ol>
          <motion.div
            initial={false}
            animate={{ opacity: step >= 5 ? 1 : 0 }}
            transition={{ duration: ok ? 0.4 : 0 }}
            className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-fg/20 px-3 py-2 font-mono text-[11px] text-subtle"
          >
            <X className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="min-w-0 truncate line-through">page.click(&quot;div &gt; span:nth-child(3)&quot;)</span>
            <span className="ml-auto shrink-0 font-sans text-[11px] text-accent">not allowed</span>
          </motion.div>
        </div>
      </div>
    </Fig>
  );
};

const Typed = ({ text, show }: { text: string; show: boolean }) => (
  <span aria-label={text}>
    “
    {text.split('').map((ch, i) => (
      <motion.span
        key={i}
        aria-hidden
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.01, delay: show ? i * 0.022 : 0 }}
      >
        {ch}
      </motion.span>
    ))}
    ”
  </span>
);

/* ─── 3. Every step leaves evidence ──────────────────────────────────── */

const STEPS = [
  { label: 'gmail.search', box: { x: 22, y: 9, w: 56, h: 11 } },
  { label: 'gmail.open_message', box: { x: 4, y: 26, w: 92, h: 15 } },
  { label: 'slack.post_message', box: { x: 70, y: 82, w: 25, h: 11 }, retry: true }
];
const EVID_T = [0, 1.4, 2.8, 4.0, 5.2, 6.4];
// step index → per-step status
const statusAt = (t: number, i: number): 'pending' | 'running' | 'success' | 'failed' | 'retrying' => {
  const plan: Record<number, ('pending' | 'running' | 'success' | 'failed' | 'retrying')[]> = {
    0: ['running', 'success', 'success', 'success', 'success', 'success'],
    1: ['pending', 'running', 'success', 'success', 'success', 'success'],
    2: ['pending', 'pending', 'running', 'failed', 'retrying', 'success']
  };
  return t < 0 ? 'pending' : plan[i]![t]!;
};
const focusAt = [0, 1, 2, 2, 2, 2];

export const AtlasEvidence = () => {
  const { ref, step, ok } = useTimeline(EVID_T, 9);
  const focus = step >= 0 ? STEPS[focusAt[step]!]! : null;

  return (
    <Fig
      title="Per-step screenshots with bounding boxes, streamed over WebSocket"
      note="Each step reports pending / running / success / failed / retrying live, and the run is auditable after the fact."
      illustrative
    >
      <div ref={ref} className="grid gap-5 p-5 sm:grid-cols-[1.3fr_1fr] sm:p-6">
        {/* mock app window */}
        <div className="overflow-hidden rounded-2xl border border-border bg-bg">
          <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-fg/15" />
            <span className="h-2 w-2 rounded-full bg-fg/15" />
            <span className="h-2 w-2 rounded-full bg-fg/15" />
            <span className="ml-2 text-[11px] text-subtle">
              {focus?.label.startsWith('slack') ? 'Slack' : 'Gmail'}
            </span>
          </div>
          <div className="relative aspect-[16/10]">
            {/* wireframe content */}
            <div className="absolute left-[22%] top-[9%] h-[11%] w-[56%] rounded-full bg-card" />
            {[26, 44, 58, 72].map((y, i) => (
              <div
                key={y}
                className="absolute left-[4%] right-[4%] rounded-lg bg-card"
                style={{ top: `${y}%`, height: i === 0 ? '15%' : '10%' }}
              />
            ))}
            <div className="absolute bottom-[7%] right-[5%] h-[11%] w-[25%] rounded-full bg-fg/80" />
            {focus && (
              <motion.div
                className="absolute rounded-lg border-2 border-accent bg-accent/10"
                initial={false}
                animate={{
                  left: `${focus.box.x}%`,
                  top: `${focus.box.y}%`,
                  width: `${focus.box.w}%`,
                  height: `${focus.box.h}%`
                }}
                transition={ok ? { type: 'spring', stiffness: 200, damping: 24 } : { duration: 0 }}
              >
                <span
                  className={cn(
                    'absolute -top-5 whitespace-nowrap rounded bg-accent px-1.5 font-mono text-[10px] text-white',
                    focus.box.x > 50 ? 'right-0' : 'left-0'
                  )}
                >
                  {focus.label}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <ol className="space-y-2 self-center">
          {STEPS.map((s, i) => {
            const st = statusAt(step, i);
            return (
              <li key={s.label} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
                <StatusIcon status={st} />
                <span className="min-w-0 flex-1 truncate font-mono text-[12px]">{s.label}</span>
                <span
                  className={cn(
                    'text-[11px]',
                    st === 'success' && 'text-success',
                    (st === 'failed' || st === 'retrying') && 'text-accent',
                    (st === 'pending' || st === 'running') && 'text-subtle'
                  )}
                >
                  {st}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Fig>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'success')
    return (
      <span className="grid h-5 w-5 place-items-center rounded-full bg-success text-white">
        <Check className="h-3 w-3" />
      </span>
    );
  if (status === 'failed')
    return (
      <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-white">
        <X className="h-3 w-3" />
      </span>
    );
  if (status === 'running' || status === 'retrying')
    return (
      <span className="relative grid h-5 w-5 place-items-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-fg/15 border-t-accent" />
      </span>
    );
  return <span className="h-5 w-5 rounded-full border-2 border-border" />;
};

/* ─── 4. A capability, as stored ────────────────────────────────────── */

const DOC: [string, string, 'str' | 'num' | 'raw'][] = [
  ['action_type', '"click"', 'str'],
  ['selector', '"#submit-btn"', 'str'],
  ['description', '"Submit the form"', 'str'],
  ['parameters', '{ target: string }', 'raw'],
  ['preconditions', '["form.is_valid"]', 'raw'],
  ['postconditions', '["toast.visible"]', 'raw'],
  ['risk_level', '"medium"', 'str'],
  ['confidence_score', '0.94', 'num'],
  ['auto_heal_history', '[]', 'raw']
];

export const AtlasCapabilityDoc = () => {
  const { ref, step, ok } = useTimeline(
    DOC.map((_, i) => 0.2 + i * 0.22),
    12
  );
  return (
    <Fig
      title="A capability document in the registry"
      note="Selectors and risk live in Firestore, not in the prompt: update one without touching the inference layer. Risk is declared when the capability is authored, not decided by the model."
      illustrative="Example document"
    >
      <div ref={ref} className="bg-fg p-5 font-mono text-[12.5px] leading-7 text-white/85 sm:p-6">
        <p className="text-white/40">{'// capabilities/{id}'}</p>
        <p>{'{'}</p>
        {DOC.map(([k, v, kind], i) => (
          <motion.p
            key={k}
            className="pl-5"
            initial={false}
            animate={{ opacity: step >= i ? 1 : 0.08, x: step >= i ? 0 : -6 }}
            transition={{ duration: ok ? 0.3 : 0 }}
          >
            <span className="text-white/50">{k}</span>
            <span className="text-white/40">: </span>
            <span
              className={cn(
                kind === 'str' && 'text-[#ffb27a]',
                kind === 'num' && 'text-[#8fd3ff]',
                kind === 'raw' && 'text-white/80',
                k === 'risk_level' && 'rounded bg-accent/30 px-1'
              )}
            >
              {v}
            </span>
            {i < DOC.length - 1 && <span className="text-white/40">,</span>}
          </motion.p>
        ))}
        <p>{'}'}</p>
      </div>
    </Fig>
  );
};
