'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Database, Mic, MousePointer2, Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { useMotionOk } from '../kit';

/* ATLAS, end to end, as one camera-driven motion piece. Everything is a pure function of the
   clock `t`, so scrubbing, chapter jumps and reduced motion all render the same frames. */

/* ─── clock helpers ─────────────────────────────────────────────────── */

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const win = (t: number, a: number, b: number, fade = 0.3) =>
  Math.min(seg(t, a, a + fade), 1 - seg(t, b - fade, b));

type Pt = [number, number];
/** Eased interpolation through timed waypoints [t, x, y]. */
const track = (t: number, keys: [number, number, number][]): Pt => {
  if (t <= keys[0]![0]) return [keys[0]![1], keys[0]![2]];
  for (let i = 1; i < keys.length; i++) {
    const [t1, x1, y1] = keys[i]!;
    const [t0, x0, y0] = keys[i - 1]!;
    if (t <= t1) {
      const u = ease(seg(t, t0, t1));
      return [lerp(x0, x1, u), lerp(y0, y1, u)];
    }
  }
  const last = keys[keys.length - 1]!;
  return [last[1], last[2]];
};
const quad = (p0: Pt, p1: Pt, p2: Pt, u: number): Pt => [
  (1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0],
  (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]
];
const cubic = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, u: number): Pt => {
  const v = 1 - u;
  return [
    v ** 3 * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u ** 3 * p3[0],
    v ** 3 * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u ** 3 * p3[1]
  ];
};
/** Point at fraction u along a polyline, by arc length. */
const along = (pts: Pt[], u: number): Pt => {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i]![0], p[1] - pts[i]![1]));
  let d = u * lens.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]!) {
      const k = lens[i] ? d / lens[i]! : 0;
      return [lerp(pts[i]![0], pts[i + 1]![0], k), lerp(pts[i]![1], pts[i + 1]![1], k)];
    }
    d -= lens[i]!;
  }
  return pts[pts.length - 1]!;
};

/* ─── script ────────────────────────────────────────────────────────── */

const CHAPTERS = [
  {
    label: 'System',
    from: 0,
    to: 3,
    title: 'Five parts, one loop',
    body: 'Voice in, a plan from Gemini, a human gate, Playwright doing the clicking, and a live feed back to the UI. Here’s one request travelling through all of it, slowed down.'
  },
  {
    label: 'Voice',
    from: 3,
    to: 9,
    title: 'Speak, and the audio streams straight to Gemini',
    body: 'Microphone audio goes directly to the Gemini Live API for transcription and intent extraction. There’s no separate speech-to-text hop in between, which cuts the wait before planning starts.'
  },
  {
    label: 'Plan',
    from: 9,
    to: 16,
    title: 'The registry becomes the model’s only vocabulary',
    body: 'Every capability in the Firestore registry is handed to Gemini 2.5 Flash as a tool. It answers with an ordered list of capability IDs and filled parameters. It can choose actions; it can’t write code.'
  },
  {
    label: 'Approve',
    from: 16,
    to: 21,
    title: 'Risky plans stop at the gate',
    body: 'Each capability carries a risk level set when it was authored, not decided by the model at runtime. This plan includes a medium-risk step, so it waits until a human approves.'
  },
  {
    label: 'Execute',
    from: 21,
    to: 31,
    title: 'Playwright runs each step and keeps the evidence',
    body: 'Every capability ID resolves to a typed action. Each step captures a bounding-box screenshot. When step 3 can’t find its target in time, retry logic kicks in instead of the run failing.'
  },
  {
    label: 'Stream',
    from: 31,
    to: 36,
    title: 'Every status change is pushed live to the UI',
    body: 'A WebSocket bridge streams each update to the frontend, where the 11-state machine moves in lockstep and the screenshots land in the run transcript.'
  },
  {
    label: 'Whole loop',
    from: 36,
    to: 42,
    title: 'Voice to executed workflow in under five seconds',
    body: 'Across 6 apps and roughly 50 capabilities. The film above is slowed down so you can see each stage; the real loop runs in under five seconds.'
  }
];
const TOTAL = CHAPTERS[CHAPTERS.length - 1]!.to;

type Box = [number, number, number, number];
const FULL: Box = [0, 0, 1600, 900];
const CAMERA: { at: number; box: Box }[] = [
  { at: 0, box: FULL },
  { at: 3, box: [20, 0, 900, 506] },
  { at: 9, box: [150, 90, 1180, 664] },
  { at: 16, box: [520, 170, 860, 484] },
  { at: 21, box: [850, 306, 782, 440] },
  { at: 31, box: [400, 280, 1140, 641] },
  { at: 33.2, box: [30, 440, 860, 484] },
  { at: 36, box: FULL }
];
const camera = (t: number): Box => {
  let i = 0;
  while (i + 1 < CAMERA.length && CAMERA[i + 1]!.at <= t) i++;
  const cur = CAMERA[i]!;
  const prev = CAMERA[Math.max(0, i - 1)]!.box;
  const u = i === 0 ? 1 : ease(seg(t, cur.at, cur.at + 1.4));
  return cur.box.map((v, k) => lerp(prev[k]!, v, u)) as Box;
};

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
];
const STATE_T: [number, string][] = [
  [0, 'idle'],
  [3.6, 'listening'],
  [6.2, 'transcribing'],
  [9.2, 'planning'],
  [15.6, 'awaiting_approval'],
  [19.4, 'executing'],
  [23.4, 'step_success'],
  [23.9, 'executing'],
  [25.9, 'step_success'],
  [26.4, 'executing'],
  [27.6, 'step_failed'],
  [28.2, 'retrying'],
  [29.0, 'executing'],
  [30.0, 'step_success'],
  [31.6, 'completed']
];
const stateAt = (t: number) => STATE_T.filter(([s]) => s <= t).pop()![1];
// execution states are reported by the executor and arrive ~1.1s later over the socket
const PACKETS = STATE_T.filter(([s]) => s >= 19.4).map(([s, name]) => ({ start: s - 1.1, name }));
const PACKET_COLOR: Record<string, string> = {
  executing: 'hsl(var(--fg))',
  step_success: 'hsl(var(--success))',
  step_failed: 'hsl(var(--accent))',
  retrying: 'hsl(var(--accent))',
  completed: 'hsl(var(--success))'
};

