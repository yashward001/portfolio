type SectionTitleProps = {
  overline?: string;
  title: string;
  description?: string;
};

export const SectionTitle = ({ overline, title, description }: SectionTitleProps) => {
  return (
    <div className="space-y-2">
      {overline ? <p className="text-xs uppercase tracking-[0.2em] text-accent">{overline}</p> : null}
      <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{title}</h2>
      {description ? <p className="max-w-2xl text-muted">{description}</p> : null}
    </div>
  );
};
