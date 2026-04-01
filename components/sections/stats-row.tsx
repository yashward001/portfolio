import { profile } from '@/content/profile';

export const StatsRow = () => {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {profile.stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-border bg-card/85 p-4">
          <p className="text-2xl font-display">{stat.value}</p>
          <p className="text-sm text-muted">{stat.label}</p>
        </div>
      ))}
    </section>
  );
};