/* ─── geometry ──────────────────────────────────────────────────────── */

const ORB: Pt = [700, 235];
const AUDIO: [Pt, Pt, Pt] = [[425, 235], [530, 322], [636, 242]];
const WS: [Pt, Pt, Pt, Pt] = [[1556, 673], [1620, 880], [780, 890], [502, 762]];
const WS_D = `M${WS[0].join(',')} C${WS[1].join(',')} ${WS[2].join(',')} ${WS[3].join(',')}`;
const ROUTE: Pt[] = [
  [330, 235], [530, 290], ORB, [950, 222], [950, 420], [950, 480], [1128, 480], [1340, 480],
  [1556, 673], cubic(...WS, 0.33), cubic(...WS, 0.66), [502, 762], [300, 700]
];

const REGISTRY = [
  'gmail.search', 'gmail.open_message', 'gmail.compose', 'slack.open_channel',
  'slack.post_message', 'spotify.play', 'notion.create_page', 'notion.search',
  'outlook.new_event', 'outlook.reply', 'docs.open', 'docs.share'
];
const PLAN = [
  { id: 'gmail.search', params: 'query: "invoice"' },
  { id: 'gmail.open_message', params: 'index: 0' },
  { id: 'slack.post_message', params: 'channel: "#finance"', risk: true }
];
const PICKED = PLAN.map((p) => REGISTRY.indexOf(p.id));

const WINDOW = { x: 1130, y: 330, w: 420, h: 290 };
const CONTENT = { x: 1130, y: 360, w: 420, h: 260 };
type R = { x: number; y: number; w: number; h: number };
const TARGETS: R[] = [
  { x: 1226, y: 371, w: 258, h: 36 },
  { x: 1146, y: 416, w: 388, h: 44 },
  { x: 1456, y: 566, w: 78, h: 40 }
];
const SHOT_T = [22.6, 25.0, 29.1]; // flash moments
const SLOT = (i: number): R => ({ x: 1130 + i * 143, y: 640, w: 133, h: 66 });
const UI_SLOT = (i: number): R => ({ x: 112 + i * 128, y: 762, w: 118, h: 50 });
const lerpR = (a: R, b: R, u: number): R => ({
  x: lerp(a.x, b.x, u),
  y: lerp(a.y, b.y, u),
  w: lerp(a.w, b.w, u),
  h: lerp(a.h, b.h, u)
});

const TRANSCRIPT = ['Find the latest invoice in Gmail', 'and post it to #finance on Slack'];

/* ─── component ─────────────────────────────────────────────────────── */

