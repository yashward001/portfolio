import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl space-y-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className="font-display text-4xl">Page not found</h1>
      <p className="text-muted">The page you requested does not exist.</p>
      <Link href="/" className="focus-ring inline-block rounded-lg border border-border px-4 py-2 text-sm hover:text-accent">
        Back home
      </Link>
    </section>
  );
}
