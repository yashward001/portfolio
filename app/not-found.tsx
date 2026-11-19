import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-md space-y-5 py-16 text-center">
      <span className="card-label">404</span>
      <h1 className="text-4xl font-semibold tracking-[-0.03em]">
        Page not found
      </h1>
      <p className="text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn-primary focus-ring">
        Back home
      </Link>
    </section>
  );
}
