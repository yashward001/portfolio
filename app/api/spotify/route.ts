// SETUP REQUIRED:
// 1. Go to developer.spotify.com/dashboard → Create App
// 2. Set redirect URI to http://localhost:3000 (for dev)
// 3. Copy Client ID and Client Secret
// 4. Add to .env.local:
//    SPOTIFY_CLIENT_ID=your_client_id
//    SPOTIFY_CLIENT_SECRET=your_client_secret
//    SPOTIFY_PLAYLIST_ID=4H0JmExp8mxfWXM0TMxJ9s
//    NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID=4H0JmExp8mxfWXM0TMxJ9s
// 5. Add same vars to Vercel dashboard → Settings → Environment Variables
//
// NOTE: Audio Features / Recommendations are deprecated for new apps (Nov 2024).
// This route only uses playlist metadata + track info, which are still available.

const getAccessToken = async (): Promise<string> => {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('No access token returned');
  return data.access_token;
};

export async function GET() {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    return Response.json({ error: 'not_configured' }, { status: 503 });
  }

  const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
  if (!playlistId) {
    return Response.json({ error: 'not_configured' }, { status: 503 });
  }

  try {
    const token = await getAccessToken();

    const [playlistRes, tracksRes] = await Promise.all([
      fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}?fields=name,description,followers,images,tracks.total,external_urls`,
        { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50&fields=items(added_at,track(name,artists,album(name,images,release_date),duration_ms,external_urls,explicit))`,
        { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } }
      ),
    ]);

    const [playlist, tracksData] = await Promise.all([
      playlistRes.json(),
      tracksRes.json(),
    ]);

    return Response.json({
      name: playlist.name,
      description: playlist.description,
      followers: playlist.followers?.total ?? 0,
      totalTracks: playlist.tracks?.total ?? 0,
      coverImage: playlist.images?.[0]?.url ?? null,
      spotifyUrl: playlist.external_urls?.spotify ?? null,
      tracks: (tracksData.items ?? [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => item?.track)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ({
          name: item.track.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          artists: item.track.artists.map((a: any) => a.name).join(', '),
          album: item.track.album.name,
          albumArt: item.track.album.images?.[1]?.url ?? item.track.album.images?.[0]?.url ?? null,
          releaseYear: item.track.album.release_date?.split('-')[0] ?? '',
          addedAt: item.added_at,
          durationMs: item.track.duration_ms,
          spotifyUrl: item.track.external_urls?.spotify ?? null,
          explicit: item.track.explicit,
        })),
    });
  } catch {
    return Response.json({ error: 'fetch_failed' }, { status: 500 });
  }
}
