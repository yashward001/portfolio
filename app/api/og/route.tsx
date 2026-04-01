import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Yashwardhan Singh Tomar';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #082f49 100%)',
          color: '#e2e8f0',
          padding: 64
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 1 }}>Yashwardhan Singh Tomar • Portfolio</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, maxWidth: '86%' }}>{title}</div>
        <div style={{ fontSize: 26, opacity: 0.85 }}>Scalable systems. Product-focused engineering.</div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
