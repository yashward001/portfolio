'use client';

import { useEffect, useState } from 'react';

const HERO_LINES = [
  'root@yst:~$ cat profile.txt',
  '',
  '> I design intelligent systems',
  '> and ship polished software products.',
];

const CHAR_DELAY = 28; // ms per character
const LINE_PAUSE = 320; // ms pause after each line

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const KineticHeadline = ({ text }: { text: string }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine]     = useState(0);
  const [currentChar, setCurrentChar]     = useState(0);
  const [done, setDone]                   = useState(false);

  useEffect(() => {
    if (currentLine >= HERO_LINES.length) {
      setDone(true);
      return;
    }

    const line = HERO_LINES[currentLine];

    if (currentChar < line.length) {
      const t = setTimeout(() => setCurrentChar((c) => c + 1), CHAR_DELAY);
      return () => clearTimeout(t);
    }

    // finished this line — pause then move to next
    const t = setTimeout(() => {
      setDisplayedLines((prev) => [...prev, line]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, LINE_PAUSE);
    return () => clearTimeout(t);
  }, [currentLine, currentChar]);

  const inProgressLine = currentLine < HERO_LINES.length
    ? HERO_LINES[currentLine].slice(0, currentChar)
    : '';

  const lineClass = (line: string | undefined) => {
    if (!line) return 'block h-4';
    if (line.startsWith('root@')) return 'block text-[#006622]';
    if (line.startsWith('>'))     return 'block text-white text-2xl sm:text-4xl font-bold tracking-tight';
    return 'block text-[#33ff66]';
  };

  const currentLineInBounds = currentLine < HERO_LINES.length;

  return (
    <div className="font-mono" aria-label="I design intelligent systems and ship polished software products.">
      <pre className="whitespace-pre-wrap text-base leading-relaxed sm:text-lg">
        {displayedLines.map((line, i) => (
          <span key={i} className={lineClass(line)}>
            {line}
          </span>
        ))}
        {!done && currentLineInBounds && (
          <span className={lineClass(inProgressLine || HERO_LINES[currentLine])}>
            {inProgressLine}
            <span className="animate-blink">█</span>
          </span>
        )}
        {done && <span className="animate-blink text-[#00ff41]">█</span>}
      </pre>
    </div>
  );
};
