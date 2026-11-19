'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="card mx-auto max-w-md space-y-4 p-8 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted">
        An unexpected error occurred while loading this page.
      </p>
      <button type="button" className="btn-primary focus-ring" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
