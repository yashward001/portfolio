'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Circle, Play } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Fig, useTimeline } from '../kit';

/* A toy price-time-priority engine that really runs in the page, so the replay check is real:
   same commands → same events → same 64-bit state hash. */

type Side = 'B' | 'S';
type Cmd =
  | { t: 'New'; id: number; side: Side; px: number; qty: number }
  | { t: 'Cancel'; id: number }
  | { t: 'Modify'; id: number; qty: number };
type Ev =
  | { t: 'Ack'; id: number }
  | { t: 'Reject'; id: number }
  | { t: 'Fill'; maker: number; taker: number; px: number; qty: number }
  | { t: 'Cancelled'; id: number }
  | { t: 'Modified'; id: number; qty: number };
type Order = { id: number; side: Side; px: number; qty: number };
type Book = { bids: Map<number, Order[]>; asks: Map<number, Order[]> };

const COMMANDS: Cmd[] = [
  { t: 'New', id: 1, side: 'S', px: 101, qty: 5 },
  { t: 'New', id: 2, side: 'S', px: 102, qty: 3 },
  { t: 'New', id: 3, side: 'S', px: 101, qty: 2 },
  { t: 'New', id: 4, side: 'B', px: 99, qty: 4 },
  { t: 'New', id: 5, side: 'B', px: 100, qty: 6 },
  { t: 'New', id: 6, side: 'B', px: 101, qty: 6 },
  { t: 'Cancel', id: 9 },
  { t: 'New', id: 7, side: 'S', px: 99, qty: 8 },
  { t: 'Modify', id: 4, qty: 5 },
  { t: 'New', id: 8, side: 'B', px: 99, qty: 3 },
  { t: 'Cancel', id: 3 },
  { t: 'New', id: 9, side: 'S', px: 103, qty: 4 }
];

const step = (book: Book, cmd: Cmd): Ev[] => {
  const find = (id: number) => {
    for (const side of [book.bids, book.asks])
      for (const [px, q] of side) {
        const i = q.findIndex((o) => o.id === id);
        if (i >= 0) return { side, px, q, i };
      }
    return null;
  };
  if (cmd.t === 'Cancel') {
    const f = find(cmd.id);
    if (!f) return [{ t: 'Reject', id: cmd.id }];
    f.q.splice(f.i, 1);
    if (!f.q.length) f.side.delete(f.px);
    return [{ t: 'Cancelled', id: cmd.id }];
  }
  if (cmd.t === 'Modify') {
    const f = find(cmd.id);
    if (!f || cmd.qty <= 0) return [{ t: 'Reject', id: cmd.id }];
    f.q[f.i]!.qty = cmd.qty;
    return [{ t: 'Modified', id: cmd.id, qty: cmd.qty }];
  }
  const evs: Ev[] = [{ t: 'Ack', id: cmd.id }];
  let left = cmd.qty;
  const opp = cmd.side === 'B' ? book.asks : book.bids;
  const crosses = (px: number) => (cmd.side === 'B' ? px <= cmd.px : px >= cmd.px);
  while (left > 0) {
    const levels = [...opp.keys()].sort((a, b) => (cmd.side === 'B' ? a - b : b - a));
    const best = levels[0];
    if (best === undefined || !crosses(best)) break;
    const q = opp.get(best)!;
    const maker = q[0]!;
    const qty = Math.min(left, maker.qty);
    evs.push({ t: 'Fill', maker: maker.id, taker: cmd.id, px: best, qty });
    left -= qty;
    maker.qty -= qty;
    if (!maker.qty) q.shift();
    if (!q.length) opp.delete(best);
  }
  if (left > 0) {
    const own = cmd.side === 'B' ? book.bids : book.asks;
    own.set(cmd.px, [...(own.get(cmd.px) ?? []), { id: cmd.id, side: cmd.side, px: cmd.px, qty: left }]);
  }
  return evs;
};

