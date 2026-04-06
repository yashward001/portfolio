'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/* ─── Types ───────────────────────────────────────────────────────────────── */
type Track = {
  name: string;
  artists: string;
  album: string;
  albumArt: string | null;
  releaseYear: string;
  addedAt: string;
  durationMs: number;
  spotifyUrl: string | null;
  explicit: boolean;
};

type PlaylistData = {
  name: string;
  description: string;
  followers: number;
  totalTracks: number;
  coverImage: string | null;
  spotifyUrl: string | null;
  tracks: Track[];
  error?: string;
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1200, active = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

function groupByYear(tracks: Track[]) {
  const sorted = [...tracks].sort(
    (a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
  );
  const groups: { year: string; tracks: Track[] }[] = [];
  for (const track of sorted) {
    const year = new Date(track.addedAt).getFullYear().toString();
    const last = groups[groups.length - 1];
    if (last?.year === year) {
      last.tracks.push(track);
    } else {
      groups.push({ year, tracks: [track] });
    }
  }
  return groups;
}

function getTopArtists(tracks: Track[], n = 8) {
  const counts: Record<string, number> = {};
  for (const track of tracks) {
    for (const artist of track.artists.split(', ')) {
      counts[artist] = (counts[artist] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

function getRecentTracks(tracks: Track[], n = 10) {
  return [...tracks]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, n);
}

/* ─── Loading state ───────────────────────────────────────────────────────── */
const LOADING_STEPS = [
  'root@yst:~$ curl api.spotify.com/playlist/4H0JmExp...',
  '> connecting...',
  '> fetching 50 tracks...',
  '> building timeline...',
];

function LoadingState() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= LOADING_STEPS.length - 1) return;
    const id = setTimeout(() => setStep((s) => s + 1), 600);
    return () => clearTimeout(id);
  }, [step]);
  return (
    <div className="space-y-1.5 px-6 py-14 font-mono text-xs text-[#00aa44]">
      {LOADING_STEPS.slice(0, step + 1).map((line, i) => (
        <p key={i} className={i === 0 ? 'text-[#00ff41]' : ''}>{line}</p>
      ))}
    </div>
  );
}

/* ─── Unconfigured / error state ──────────────────────────────────────────── */
function UnconfiguredState() {
  return (
    <div className="space-y-1.5 px-6 py-14 font-mono text-xs text-[#004d1a]">
      <p className="text-[#00aa44]">&gt; SPOTIFY_CLIENT_ID not configured.</p>
      <p>&gt; Add credentials to .env.local to enable this section.</p>
      <p>&gt; See /app/api/spotify/route.ts for setup instructions.</p>
    </div>
  );
}

/* ─── ASCII music note placeholder ───────────────────────────────────────── */
function MusicNotePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0a0f0a] text-[#003d0f]">
      <pre className="font-mono text-xs leading-tight select-none">{`
  ♩♩♩♩♩♩♩♩
  ♫       ♫
  ♫  ♪♪♪  ♫
  ♫ ♪   ♪ ♫
  ♫  ♪♪♪  ♫
  ♫       ♫
  ♩♩♩♩♩♩♩♩`}</pre>
    </div>
  );
}

