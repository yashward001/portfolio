import { profile } from '@/content/profile';

/** Convert "Mon YYYY" → "[YYYY-MM]" for log-style display */
function toLogDate(start: string): string {
  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };
  const [mon, yr] = start.split(' ');
  if (!yr) return `[${start.toUpperCase()}]`;
  return `[${yr}-${months[mon] ?? '??'}]`;
}

/** Dot-fill between org name and role title */
function dotFill(org: string, role: string, width = 50): string {
  const dots = Math.max(3, width - org.length - role.length);
  return org + ' ' + '.'.repeat(dots) + ' ' + role;
}

export const Timeline = () => {
  /* Reverse so oldest → newest on screen */
  const items = [...profile.timeline].reverse();

  return (
    <ol className="space-y-5 font-mono">
      {items.map((item) => {
        const isEdu = item.org.includes('University') || item.org.includes('NTU');
        const details = item.detail.split(';').map((d) => d.trim()).filter(Boolean);

        return (
          <li key={`${item.title}-${item.org}`} className="space-y-1">
            {/* Date + org + role header */}
            <p className="text-[11px] text-[#006622]">
              <span className="text-[#00ff41]">{toLogDate(item.start)}</span>
              {' '}
              <span className={isEdu ? 'text-[#004d1a]' : 'text-[#00cc33]'}>
                {dotFill(item.org, item.title)}
              </span>
            </p>

            {/* Detail bullet lines */}
            {details.map((d, i) => (
              <p key={i} className="pl-11 text-[11px] text-[#006622]">
                <span className="text-[#003d0f]">└─ </span>
                {d.replace(/\(India.*?\)/, '').trim()}
              </p>
            ))}

            {/* Period */}
            <p className="pl-11 text-[10px] text-[#004d1a]">
              {item.start} → {item.end}
            </p>
          </li>
        );
      })}
    </ol>
  );
};
