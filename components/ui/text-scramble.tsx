'use client';
// Adapted from 21st.dev TextScramble component
import { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*_-+=[]<>/\\|';

export function TextScramble({
  text,
  className = '',
  delay = 0,
  speed = 30,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const [display, setDisplay] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const interval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timer.current = setTimeout(() => {
      const steps = text.length * 3;
      let step = 0;
      interval.current = setInterval(() => {
        const progress = step / steps;
        const revealed = Math.floor(progress * text.length);
        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (i < revealed) return text[i];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join(''),
        );
        step++;
        if (step > steps) {
          clearInterval(interval.current);
          setDisplay(text);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timer.current);
      clearInterval(interval.current);
    };
  }, [text, delay, speed]);

  return <span className={className}>{display}</span>;
}
