'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-bg p-8 text-fg">
        <h1 className="font-display text-3xl">Application error</h1>
        <p className="mt-3 text-muted">{error.message}</p>
        <button type="button" className="focus-ring mt-4 rounded-lg border border-border px-4 py-2" onClick={reset}>
          Retry
        </button>
      </body>
    </html>
  );
}
