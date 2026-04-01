type Variant = 'pipeline' | 'ml' | 'product';

const labels: Record<Variant, string[]> = {
  pipeline: ['Ingress', 'Kafka', 'Workers', 'Storage'],
  ml: ['ETL', 'Feature Store', 'Training', 'Serving'],
  product: ['SDK/API', 'Ingestion', 'Query Layer', 'Dashboard']
};

export const ArchitectureDiagram = ({ title, variant }: { title: string; variant: Variant }) => {
  const nodes = labels[variant];

  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-border bg-card p-4">
      <figcaption className="mb-3 text-sm font-medium text-muted">{title}</figcaption>
      <svg viewBox="0 0 760 160" role="img" aria-label={title} className="w-full">
        {nodes.map((node, index) => {
          const x = 20 + index * 185;
          return (
            <g key={node}>
              <rect x={x} y="40" width="160" height="70" rx="12" fill="hsl(var(--bg))" stroke="hsl(var(--border))" />
              <text x={x + 80} y="80" textAnchor="middle" fill="hsl(var(--fg))" fontSize="14" fontFamily="ui-monospace">
                {node}
              </text>
              {index < nodes.length - 1 ? (
                <line x1={x + 160} y1="75" x2={x + 185} y2="75" stroke="hsl(var(--accent))" strokeWidth="2" />
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
};
