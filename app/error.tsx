'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-6">
      <h2 className="font-display text-2xl">Something went wrong</h2>
      <p className="text-sm text-muted">{error.message}</p>
      <button type="button" className="focus-ring rounded-lg border border-border px-4 py-2 text-sm" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
