import { profile } from '@/content/profile';

export const Timeline = () => {
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {profile.timeline.map((item) => (
        <li key={`${item.title}-${item.org}`} className="relative">
          <span className="absolute -left-[30px] top-2 h-3 w-3 rounded-full border border-accent bg-bg" aria-hidden />
          <p className="text-xs uppercase tracking-wide text-muted">
            {item.start} - {item.end}
          </p>
          <h3 className="font-display text-lg">{item.title}</h3>
          <p className="text-sm text-accent">{item.org}</p>
          <p className="mt-2 text-sm text-muted">{item.detail}</p>
        </li>
      ))}
    </ol>
  );
};
