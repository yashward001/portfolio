import type { ReactNode } from 'react';

export const PageHeader = ({
  label,
  title,
  children
}: {
  label: string;
  title: ReactNode;
  children?: ReactNode;
}) => (
  <header className="space-y-5">
    <span className="card-label">{label}</span>
    <h1 className="text-[clamp(2.25rem,6vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
      {title}
    </h1>
    {children ? (
      <div className="max-w-2xl text-[17px] leading-relaxed text-muted">
        {children}
      </div>
    ) : null}
  </header>
);
