type Variant = 'pipeline' | 'ml' | 'product';

const labels: Record<Variant, string[]> = {
  pipeline: ['Ingress', 'Kafka', 'Workers', 'Storage'],
  ml: ['ETL', 'Feature Store', 'Training', 'Serving'],
  product: ['SDK/API', 'Ingestion', 'Query Layer', 'Dashboard']
};

export const ArchitectureDiagram = ({
  title,
  variant
}: {
  title: string;
  variant: Variant;
}) => {
  const nodes = labels[variant];

  return (
    <figure className="card not-prose my-8 p-5">
      <figcaption className="mb-4 text-xs font-medium text-subtle">
        {title}
      </figcaption>
      <svg
        viewBox="0 0 760 120"
        role="img"
        aria-label={`${title}: ${nodes.join(' → ')}`}
        className="w-full"
      >
        {nodes.map((node, index) => {
          const x = 10 + index * 190;
          return (
            <g key={node}>
              <rect
                x={x}
                y="25"
                width="160"
                height="70"
                rx="18"
                fill="hsl(var(--bg))"
                stroke="hsl(var(--border))"
              />
              <text
                x={x + 80}
                y="65"
                textAnchor="middle"
                fill="hsl(var(--fg))"
                fontSize="15"
                fontWeight="500"
                fontFamily="var(--font-sans)"
              >
                {node}
              </text>
              {index < nodes.length - 1 ? (
                <g
                  stroke="hsl(var(--accent))"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1={x + 166} y1="60" x2={x + 184} y2="60" />
                  <polyline
                    points={`${x + 179},55 ${x + 184},60 ${x + 179},65`}
                    fill="none"
                  />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
};