export const AtlasFilm = () => {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.35 });
  const { mounted, ok } = useMotionOk();
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Reduced motion: no playback; open on the finished loop and let chapters jump.
  useEffect(() => {
    if (mounted && !ok) {
      setPlaying(false);
      setT(TOTAL - 0.01);
    }
  }, [mounted, ok]);

  useEffect(() => {
    if (!ok || !visible || !playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setT((v) => (v + dt) % TOTAL);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ok, visible, playing]);

  const chapter = CHAPTERS.findIndex((c) => t >= c.from && t < c.to);
  const ch = CHAPTERS[Math.max(0, chapter)]!;
  const box = camera(t);
  const state = stateAt(t);

  const jump = (i: number) => {
    const c = CHAPTERS[i]!;
    setT(ok ? c.from + 0.01 : c.to - 0.05);
  };

  return (
    <figure ref={ref} className="card not-prose my-10 overflow-hidden">
      <div className="relative bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--accent)/0.06),transparent_65%)]">
        <svg
          viewBox={box.map((v) => v.toFixed(2)).join(' ')}
          className="block aspect-video w-full"
          role="img"
          aria-label={`ATLAS explainer, chapter: ${ch.title}`}
        >
          <defs>
            <radialGradient id="af-orb" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#ffb27a" />
              <stop offset="55%" stopColor="hsl(22 88% 52%)" />
              <stop offset="100%" stopColor="#c2410c" />
            </radialGradient>
            <filter id="af-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <clipPath id="af-gate">
              <rect x={909} y={420} width={82} height={110} />
            </clipPath>
            <clipPath id="af-window">
              <rect x={CONTENT.x} y={CONTENT.y} width={CONTENT.w} height={CONTENT.h} />
            </clipPath>
          </defs>

          <Wires t={t} />
          <UserStation t={t} />
          <Orb t={t} />
          <Registry t={t} />
          <PlanBox t={t} />
          <Gate t={t} />
          <Executor t={t} />
          <Frontend t={t} state={state} />
          <Evidence t={t} />
          <Packets t={t} />
          <LoopToken t={t} />
        </svg>

        {/* chapter title card, bottom-left over the stage */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={ch.label}
            initial={ok ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute left-3 top-3 rounded-full bg-fg px-3 py-1 text-[11px] font-medium text-white sm:left-4 sm:top-4 sm:text-xs"
          >
            {chapter + 1}/{CHAPTERS.length} · {ch.label}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* chapters + scrubber */}
      <div className="border-t border-border px-4 pt-4 sm:px-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (!ok) return;
              if (!playing && t >= TOTAL - 0.1) setT(0);
              setPlaying((p) => !p);
            }}
            disabled={!ok}
            aria-label={playing ? 'Pause' : 'Play'}
            className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg text-white transition hover:bg-black/80 disabled:opacity-40"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <ol className="no-scrollbar flex flex-1 gap-1 overflow-x-auto">
            {CHAPTERS.map((c, i) => {
              const p = seg(t, c.from, c.to);
              return (
                <li key={c.label} className="min-w-[64px] flex-1">
                  <button
                    type="button"
                    onClick={() => jump(i)}
                    className={cn(
                      'focus-ring w-full rounded-lg px-1 pb-1.5 pt-1 text-left text-[11.5px] transition-colors',
                      i === chapter ? 'text-fg' : 'text-subtle hover:text-fg'
                    )}
                  >
                    <span className="block truncate font-medium">{c.label}</span>
                    <span className="mt-1 block h-1 overflow-hidden rounded-full bg-fg/10">
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${p * 100}%` }} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <button
            type="button"
            onClick={() => {
              setT(0);
              if (ok) setPlaying(true);
            }}
            aria-label="Restart"
            className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted transition hover:text-fg"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-[124px] px-5 pb-5 pt-3" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={ch.label}
            initial={ok ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-[16px] font-semibold leading-snug">{ch.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{ch.body}</p>
            {ch.label === 'Whole loop' && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {['6 apps', '~50 capabilities', '11 states · 9 events', '< 5 s voice to execution'].map((s) => (
                  <li key={s} className="rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[11.5px] text-accent">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </figure>
  );
};

/* ─── scene pieces ──────────────────────────────────────────────────── */

const appear = (t: number, i: number) => (t >= 3 ? 1 : ease(seg(t, 0.15 + i * 0.22, 0.65 + i * 0.22)));

const Label = ({ x, y, children, anchor = 'middle', size = 17, className }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; className?: string }) => (
  <text x={x} y={y} textAnchor={anchor} style={{ fontSize: size }} className={cn('fill-fg', className)}>
    {children}
  </text>
);

const Wires = ({ t }: { t: number }) => {
  const draw = t >= 3 ? 1 : ease(seg(t, 0.9, 2.8));
  const flow = t >= 36;
  const paths = [
    `M${AUDIO[0].join(',')} Q${AUDIO[1].join(',')} ${AUDIO[2].join(',')}`,
    'M700,585 L700,300',
    'M762,235 L800,235',
    'M950,302 L950,420',
    'M1005,480 L1128,480',
    WS_D
  ];
  return (
    <g fill="none" strokeLinecap="round">
      {paths.map((d) => (
        <path key={d} d={d} pathLength={1} stroke="hsl(var(--fg))" strokeOpacity={0.16} strokeWidth={3} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
      ))}
      {flow &&
        paths.map((d) => (
          <path
            key={`f-${d}`}
            d={d}
            pathLength={1}
            stroke="hsl(var(--accent))"
            strokeWidth={3}
            strokeDasharray="0.04 0.06"
            strokeDashoffset={-(t - 36) * 0.25}
            opacity={seg(t, 36, 36.8) * (1 - seg(t, 41.4, 42))}
          />
        ))}
      <Label x={1000} y={868} size={15} className="fill-subtle">
        WebSocket bridge
      </Label>
    </g>
  );
};

const UserStation = ({ t }: { t: number }) => {
  const a = appear(t, 0);
  const amp = seg(t, 3.3, 3.8) * (1 - seg(t, 6.0, 6.6));
  const typed = seg(t, 6.0, 8.4);
  const chars = Math.round(typed * (TRANSCRIPT[0]!.length + TRANSCRIPT[1]!.length));
  const l1 = TRANSCRIPT[0]!.slice(0, chars);
  const l2 = TRANSCRIPT[1]!.slice(0, Math.max(0, chars - TRANSCRIPT[0]!.length));
  return (
    <g opacity={a}>
      <rect x={90} y={110} width={330} height={250} rx={28} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth={2} />
      <Label x={116} y={150} anchor="start" size={16} className="fill-subtle">
        Voice command
      </Label>
      {amp > 0 && <circle cx={180} cy={235} r={44 + amp * 18 * Math.abs(Math.sin(t * 6))} fill="hsl(var(--accent))" opacity={0.15} />}
      <circle cx={180} cy={235} r={44} fill={amp > 0 ? 'hsl(var(--accent))' : 'hsl(var(--fg))'} />
      <Mic x={158} y={213} width={44} height={44} color="white" strokeWidth={2} />
      {Array.from({ length: 16 }, (_, i) => {
        const h = 6 + amp * 70 * Math.abs(Math.sin(t * 9 + i * 0.7)) * (0.55 + 0.45 * Math.sin(i * 1.3 + t * 5));
        return <rect key={i} x={248 + i * 10} y={235 - Math.max(3, h) / 2} width={5} height={Math.max(3, h)} rx={2.5} fill={amp > 0 ? 'hsl(var(--accent))' : 'hsl(var(--fg))'} opacity={amp > 0 ? 0.9 : 0.25} />;
      })}
      <Label x={116} y={335} anchor="start" size={15} className="fill-muted">
        streamed live
      </Label>

      {/* transcript bubble */}
      <g opacity={seg(t, 5.9, 6.2) * (t >= 36 ? 1 : 1 - seg(t, 9.0, 9.4))}>
        <rect x={90} y={384} width={540} height={74} rx={20} fill="hsl(var(--fg))" />
        <text x={114} y={415} style={{ fontSize: 19 }} className="fill-white">
          “{l1}
        </text>
        <text x={114} y={442} style={{ fontSize: 19 }} className="fill-white">
          {l2}
          {typed >= 1 ? '”' : ''}
        </text>
      </g>

      {/* the STT hop that isn't there */}
      <g opacity={win(t, 4.2, 7.0, 0.4) * (1 - 0.6 * seg(t, 5.6, 6.2))}>
        <rect x={478} y={168} width={112} height={44} rx={12} fill="hsl(var(--card))" stroke="hsl(var(--fg))" strokeOpacity={0.4} strokeDasharray="6 5" strokeWidth={2} />
        <Label x={534} y={196} size={15} className="fill-muted">
          separate STT
        </Label>
        <line x1={472} y1={190} x2={472 + 124 * seg(t, 5.0, 5.5)} y2={190} stroke="hsl(var(--accent))" strokeWidth={3} />
        <Label x={534} y={152} size={14} className="fill-accent">
          {t >= 5.2 ? 'skipped' : ''}
        </Label>
      </g>

      {/* audio packets */}
      {Array.from({ length: 12 }, (_, k) => {
        const s = 3.6 + k * 0.22;
        const u = seg(t, s, s + 0.8);
        if (u <= 0 || u >= 1) return null;
        const [x, y] = quad(...AUDIO, ease(u));
        return (
          <g key={k}>
            <circle cx={x} cy={y} r={9} fill="hsl(var(--accent))" filter="url(#af-glow)" opacity={0.8} />
            <circle cx={x} cy={y} r={5} fill="hsl(var(--accent))" />
          </g>
        );
      })}
    </g>
  );
};

const Orb = ({ t }: { t: number }) => {
  const a = appear(t, 1);
  const busy = Math.max(win(t, 3.8, 6.8), win(t, 11.2, 13.0));
  const pulse = seg(t, 12.2, 13.0);
  return (
    <g opacity={a}>
      {pulse > 0 && pulse < 1 && <circle cx={ORB[0]} cy={ORB[1]} r={62 + pulse * 80} fill="none" stroke="hsl(var(--accent))" strokeWidth={3} opacity={1 - pulse} />}
      <ellipse cx={ORB[0]} cy={ORB[1]} rx={96} ry={26} fill="none" stroke="hsl(var(--accent))" strokeOpacity={0.35 + busy * 0.4} strokeWidth={2} transform={`rotate(${t * 40} ${ORB[0]} ${ORB[1]})`} />
      <ellipse cx={ORB[0]} cy={ORB[1]} rx={26} ry={96} fill="none" stroke="hsl(var(--fg))" strokeOpacity={0.18 + busy * 0.3} strokeWidth={2} transform={`rotate(${-t * 28} ${ORB[0]} ${ORB[1]})`} />
      <circle cx={ORB[0]} cy={ORB[1]} r={62 + busy * 4 * Math.sin(t * 10)} fill="url(#af-orb)" />
      <circle cx={ORB[0] - 18} cy={ORB[1] - 22} r={14} fill="white" opacity={0.35} />
      <Label x={ORB[0]} y={ORB[1] + 132} size={18} className="font-semibold">
        {t < 8.8 ? 'Gemini Live API' : 'Gemini 2.5 Flash'}
      </Label>
      <Label x={ORB[0]} y={ORB[1] + 156} size={14} className="fill-subtle">
        {t < 8.8 ? 'audio → intent' : 'intent + tools → plan'}
      </Label>
    </g>
  );
};

const chipHome = (i: number): Pt => [470 + (i % 3) * 160, 424 + Math.floor(i / 3) * 38];

const Registry = ({ t }: { t: number }) => {
  const a = appear(t, 2);
  return (
    <g opacity={a}>
      {/* database stack */}
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(0 ${k * 30})`}>
          <ellipse cx={700} cy={604} rx={90} ry={22} fill="hsl(var(--card))" stroke="hsl(var(--fg))" strokeOpacity={0.25} strokeWidth={2} />
        </g>
      ))}
      <path d="M610,604 L610,664 A90,22 0 0 0 790,664 L790,604" fill="hsl(var(--card))" stroke="hsl(var(--fg))" strokeOpacity={0.25} strokeWidth={2} />
      <ellipse cx={700} cy={604} rx={90} ry={22} fill="hsl(var(--bg))" stroke="hsl(var(--fg))" strokeOpacity={0.25} strokeWidth={2} />
      <Database x={686} y={622} width={28} height={28} color="hsl(var(--accent))" />
      <Label x={700} y={724} size={17} className="font-semibold">
        Capability registry
      </Label>
      <Label x={700} y={746} size={14} className="fill-subtle">
        Firestore · selector, params, risk_level
      </Label>

      {/* capabilities: fan out, then stream into the model as tools */}
      {REGISTRY.map((id, i) => {
        const out = ease(seg(t, 9.4 + i * 0.05, 10.4 + i * 0.05));
        const fly = ease(seg(t, 11.0 + i * 0.07, 12.2 + i * 0.07));
        if (out <= 0 || t > 13.2) return null;
        const home = chipHome(i);
        const x = lerp(lerp(700, home[0], out), ORB[0], fly);
        const y = lerp(lerp(640, home[1], out), ORB[1], fly);
        const s = lerp(1, 0.25, fly);
        const picked = PICKED.includes(i);
        return (
          <g key={id} transform={`translate(${x} ${y}) scale(${s})`} opacity={(1 - seg(fly, 0.75, 1)) * out}>
            <rect x={-74} y={-15} width={148} height={30} rx={8} fill={picked ? 'hsl(var(--accent))' : 'hsl(var(--card))'} stroke={picked ? 'none' : 'hsl(var(--border))'} strokeWidth={2} />
            <text textAnchor="middle" y={5} style={{ fontSize: 13 }} className={cn('font-mono', picked ? 'fill-white' : 'fill-muted')}>
              {id}
            </text>
          </g>
        );
      })}
      <Label x={700} y={572} size={14} className="fill-accent">
        {t >= 9.6 && t < 12.6 ? 'registry → passed to the model as tools' : ''}
      </Label>
    </g>
  );
};

