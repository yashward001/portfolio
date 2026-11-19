export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-28 animate-pulse rounded-full bg-black/[0.06]" />
      <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-black/[0.06]" />
      <div className="h-5 w-1/2 animate-pulse rounded-full bg-black/[0.06]" />
    </div>
  );
}
