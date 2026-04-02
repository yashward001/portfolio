'use client';

import { useEffect, useRef, useState } from 'react';

import { SpotlightCard } from '@/components/ui/spotlight-card';

const STATS = [
  { label: '//INTERNSHIPS', value: '04',        numeric: 4,   suffix: '',    sub: 'industry roles'  },
  { label: '//PROJECTS',    value: '10+',       numeric: 10,  suffix: '+',   sub: 'major builds'    },
  { label: '//UPCOMING',    value: '01',        numeric: 1,   suffix: '',    sub: 'launches'        },
  { label: '//CGPA',        value: '4',         numeric: 4,   suffix: '',    sub: 'NTU scale'       },
] as const;

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const raf  = useRef<number>();
  const start = useRef<number>();

  useEffect(() => {
    start.current = undefined;

    function step(ts: number) {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    }

    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return count;
}

function StatPanel({
  label, numeric, suffix, sub,
}: { label: string; numeric: number; suffix: string; sub: string }) {
  const count = useCountUp(numeric, 1500);

  const display = `${String(count).padStart(2, '0')}${suffix}`;

  return (
    <SpotlightCard className="flex flex-col gap-4 border border-[#003d0f] p-6 transition-all duration-200 hover:border-[#00ff41] hover:shadow-[0_0_20px_rgba(0,255,65,0.15)]">
      <span
        className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#006622]"
        style={{ color: 'var(--text-muted, #006622)' }}
      >
        {label}
      </span>

      <span
        className="font-mono text-5xl font-bold leading-none text-white"
        style={{
          textShadow: '0 0 8px rgba(255,255,255,0.15)',
        }}
        aria-label={display}
      >
        {display}
      </span>

      <span
        className="font-mono text-[11px] text-[#006622]"
        style={{ color: 'var(--text-muted, #006622)' }}
      >
        {sub}
      </span>
    </SpotlightCard>
  );
}

function SystemStatusLine() {
  const [date, setDate] = useState('');

  useEffect(() => {
    const d = new Date();
    setDate(
      d.toISOString().split('T')[0]  // YYYY-MM-DD
    );
  }, []);

  return (
    <p
      className="font-mono text-[12px] text-[#006622] mb-8"
      style={{ color: 'var(--text-muted, #006622)' }}
    >
      system initialized. 4 modules loaded. uptime:{' '}
      <span className="text-[#00cc33]">{date || '…'}</span>
    </p>
  );
}

export const StatsRow = () => {
  return (
    <section aria-label="Statistics" className="space-y-0">
      <SystemStatusLine />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((s) => (
          <StatPanel
            key={s.label}
            label={s.label}
            numeric={s.numeric}
            suffix={s.suffix}
            sub={s.sub}
          />
        ))}
      </div>
    </section>
  );
};