const PlanBox = ({ t }: { t: number }) => {
  const a = appear(t, 3);
  const frame = seg(t, 12.6, 13.2);
  const shatter = seg(t, 14.8, 15.6);
  const tok = ease(seg(t, 14.1, 14.8));
  const gone = t >= 16.2 && t < 36 ? 1 - seg(t, 16.2, 16.8) : 1;
  return (
    <g opacity={a}>
      <rect x={800} y={130} width={300} height={176} rx={20} fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth={2.5} strokeDasharray="8 7" opacity={0.35 + frame * 0.65} />
      <Label x={950} y={118} size={14} className="fill-subtle">
        bounded output: capability IDs only
      </Label>
      <g opacity={gone}>
        {PLAN.map((p, i) => {
          const u = ease(seg(t, 12.8 + i * 0.5, 13.4 + i * 0.5));
          const y = 144 + i * 52;
          return (
            <g key={p.id} opacity={u} transform={`translate(${lerp(-60, 0, u)} 0)`}>
              <rect x={814} y={y} width={272} height={44} rx={10} fill="hsl(var(--bg))" />
              <text x={828} y={y + 19} style={{ fontSize: 15 }} className="fill-fg font-mono font-semibold">
                {i + 1}. {p.id}
              </text>
              <text x={828} y={y + 36} style={{ fontSize: 12 }} className="fill-muted font-mono">
                {p.params}
              </text>
              {p.risk && (
                <g>
                  <rect x={1010} y={y + 24} width={70} height={16} rx={8} fill="hsl(var(--accent))" opacity={0.15} />
                  <text x={1045} y={y + 36} textAnchor="middle" style={{ fontSize: 11 }} className="fill-accent">
                    risk: medium
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>
      {t < 36 && (t >= 16.8 || gone < 1) && (
        <Label x={950} y={224} size={15} className="fill-subtle">
          {t >= 16.8 ? 'plan sent to the gate' : ''}
        </Label>
      )}

      {/* the generated-code attempt that bounces off */}
      {tok > 0 && shatter < 1 && (
        <g>
          {shatter === 0 ? (
            <g transform={`translate(${lerp(ORB[0] + 40, 790, tok)} ${ORB[1] + 60})`}>
              <rect x={-112} y={-15} width={140} height={30} rx={8} fill="hsl(var(--fg))" />
              <text x={-42} y={5} textAnchor="middle" style={{ fontSize: 12 }} className="fill-white font-mono">
                page.click(…)
              </text>
            </g>
          ) : (
            Array.from({ length: 8 }, (_, k) => {
              const ang = (k / 8) * Math.PI * 2;
              const d = ease(shatter) * 70;
              return (
                <rect
                  key={k}
                  x={790 - 42 + Math.cos(ang) * d}
                  y={ORB[1] + 60 + Math.sin(ang) * d}
                  width={12}
                  height={8}
                  rx={2}
                  fill="hsl(var(--fg))"
                  opacity={1 - shatter}
                  transform={`rotate(${k * 45 + shatter * 180} ${790 - 36 + Math.cos(ang) * d} ${ORB[1] + 64 + Math.sin(ang) * d})`}
                />
              );
            })
          )}
        </g>
      )}
      <g opacity={win(t, 14.9, 16.4)}>
        <rect x={812} y={318} width={276} height={34} rx={17} fill="hsl(var(--accent))" />
        <text x={950} y={341} textAnchor="middle" style={{ fontSize: 15 }} className="fill-white font-medium">
          ✕ generated code isn’t an option
        </text>
      </g>
    </g>
  );
};

const Gate = ({ t }: { t: number }) => {
  const a = appear(t, 4);
  const open = t >= 36 ? 1 : ease(seg(t, 19.2, 19.8));
  const unlocked = t >= 19.1;
  const [cx, cy] = track(t, [
    [16.2, 950, 290],
    [17.3, 950, 392],
    [19.8, 950, 392],
    [20.3, 950, 480],
    [20.9, 1090, 480]
  ]);
  const capsule = t >= 16.2 && t < 21.1 ? 1 - seg(t, 20.7, 21.1) : 0;
  const [mx, my] = track(t, [
    [17.6, 1060, 690],
    [18.7, 955, 626],
    [19.6, 955, 626]
  ]);
  const press = win(t, 18.85, 19.05, 0.08);
  return (
    <g opacity={a}>
      {/* pillars and bars */}
      <rect x={895} y={414} width={14} height={122} rx={5} fill="hsl(var(--fg))" />
      <rect x={991} y={414} width={14} height={122} rx={5} fill="hsl(var(--fg))" />
      <g clipPath="url(#af-gate)">
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={909} y={430 + i * 20 - open * 112} width={82} height={6} rx={3} fill="hsl(var(--fg))" opacity={0.55} />
        ))}
      </g>
      <Label x={950} y={562} size={17} className="font-semibold">
        Approval gate
      </Label>
      <Label x={950} y={584} size={13} className="fill-subtle">
        risk_level from the registry
      </Label>

      {/* lock */}
      <g opacity={1 - seg(t, 19.5, 19.9)} transform={`translate(950 476)`}>
        <rect x={-15} y={-8} width={30} height={24} rx={5} fill="hsl(var(--accent))" />
        <path d={`M-9,-8 L-9,-15 A9,9 0 0 1 9,-15 L9,${unlocked ? -22 : -8}`} fill="none" stroke="hsl(var(--accent))" strokeWidth={4} transform={unlocked ? 'translate(0 -6)' : undefined} />
      </g>

      {/* waiting notice + approve button */}
      <g opacity={win(t, 17.3, 20.0)}>
        <rect x={676} y={430} width={206} height={52} rx={12} fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth={2} />
        <text x={690} y={452} style={{ fontSize: 13 }} className="fill-accent font-medium">
          step 3 · risk: medium
        </text>
        <text x={690} y={471} style={{ fontSize: 13 }} className="fill-muted">
          waiting for a human
        </text>
      </g>
      <g opacity={win(t, 17.5, 20.2)} transform={`translate(950 624) scale(${1 - press * 0.08}) translate(-950 -624)`}>
        <rect x={880} y={604} width={140} height={40} rx={20} fill={t >= 18.95 ? 'hsl(var(--success))' : 'hsl(var(--fg))'} />
        <text x={950} y={630} textAnchor="middle" style={{ fontSize: 16 }} className="fill-white font-medium">
          {t >= 18.95 ? 'Approved' : 'Approve'}
        </text>
      </g>
      {t >= 17.6 && t < 19.9 && <MousePointer2 x={mx} y={my} width={30} height={30} fill="hsl(var(--fg))" color="white" strokeWidth={1.5} />}

      {/* the plan, as one capsule, travelling through */}
      {capsule > 0 && (
        <g opacity={capsule} transform={`translate(${cx} ${cy})`}>
          <rect x={-76} y={-17} width={152} height={34} rx={17} fill="hsl(var(--fg))" />
          <text y={6} textAnchor="middle" style={{ fontSize: 15 }} className="fill-white font-medium">
            plan · 3 steps
          </text>
        </g>
      )}
    </g>
  );
};

const Executor = ({ t }: { t: number }) => {
  const a = appear(t, 5);
  const slack = t >= 26 && t < 36;
  const [px, py] = track(t, [
    [21.2, 1360, 600],
    [22.2, 1350, 389],
    [23.8, 1350, 389],
    [24.6, 1330, 438],
    [26.2, 1330, 438],
    [26.9, 1495, 586],
    [29.6, 1495, 586],
    [30.4, 1420, 600]
  ]);
  const boxes = [
    { draw: seg(t, 22.2, 22.6), keep: t < 23.8, bad: false },
    { draw: seg(t, 24.6, 25.0), keep: t < 26.2, bad: false },
    { draw: seg(t, 26.9, 27.3), keep: t < 28.7, bad: true },
    { draw: seg(t, 28.7, 29.1), keep: t < 30.6, bad: false }
  ];
  const shake = t >= 27.3 && t < 27.9 ? Math.sin(t * 60) * 5 * (1 - seg(t, 27.3, 27.9)) : 0;
  const flash = Math.max(...SHOT_T.map((s) => win(t, s, s + 0.35, 0.12)));
  const retry = win(t, 27.9, 28.9, 0.15);
  return (
    <g opacity={a}>
      {/* window */}
      <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} rx={16} fill="hsl(var(--bg))" stroke="hsl(var(--border))" strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={1152 + i * 16} cy={345} r={4.5} fill="hsl(var(--fg))" opacity={0.15} />
      ))}
      <text x={1210} y={351} style={{ fontSize: 14 }} className="fill-subtle">
        {slack ? 'Slack · #finance' : 'Gmail'}
      </text>
      <rect x={1440} y={336} width={98} height={20} rx={10} fill="hsl(var(--fg))" />
      <text x={1489} y={351} textAnchor="middle" style={{ fontSize: 12 }} className="fill-white font-mono">
        Playwright
      </text>
      <g clipPath="url(#af-window)">
        {!slack ? (
          <g>
            <rect x={1230} y={375} width={250} height={28} rx={14} fill="hsl(var(--card))" />
            {t >= 22.4 && t < 26 && (
              <text x={1246} y={394} style={{ fontSize: 13 }} className="fill-fg font-mono">
                invoice
              </text>
            )}
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x={1150} y={420 + i * 48} width={380} height={36} rx={8} fill="hsl(var(--card))" />
                <rect x={1164} y={432 + i * 48} width={i === 0 ? 150 : 110 + i * 20} height={6} rx={3} fill="hsl(var(--fg))" opacity={i === 0 ? 0.45 : 0.15} />
                <rect x={1164} y={444 + i * 48} width={220} height={5} rx={2.5} fill="hsl(var(--fg))" opacity={0.1} />
              </g>
            ))}
          </g>
        ) : (
          <g>
            {[0, 1].map((i) => (
              <g key={i}>
                <circle cx={1162} cy={392 + i * 56} r={12} fill="hsl(var(--fg))" opacity={0.12} />
                <rect x={1184} y={382 + i * 56} width={200 + i * 60} height={30} rx={10} fill="hsl(var(--card))" />
              </g>
            ))}
            {t >= 29.2 && (
              <g>
                <circle cx={1162} cy={504} r={12} fill="hsl(var(--accent))" opacity={0.5} />
                <rect x={1184} y={494} width={230} height={30} rx={10} fill="hsl(var(--accent))" opacity={0.15} />
                <text x={1196} y={514} style={{ fontSize: 12 }} className="fill-fg">
                  invoice.pdf · latest invoice
                </text>
              </g>
            )}
            <rect x={1150} y={570} width={300} height={32} rx={10} fill="hsl(var(--card))" />
            <rect x={1460} y={570} width={70} height={32} rx={10} fill="hsl(var(--fg))" />
            <text x={1495} y={591} textAnchor="middle" style={{ fontSize: 12 }} className="fill-white">
              Send
            </text>
          </g>
        )}

        {/* bounding boxes */}
        {boxes.map((b, i) => {
          if (!b.draw || !b.keep) return null;
          const r = TARGETS[Math.min(i, 2)]!;
          return (
            <rect
              key={i}
              x={r.x + (b.bad ? shake : 0)}
              y={r.y}
              width={r.w}
              height={r.h}
              rx={8}
              pathLength={1}
              fill={b.bad ? 'hsl(var(--accent) / 0.12)' : 'hsl(var(--accent) / 0.08)'}
              stroke={b.bad ? 'hsl(var(--accent))' : 'hsl(var(--accent))'}
              strokeWidth={3}
              strokeDasharray={b.bad ? '0.03 0.02' : '1 1'}
              strokeDashoffset={b.bad ? 0 : 1 - b.draw}
            />
          );
        })}
        <rect x={CONTENT.x} y={CONTENT.y} width={CONTENT.w} height={CONTENT.h} fill="white" opacity={flash * 0.75} />
      </g>

      {/* retry ring */}
      {retry > 0 && (
        <g opacity={retry}>
          <circle cx={1495} cy={586} r={34} fill="none" stroke="hsl(var(--accent))" strokeOpacity={0.2} strokeWidth={4} />
          <circle cx={1495} cy={586} r={34} fill="none" stroke="hsl(var(--accent))" strokeWidth={4} strokeDasharray="60 200" transform={`rotate(${t * 520} 1495 586)`} />
        </g>
      )}
      <g opacity={win(t, 27.3, 29.0)}>
        <rect x={1236} y={526} width={200} height={30} rx={15} fill="hsl(var(--accent))" />
        <text x={1336} y={546} textAnchor="middle" style={{ fontSize: 13 }} className="fill-white font-medium">
          {t < 28.0 ? 'target not ready · failed' : 'retrying…'}
        </text>
      </g>

      {/* cursor */}
      {t >= 21.2 && t < 31 && <MousePointer2 x={px} y={py} width={30} height={30} fill="hsl(var(--fg))" color="white" strokeWidth={1.5} />}

      {/* filmstrip of evidence */}
      {[0, 1, 2].map((i) => {
        const s = SLOT(i);
        return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={10} fill="none" stroke="hsl(var(--border))" strokeWidth={2} strokeDasharray="6 6" />;
      })}
      <Label x={1340} y={736} size={13} className="fill-subtle">
        per-step screenshot evidence
      </Label>
    </g>
  );
};

