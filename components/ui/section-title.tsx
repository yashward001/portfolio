type SectionTitleProps = {
  overline?: string;
  title: string;
  description?: string;
};

export const SectionTitle = ({
  overline,
  title,
  description
}: SectionTitleProps) => (
  <div className="space-y-4">
    {overline ? <span className="card-label">{overline}</span> : null}
    <h1 className="text-[clamp(2.25rem,6vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
      {title}
    </h1>
    {description ? (
      <p className="max-w-2xl text-[17px] leading-relaxed text-muted">
        {description}
      </p>
    ) : null}
  </div>
);
