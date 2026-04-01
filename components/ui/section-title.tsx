type SectionTitleProps = {
  overline?: string;
  title: string;
  description?: string;
};

export const SectionTitle = ({ overline, title, description }: SectionTitleProps) => {
  return (
    <div className="space-y-1.5">
      {overline ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#006622]">
          {overline}
        </p>
      ) : null}
      <h2 className="font-mono text-xl font-bold uppercase tracking-wide text-[#00ff41] sm:text-2xl" style={{ textShadow: '0 0 12px rgba(0,255,65,0.4)' }}>
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl font-mono text-xs text-[#006622]">{description}</p>
      ) : null}
    </div>
  );
};