const Evidence = ({ t }: { t: number }) => (
  <g>
      {[0, 1, 2].map((i) => {
        const start = SHOT_T[i]! + 0.3;
        const fly = ease(seg(t, start, start + 0.7));
        if (fly <= 0) return null;
        const send = ease(seg(t, 31.8 + i * 0.5, 33.2 + i * 0.5));
        let r = lerpR(CONTENT, SLOT(i), fly);
        if (send > 0) {
          const sc: Pt = [SLOT(i).x + SLOT(i).w / 2, SLOT(i).y + SLOT(i).h / 2];
          const [x, y] = send < 0.18 ? [lerp(sc[0], WS[0][0], send / 0.18), lerp(sc[1], WS[0][1], send / 0.18)] : cubic(...WS, (send - 0.18) / 0.82);
          const size = lerpR(SLOT(i), UI_SLOT(i), send);
          r = send >= 1 ? UI_SLOT(i) : { x: x - size.w / 2, y: y - size.h / 2, w: size.w, h: size.h };
        }
        return <Thumb key={i} r={r} i={i} />;
      })}
  </g>
);

const Thumb = ({ r, i }: { r: R; i: number }) => {
  const tg = TARGETS[i]!;
  const fx = (tg.x - CONTENT.x) / CONTENT.w;
  const fy = (tg.y - CONTENT.y) / CONTENT.h;
  return (
    <g>
      <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={Math.min(12, r.w / 12)} fill="hsl(var(--bg))" stroke="hsl(var(--fg))" strokeOpacity={0.25} strokeWidth={2} />
      {[0.12, 0.3, 0.48, 0.66, 0.84].map((fy2, k) => (
        <rect key={k} x={r.x + r.w * 0.05} y={r.y + r.h * fy2} width={r.w * (k === 0 ? 0.55 : 0.9)} height={Math.max(1.5, r.h * 0.1)} rx={2} fill="hsl(var(--card))" />
      ))}
      <rect
        x={r.x + fx * r.w}
        y={r.y + fy * r.h}
        width={(tg.w / CONTENT.w) * r.w}
        height={(tg.h / CONTENT.h) * r.h}
        rx={3}
        fill="hsl(var(--accent) / 0.15)"
        stroke="hsl(var(--accent))"
        strokeWidth={2}
      />
    </g>
  );
};

