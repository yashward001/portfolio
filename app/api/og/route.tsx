import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Yashwardhan Singh Tomar';

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#f5f5f3',
        color: '#121212',
        padding: 72
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 6,
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: -2
        }}
      >
        yst
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: '#e8600f',
            marginBottom: 10
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 76,
          fontWeight: 600,
          lineHeight: 1.08,
          letterSpacing: -3,
          maxWidth: '90%'
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 28,
          color: '#666666'
        }}
      >
        <span>Yashwardhan Singh Tomar</span>
        <span style={{ color: '#e8600f' }}>AI engineer · NTU Singapore</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630
    }
  );
}
