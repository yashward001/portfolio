'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const LINES = [
  "root@yst:~$ ssh yash@classified.systems",
  "Connecting to classified.systems...",
  "Authentication successful.",
  "",
  `Last login: ${new Date().toUTCString()}`,
  "",
  "  ██╗   ██╗ █████╗ ███████╗██╗  ██╗",
  "  ╚██╗ ██╔╝██╔══██╗██╔════╝██║  ██║",
  "   ╚████╔╝ ███████║███████╗███████║",
  "    ╚██╔╝  ██╔══██║╚════██║██╔══██║",
  "     ██║   ██║  ██║███████║██║  ██║",
  "",
  '  "The fact that you found this page means',
  "   you're the kind of engineer I want to",
  '   work with."',
  "",
  "  → Email:    yashwardhansingh.tomar@outlook.com",
  "  → GitHub:   github.com/yashward001",
  "  → LinkedIn: linkedin.com/in/yashwardhan-singh-tomar",
  "",
  "root@classified:~$ █",
];

export default function SecretPage() {
  const [shown, setShown] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i >= LINES.length) return;
      setShown((prev) => [...prev, LINES[i]]);
      i++;
      setTimeout(tick, i < 3 ? 180 : i < 6 ? 120 : 60);
    };
    const id = setTimeout(tick, 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-black px-6 py-16 font-mono">
      <title>classified.systems | access granted</title>
      <div className="mx-auto max-w-2xl space-y-1">
        {shown.map((line, i) => (
          <p
            key={i}
            className={`text-sm leading-relaxed ${
              line.startsWith('  ██') || line.startsWith('  ╚') || line.startsWith('   ╚') || line.startsWith('    ╚') || line.startsWith('     ██')
                ? 'text-[#00ff41]'
                : line.startsWith('root@')
                ? 'text-[#00aa44]'
                : line.startsWith('Connecting') || line.startsWith('Authentication') || line.startsWith('Last')
                ? 'text-[#33ff66]'
                : line.startsWith('  →')
                ? 'text-white/80'
                : line.startsWith('  "') || line.startsWith("   you") || line.startsWith('   work')
                ? 'text-white/70 italic'
                : 'text-[#33ff66]'
            }`}
          >
            {line || '\u00a0'}
          </p>
        ))}
      </div>

      {shown.length === LINES.length && (
        <div className="mx-auto mt-12 max-w-2xl">
          <Link
            href="/"
            className="font-mono text-xs text-[#006622] transition-colors hover:text-[#00ff41]"
          >
            [← return to surface web]
          </Link>
        </div>
      )}
    </div>
  );
}