const Frontend = ({ t, state }: { t: number; state: string }) => {
  const a = appear(t, 6);
  return (
    <g opacity={a}>
      <rect x={90} y={560} width={410} height={270} rx={24} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth={2} />
      <Label x={112} y={593} anchor="start" size={16} className="font-semibold">
        ATLAS UI
      </Label>
      <Label x={478} y={593} anchor="end" size={13} className="fill-subtle">
        Next.js · state machine
      </Label>
      {STATES.map((s, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 112 + col * 126;
        const y = 608 + row * 34;
        const on = s === state;
        const hot = on && (s === 'step_failed' || s === 'retrying');
        return (
          <g key={s}>
            <rect x={x} y={y} width={118} height={26} rx={13} fill={on ? (hot ? 'hsl(var(--accent))' : 'hsl(var(--fg))') : 'hsl(var(--bg))'} />
            <text x={x + 59} y={y + 17.5} textAnchor="middle" style={{ fontSize: s.length > 14 ? 10.5 : 12 }} className={cn('font-mono', on ? 'fill-white' : 'fill-subtle')}>
              {s}
            </text>
          </g>
        );
      })}
      {[0, 1, 2].map((i) => {
        const s = UI_SLOT(i);
        return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={8} fill="none" stroke="hsl(var(--border))" strokeWidth={2} strokeDasharray="5 5" />;
      })}
    </g>
  );
};