/** FNV-1a 64 over a canonical snapshot: asks low→high, bids high→low, FIFO within a level. */
const hashBook = (book: Book) => {
  const MASK = (BigInt(1) << BigInt(64)) - BigInt(1);
  const PRIME = BigInt('0x100000001b3');
  let h = BigInt('0xcbf29ce484222325');
  const feed = (n: number) => {
    for (let k = 0; k < 4; k++) {
      h ^= BigInt((n >>> (k * 8)) & 0xff);
      h = (h * PRIME) & MASK;
    }
  };
  const asks = [...book.asks.keys()].sort((a, b) => a - b);
  const bids = [...book.bids.keys()].sort((a, b) => b - a);
  feed(0xa5);
  for (const px of asks) for (const o of book.asks.get(px)!) [o.id, o.px, o.qty].forEach(feed);
  feed(0xb1);
  for (const px of bids) for (const o of book.bids.get(px)!) [o.id, o.px, o.qty].forEach(feed);
  return `0x${h.toString(16).padStart(16, '0')}`;
};

const clone = (b: Book): Book => ({
  bids: new Map([...b.bids].map(([k, v]) => [k, v.map((o) => ({ ...o }))])),
  asks: new Map([...b.asks].map(([k, v]) => [k, v.map((o) => ({ ...o }))]))
});

const run = () => {
  const book: Book = { bids: new Map(), asks: new Map() };
  const frames = COMMANDS.map((c) => {
    const events = step(book, c);
    return { events, book: clone(book) };
  });
  return { frames, hash: hashBook(book) };
};

// Record once and replay independently: two separate engine runs over the same log.
const RECORD = run();
const REPLAY = run();
const N = COMMANDS.length;
const LADDER = [103, 102, 101, 100, 99];

const T = [
  ...COMMANDS.map((_, i) => 0.2 + i * 1.05), // 0..N-1 record
  0.2 + N * 1.05 + 0.4, // N   record hash
  ...COMMANDS.map((_, i) => 0.2 + N * 1.05 + 2.2 + i * 0.14), // N+1..2N replay
  0.2 + N * 1.05 + 2.2 + N * 0.14 + 0.5 // 2N+1 verified
];

const cmdText = (c: Cmd) =>
  c.t === 'New'
    ? `New  #${c.id} ${c.side === 'B' ? 'BUY ' : 'SELL'} ${c.qty}@${c.px}`
    : c.t === 'Cancel'
      ? `Cancel #${c.id}`
      : `Modify #${c.id} qty=${c.qty}`;

const evText = (e: Ev) =>
  e.t === 'Fill'
    ? `Fill  #${e.maker}←#${e.taker} ${e.qty}@${e.px}`
    : e.t === 'Modified'
      ? `Modified #${e.id} qty=${e.qty}`
      : `${e.t} #${e.id}`;

