'use client';

import { useEffect, useState } from 'react';

import { BentoCard } from '@/components/home/bento-cards';

type Playlist = {
  name: string;
  totalTracks: number;
  coverImage: string | null;
  spotifyUrl: string | null;
  trackCovers?: string[];
};

const FALLBACK_ID = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID;
const FALLBACK_URL = FALLBACK_ID
  ? `https://open.spotify.com/playlist/${FALLBACK_ID}`
  : null;

const Cover = ({
  src,
  className
}: {
  src?: string | null;
  className: string;
}) => (
  <span
    className={`absolute overflow-hidden rounded-2xl shadow-card ring-[3px] ring-white ${className}`}
  >
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
    ) : (
      <span className="block h-full w-full bg-[linear-gradient(135deg,#1db954_0%,#0f5132_100%)]" />
    )}
  </span>
);

export const PlaylistCard = ({
  className,
  wave = 0
}: {
  className?: string;
  wave?: number;
}) => {
  const [data, setData] = useState<Playlist | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/spotify')
      .then((r) => (r.ok ? r.json() : null))
      .then((json: Playlist | null) => {
        if (!cancelled && json && !('error' in json)) setData(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const url = data?.spotifyUrl ?? FALLBACK_URL;
  const [left, right] = data?.trackCovers ?? [];

  return (
    <BentoCard
      label="My playlist"
      wave={wave}
      className={`group h-[272px] ${className ?? ''}`}
    >
      <div aria-hidden className="relative mx-auto mt-12 h-[136px] w-full">
        <Cover
          src={left}
          className="left-[8%] top-6 h-24 w-24 -rotate-[10deg] opacity-90 transition duration-500 group-hover:-translate-x-1 group-hover:-rotate-[14deg]"
        />
        <Cover
          src={right}
          className="right-[8%] top-6 h-24 w-24 rotate-[10deg] opacity-90 transition duration-500 group-hover:translate-x-1 group-hover:rotate-[14deg]"
        />
        <Cover
          src={data?.coverImage}
          className="left-1/2 top-2 z-10 h-[112px] w-[112px] -translate-x-1/2 transition duration-500 group-hover:-translate-y-1"
        />
      </div>
      <div className="mt-auto pb-5 text-center">
        <p className="truncate px-4 text-[15px] font-medium">
          {data?.name ?? 'On repeat'}
        </p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="focus-ring mt-0.5 inline-flex items-center gap-1 rounded text-xs text-muted hover:text-fg"
          >
            <span aria-hidden className="flex h-3 items-end gap-[2px]">
              {[0, 0.25, 0.5, 0.15].map((d) => (
                <span
                  key={d}
                  className="eq-bar h-full w-[2.5px] rounded-full bg-[#1db954]"
                  style={{ animationDelay: `${-d}s` }}
                />
              ))}
            </span>
            Play on Spotify
            {data?.totalTracks ? (
              <span className="text-subtle">· {data.totalTracks} tracks</span>
            ) : null}
          </a>
        ) : (
          <p className="mt-0.5 text-xs text-subtle">Curated since 2021</p>
        )}
      </div>
    </BentoCard>
  );
};