const Packets = ({ t }: { t: number }) => (
  <g>
    {PACKETS.map((p, i) => {
      const u = seg(t, p.start, p.start + 1.1);
      if (u <= 0 || u >= 1) return null;
      const [x, y] = cubic(...WS, ease(u));
      const c = PACKET_COLOR[p.name] ?? 'hsl(var(--fg))';
      return (
        <g key={i}>
          <circle cx={x} cy={y} r={14} fill={c} filter="url(#af-glow)" opacity={0.7} />
          <circle cx={x} cy={y} r={8} fill={c} />
          <text x={x} y={y - 18} textAnchor="middle" style={{ fontSize: 13 }} className="fill-fg font-mono">
            {p.name}
          </text>
        </g>
      );
    })}
  </g>
);

const LoopToken = ({ t }: { t: number }) => {
  const u = seg(t, 36.6, 40.8);
  if (u <= 0 || u >= 1) return null;
  const [x, y] = along(ROUTE, ease(u));
  const trail = [0.012, 0.024, 0.036].map((d) => along(ROUTE, ease(Math.max(0, u - d))));
  return (
    <g>
      {trail.map(([tx, ty], i) => (
        <circle key={i} cx={tx} cy={ty} r={9 - i * 2} fill="hsl(var(--accent))" opacity={0.35 - i * 0.1} />
      ))}
      <circle cx={x} cy={y} r={20} fill="hsl(var(--accent))" filter="url(#af-glow)" opacity={0.8} />
      <circle cx={x} cy={y} r={11} fill="hsl(var(--accent))" stroke="white" strokeWidth={3} />
    </g>
  );
};