export const OrderBookReplay = () => {
  const { ref, step: s, ok } = useTimeline(T, T[T.length - 1]! + 4.5);
  const replaying = s > N;
  const cmdIdx = s < 0 ? -1 : s < N ? s : s === N ? N - 1 : Math.min(s - N - 1, N - 1);
  const frame = cmdIdx >= 0 ? (replaying ? REPLAY : RECORD).frames[cmdIdx]! : null;
  const events = (replaying ? REPLAY : RECORD).frames
    .slice(0, cmdIdx + 1)
    .flatMap((f, i) => f.events.map((e, j) => ({ e, key: `${i}-${j}` })))
    .slice(-6)
    .reverse();
  const recorded = s >= N;
  const verified = s >= 2 * N + 1;

  return (
    <Fig
      title="Record, replay, compare the hash"
      note="A toy version of the engine, running in your browser: price-time priority, integer ticks and lots, and a 64-bit hash over a canonical snapshot. Replay is a second, independent run over the same command log."
      illustrative="Live toy engine"
    >
      <div ref={ref}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-5 py-3 text-[13px]">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 font-medium',
              !replaying ? 'text-fg' : 'text-subtle'
            )}
          >
            <Circle className={cn('h-3 w-3', !replaying && s >= 0 && 'fill-accent text-accent')} />
            Record → binary log (NXLG … NXTL)
          </span>
          <span
            className={cn('inline-flex items-center gap-1.5 font-medium', replaying ? 'text-fg' : 'text-subtle')}
          >
            <Play className="h-3 w-3" /> Replay
          </span>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-[1fr_1.25fr_1fr]">
          {/* command tape */}
          <div>
            <p className="text-xs text-subtle">Commands</p>
            <ol className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[11.5px] md:grid-cols-1">
              {COMMANDS.map((c, i) => (
                <li
                  key={i}
                  className={cn(
                    'rounded px-1.5 py-[3px] transition-colors duration-200',
                    i === cmdIdx ? 'bg-fg text-white' : i < cmdIdx ? 'text-fg/70' : 'text-subtle/60'
                  )}
                >
                  {cmdText(c)}
                </li>
              ))}
            </ol>
          </div>

          {/* ladder */}
          <div>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 text-xs text-subtle">
              <span className="text-right">Bids</span>
              <span className="w-10 text-center">Price</span>
              <span>Asks</span>
            </div>
            <div className="mt-2 space-y-1">
              {LADDER.map((px) => {
                const bids = frame?.book.bids.get(px) ?? [];
                const asks = frame?.book.asks.get(px) ?? [];
                return (
                  <div key={px} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className="flex min-h-[30px] flex-row-reverse flex-wrap items-center gap-1 rounded-lg bg-success/[0.06] p-1">
                      <AnimatePresence initial={false}>
                        {bids.map((o) => (
                          <OrderChip key={o.id} o={o} ok={ok} />
                        ))}
                      </AnimatePresence>
                    </div>
                    <span className="w-10 text-center font-mono text-[12px] font-medium">{px}</span>
                    <div className="flex min-h-[30px] flex-wrap items-center gap-1 rounded-lg bg-accent/[0.06] p-1">
                      <AnimatePresence initial={false}>
                        {asks.map((o) => (
                          <OrderChip key={o.id} o={o} ok={ok} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-subtle">FIFO within each level: the order nearest the price fills first.</p>
          </div>

          {/* events */}
          <div>
            <p className="text-xs text-subtle">Events emitted</p>
            <ul className="mt-2 space-y-1 font-mono text-[11.5px]">
              <AnimatePresence initial={false}>
                {events.map(({ e, key }, i) => (
                  <motion.li
                    key={`${replaying ? 'r' : 'w'}-${key}`}
                    layout={ok}
                    initial={ok ? { opacity: 0, x: -8 } : false}
                    animate={{ opacity: 1 - i * 0.13, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      'rounded px-1.5 py-[3px]',
                      e.t === 'Fill' && 'bg-success/10 text-fg',
                      e.t === 'Reject' && 'bg-accent/10 text-accent'
                    )}
                  >
                    {evText(e)}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>

        {/* hashes */}
        <div className="grid gap-3 border-t border-border bg-bg/60 px-5 py-4 font-mono text-[12px] sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:px-6">
          <p>
            <span className="text-subtle">record hash </span>
            <span className={cn('transition-opacity', recorded ? 'opacity-100' : 'opacity-20')}>
              {recorded ? RECORD.hash : '0x················'}
            </span>
          </p>
          <p>
            <span className="text-subtle">replay hash </span>
            <span className={cn('transition-opacity', verified ? 'opacity-100' : 'opacity-20')}>
              {verified ? REPLAY.hash : '0x················'}
            </span>
          </p>
          <motion.p
            initial={false}
            animate={{ opacity: verified ? 1 : 0, scale: verified ? 1 : 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="inline-flex items-center gap-1.5 justify-self-start rounded-full bg-success px-3 py-1 font-sans text-xs font-medium text-white"
          >
            <Check className="h-3.5 w-3.5" />
            {RECORD.hash === REPLAY.hash ? 'hash OK' : 'hash mismatch'}
          </motion.p>
        </div>
      </div>
    </Fig>
  );
};

const OrderChip = ({ o, ok }: { o: Order; ok: boolean }) => (
  <motion.span
    layout={ok}
    initial={ok ? { opacity: 0, scale: 0.6 } : false}
    animate={{ opacity: 1, scale: 1 }}
    exit={ok ? { opacity: 0, scale: 0.4, transition: { duration: 0.2 } } : { opacity: 0 }}
    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    className={cn(
      'rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium text-white',
      o.side === 'B' ? 'bg-success' : 'bg-accent'
    )}
  >
    #{o.id}·{o.qty}
  </motion.span>
);
