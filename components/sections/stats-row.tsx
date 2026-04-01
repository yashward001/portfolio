import { profile } from '@/content/profile';

/** Fill a label line with dots up to `width` total chars, then append the value */
function dotFill(label: string, value: string, width = 36): string {
  const dots = width - label.length - value.length;
  return label + '.'.repeat(Math.max(1, dots)) + value;
}

export const StatsRow = () => {
  const lines = profile.stats.map((s) => dotFill(s.label.toUpperCase(), s.value));
  const inner = 40; // characters inside the box

  const pad = (str: string) => str + ' '.repeat(Math.max(0, inner - str.length));

  return (
    <section aria-label="Statistics">
      <pre className="inline-block font-mono text-sm text-[#00cc33] leading-relaxed">
        <span className="text-[#003d0f]">{'┌' + '─'.repeat(inner + 2) + '┐'}</span>{'\n'}
        {lines.map((line) => (
          <span key={line}>
            <span className="text-[#003d0f]">│ </span>
            <span className="text-[#00ff41]">{pad(line)}</span>
            <span className="text-[#003d0f]"> │</span>
            {'\n'}
          </span>
        ))}
        <span className="text-[#003d0f]">{'└' + '─'.repeat(inner + 2) + '┘'}</span>
      </pre>
    </section>
  );
};
