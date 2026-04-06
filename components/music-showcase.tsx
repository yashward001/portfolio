'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Types ───────────────────────────────────────────────────────────────── */
type PlaylistData = {
  name: string;
  followers: number;
  totalTracks: number;
  coverImage: string | null;
  spotifyUrl: string | null;
  error?: string;
};

/* ─── Count-up hook ───────────────────────────────────────────────────────── */
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

/* ─── Spotify card ────────────────────────────────────────────────────────── */
function SpotifyCard() {
  const [data, setData]     = useState<PlaylistData | null>(null);
  const [ready, setReady]   = useState(false);

  const trackCount = useCountUp(data?.totalTracks ?? 0, 1000, ready);
  const followers  = useCountUp(data?.followers   ?? 0, 1200, ready);

  useEffect(() => {
    fetch('/api/spotify')
      .then((r) => r.json())
      .then((json: PlaylistData) => {
        if (!json.error) { setData(json); setReady(true); }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6 border border-[#003d0f] p-6"
    >
      {/* Label */}
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00aa44]">
        &gt; INTERESTS.exe
      </p>

      {/* Heading + subtitle */}
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

      {/* Stats */}
      <div className="flex flex-wrap gap-6 font-mono text-xs">
        {[
          { label: 'TRACKS',    value: String(trackCount).padStart(3, '0') },
          { label: 'FOLLOWERS', value: String(followers).padStart(3, '0')  },
          { label: 'STARTED',   value: '~2021'                              },
        ].map(({ label, value }) => (
          <div key={label} className="space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest text-[#003d0f]">{label}</p>
            <p className="text-base font-bold text-[#00ff41]">{value}</p>
          </div>
        ))}
      </div>

      {/* Cover image + button row */}
      <div className="flex items-end justify-between gap-4">
        {data?.spotifyUrl && (
          <a
            href={data.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#00ff41] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-black"
          >
            OPEN ON SPOTIFY ↗
          </a>
        )}

        {/* Cover art */}
        <div
          className="relative h-[88px] w-[88px] shrink-0 overflow-hidden"
          style={{ border: '1px solid #003d0f', boxShadow: '0 0 20px rgba(0,255,65,0.08)' }}
        >
          {data?.coverImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.coverImage} alt="playlist cover" className="h-full w-full object-cover" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.22) 3px,rgba(0,0,0,0.22) 6px)',
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-[#00ff41]/5" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0a0f0a] font-mono text-2xl text-[#003d0f]">
              ♪
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Crown jewel box ─────────────────────────────────────────────────────── */
function CrownJewelBox() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="crown-jewel-pulse relative h-[88px] w-[88px] overflow-hidden border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.ebayimg.com/images/g/keAAAOSwqCZmogO8/s-l1200.jpg"
          alt="Hot Wheels Premium '09 Porsche 911"
          className="h-full w-full object-cover"
        />
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.18) 3px,rgba(0,0,0,0.18) 6px)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[#00ff41]/5" />
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-[100] mt-1.5 w-56 border border-[#003d0f] bg-black p-3 font-mono text-[10px] leading-relaxed shadow-[0_0_20px_rgba(0,255,65,0.08)]"
          >
            <p className="text-[#00ff41]">&gt; Hot Wheels Premium · Car Culture Series</p>
            <p className="text-[#33ff66]">&gt; &apos;09 Porsche 911</p>
            <p className="text-[#00aa44]">&gt; 1:64 scale die-cast · Real Riders wheels</p>
            <p className="mt-1 text-[#004d1a]">The rarest piece in the collection.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Hot Wheels card ─────────────────────────────────────────────────────── */
function HotWheelsCard() {
  const [active, setActive] = useState(false);
  const cars  = useCountUp(300, 1000, active);
  const years = useCountUp(6,   800,  active);
  const crown = useCountUp(1,   600,  active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px', amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      onViewportEnter={() => setActive(true)}
      className="flex flex-col gap-6 border border-[#003d0f] p-6"
    >
      {/* Label */}
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00aa44]">
        &gt; COLLECTION.dat
      </p>

      {/* Heading + subtitle */}
      <div>
        <h2
          className="font-mono text-3xl font-bold uppercase tracking-[0.1em] text-white sm:text-4xl"
          style={{ textShadow: '0 0 24px rgba(0,255,65,0.2)' }}
        >
          300+ CARS.
        </h2>
        <p className="mt-2 font-mono text-sm text-[#33ff66]">
          6 years of hunting. One obsession.
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-6 font-mono text-xs">
        {[
          { label: 'CARS',        value: cars  === 300 ? '300+' : String(cars)  },
          { label: 'YEARS',       value: String(years)                           },
          { label: 'CROWN JEWEL', value: String(crown)                           },
        ].map(({ label, value }) => (
          <div key={label} className="space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest text-[#003d0f]">{label}</p>
            <p className="text-base font-bold text-[#00ff41]">{value}</p>
          </div>
        ))}
      </div>

      {/* Button + crown jewel art row */}
      <div className="flex items-end justify-between gap-4">
        <a
          href="#"
          className="inline-flex items-center gap-2 border border-[#00ff41] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#00ff41] transition-all hover:bg-[#00ff41] hover:text-black"
        >
          VIEW COLLECTION →
        </a>

        <div className="shrink-0">
          <CrownJewelBox />
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export function MusicShowcase() {
  return (
    <section className="border-b border-[#003d0f]">
      <div className="grid grid-cols-1 gap-6 px-6 py-14 lg:grid-cols-2">
        <SpotifyCard />
        <HotWheelsCard />
      </div>
    </section>
  );
}
