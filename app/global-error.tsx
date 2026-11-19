'use client';

export default function GlobalError({
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          background: '#f5f5f3',
          color: '#121212',
          padding: 48
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>Something went wrong</h1>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 16,
            padding: '12px 22px',
            borderRadius: 999,
            background: '#121212',
            color: '#fff',
            border: 0
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
