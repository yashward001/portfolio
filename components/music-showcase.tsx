'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type PlaylistData = {
  name: string;
  followers: number;
  totalTracks: number;
  coverImage: string | null;
  spotifyUrl: string | null;
  error?: string;
};

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

export function MusicShowcase() {
  const [data, setData]     = useState<PlaylistData | null>(null);
  const [status, setStatus] = useState<'loading' | 'unconfigured' | 'error' | 'ready'>('loading');

  const ready      = status === 'ready';
  const trackCount = useCountUp(data?.totalTracks ?? 0, 1000, ready);
  const followers  = useCountUp(data?.followers   ?? 0, 1200, ready);

  useEffect(() => {
    fetch('/api/spotify')
      .then((r) => r.json())
      .then((json: PlaylistData) => {
        if (json.error === 'not_configured') setStatus('unconfigured');
        else if (json.error)                 setStatus('error');
        else { setData(json); setStatus('ready'); }
      })
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'loading')      return null;
  if (status === 'unconfigured') return null;
  if (status === 'error')        return null;

  return (
    <section className="border-b border-[#003d0f]">
      <div className="grid gap-8 px-6 py-14 lg:grid-cols-[1fr_200px]">

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
        </motion.div>

        {/* Right — cover image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[200px] w-[200px] self-start overflow-hidden"
          style={{ border: '1px solid #003d0f', boxShadow: '0 0 40px rgba(0,255,65,0.1)' }}
        >
          {data?.coverImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.coverImage} alt="playlist cover" className="h-full w-full object-cover" />
              {/* Scanline */}
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
            <div className="flex h-full w-full items-center justify-center bg-[#0a0f0a] font-mono text-4xl text-[#003d0f]">
              ♪
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