/* ─── Track card (in timeline) ────────────────────────────────────────────── */
function TrackCard({ track, index }: { track: Track; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="relative inline-flex w-[108px] shrink-0 flex-col gap-1.5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.018, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Album art */}
      <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden">
        {track.albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.albumArt}
            alt={track.album}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#0a0f0a] text-[#003d0f] font-mono text-[10px]">
            ♪
          </div>
        )}
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
          }}
        />
      </div>

      {/* Track info */}
      <div className="min-w-0">
        <p className="truncate font-mono text-[9px] text-white/80 leading-tight">
          {track.name.length > 14 ? track.name.slice(0, 13) + '…' : track.name}
        </p>
        <p className="truncate font-mono text-[8px] text-[#00aa44] leading-tight">
          {track.artists.length > 14 ? track.artists.slice(0, 13) + '…' : track.artists}
        </p>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-48 border border-[#003d0f] bg-black p-2.5 font-mono text-[9px] shadow-[0_0_20px_rgba(0,255,65,0.08)]">
          <p className="mb-1 text-[#00ff41] leading-snug">{track.name}</p>
          <p className="text-[#00aa44]">{track.artists}</p>
          <p className="text-[#003d0f] mt-0.5">{track.album}</p>
          {track.spotifyUrl && (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 block text-[#33ff66] hover:text-[#00ff41]"
            >
              [OPEN ▶]
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Year divider ────────────────────────────────────────────────────────── */
function YearDivider({ year }: { year: string }) {
  return (
    <div className="inline-flex shrink-0 items-center self-start pt-1">
      <span className="font-mono text-[9px] text-[#003d0f] whitespace-nowrap pr-2">
        ━━[ {year} ]━━
      </span>
    </div>
  );
}

/* ─── Artist card ─────────────────────────────────────────────────────────── */
function ArtistCard({ artist, count, rank }: { artist: string; count: number; rank: number }) {
  const isTop = rank === 0;
  return (
    <div
      className={`relative border p-3 transition-colors hover:border-[#00ff41] ${
        isTop
          ? 'border-[#00ff41] shadow-[0_0_12px_rgba(0,255,65,0.08)]'
          : 'border-[#003d0f]'
      }`}
    >
      {isTop && (
        <span className="absolute right-2 top-2 font-mono text-[8px] uppercase tracking-widest text-[#00ff41]">
          [TOP]
        </span>
      )}
      <p className={`font-mono text-[10px] font-bold uppercase tracking-wide leading-tight ${isTop ? 'text-[#00ff41]' : 'text-white/80'}`}>
        {artist}
      </p>
      <p className="mt-1 font-mono text-[9px] text-[#00aa44]">── {count} track{count !== 1 ? 's' : ''}</p>
    </div>
  );
}

/* ─── Recent additions marquee ────────────────────────────────────────────── */
function RecentTicker({ tracks }: { tracks: Track[] }) {
  const text = tracks
    .map((t) => `♪ ${t.name} — ${t.artists}`)
    .join('  ·  ') + '  ·  ';

  return (
    <div className="overflow-hidden border-t border-[#003d0f] py-3">
      <div className="flex">
        <span
          className="shrink-0 whitespace-nowrap font-mono text-[10px] tracking-[0.08em] text-[#004d1a] hover:[animation-play-state:paused]"
          style={{
            animation: 'music-ticker 40s linear infinite',
            display: 'inline-block',
          }}
        >
          {text}{text}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export function MusicShowcase() {
  const [data, setData] = useState<PlaylistData | null>(null);
  const [status, setStatus] = useState<'loading' | 'unconfigured' | 'error' | 'ready'>('loading');
  const statsVisible = status === 'ready';

  const trackCount  = useCountUp(data?.totalTracks ?? 0, 1000, statsVisible);
  const followers   = useCountUp(data?.followers   ?? 0, 1200, statsVisible);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res  = await fetch('/api/spotify');
        const json = await res.json() as PlaylistData;
        if (json.error === 'not_configured') {
          setStatus('unconfigured');
        } else if (json.error) {
          setStatus('error');
        } else {
          setData(json);
          setStatus('ready');
        }
      } catch {
        setStatus('error');
      }
    };
    // Small delay so loading UI plays at least one step
    const id = setTimeout(fetchData, 800);
    return () => clearTimeout(id);
  }, []);

  const playlistId = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID ?? '4H0JmExp8mxfWXM0TMxJ9s';

  if (status === 'loading') return <LoadingState />;
  if (status === 'unconfigured') return <UnconfiguredState />;
  if (status === 'error') {
    return (
      <div className="px-6 py-14 font-mono text-xs text-[#004d1a]">
        <p className="text-[#ff4444]">&gt; Error connecting to Spotify API.</p>
        <p>&gt; Check credentials in Vercel environment variables.</p>
      </div>
    );
  }

  const yearGroups  = groupByYear(data!.tracks);
  const topArtists  = getTopArtists(data!.tracks);
  const recentTracks = getRecentTracks(data!.tracks);
  const startYear   = yearGroups[0]?.year ?? '—';

  return (
    <section className="border-b border-[#003d0f]">
      {/* ── PANEL A: Playlist Hero ────────────────────────────────────────── */}
      <div className="grid gap-8 border-b border-[#003d0f] px-6 py-14 lg:grid-cols-[1fr_200px]">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00aa44]">
            &gt; INTERESTS.exe
          </p>

          <div>
            <h2
              className="font-mono text-3xl font-bold uppercase tracking-[0.1em] text-white sm:text-4xl"
              style={{ textShadow: '0 0 24px rgba(0,255,65,0.2)' }}
            >
              NOT JUST CODE.
            </h2>
            <p className="mt-2 font-mono text-sm text-[#33ff66]">
              4+ years of curating one playlist.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 font-mono text-xs">
            {[
              { label: 'TRACKS',    value: trackCount },
              { label: 'FOLLOWERS', value: followers  },
              { label: 'STARTED',   value: `~${startYear}`, raw: true },
            ].map(({ label, value, raw }) => (
              <div key={label} className="space-y-0.5">
                <p className="text-[9px] uppercase tracking-widest text-[#003d0f]">{label}</p>
                <p className="text-base font-bold text-[#00ff41]">
                  {raw ? value : String(value).padStart(3, '0')}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          {data!.spotifyUrl && (
            <a
              href={data!.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#00ff41] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-black"
            >
              OPEN ON SPOTIFY ↗
            </a>
          )}
        </motion.div>

        {/* Right — cover image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[200px] w-[200px] overflow-hidden self-start shadow-[0_0_40px_rgba(0,255,65,0.12)]"
          style={{ border: '1px solid #003d0f' }}
        >
          {data!.coverImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data!.coverImage}
                alt={data!.name}
                className="h-full w-full object-cover"
              />
              {/* Scanline effect */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 6px)',
                }}
              />
              {/* Green tint overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[#00ff41]/5" />
            </>
          ) : (
            <MusicNotePlaceholder />
          )}
        </motion.div>
      </div>

      {/* ── PANEL B: Track Timeline ───────────────────────────────────────── */}
      <div className="border-b border-[#003d0f] px-6 py-12">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00aa44]">
          root@yst:~$ git log --playlist
        </p>

        {/* Horizontal scroll container */}
        <div
          className="overflow-x-auto pb-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#003d0f #000',
          }}
        >
          <div className="flex items-start gap-4 w-max">
            {yearGroups.map((group) => (
              <div key={group.year} className="flex items-start gap-3">
                <YearDivider year={group.year} />
                {group.tracks.map((track, i) => (
                  <TrackCard
                    key={`${track.addedAt}-${i}`}
                    track={track}
                    index={i}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PANEL C: Top Artists ──────────────────────────────────────────── */}
      <div className="border-b border-[#003d0f] px-6 py-12">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00aa44]">
          &gt; TOP_ARTISTS.json
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {topArtists.map(([artist, count], i) => (
            <motion.div
              key={artist}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ArtistCard artist={artist} count={count} rank={i} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── RECENT ADDITIONS TICKER ───────────────────────────────────────── */}
      <RecentTicker tracks={recentTracks} />

      {/* ── SPOTIFY EMBED ─────────────────────────────────────────────────── */}
      <div className="px-6 pb-12 pt-8">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#003d0f]">
          &gt; SPOTIFY_EMBED // interactive player
        </p>
        <iframe
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ border: 'none' }}
          title="Spotify playlist embed"
        />
      </div>
    </section>
  );
}
