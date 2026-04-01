'use client';

import { useEffect, useState } from 'react';

export const TerminalCursor = () => {
  const [pos, setPos] = useState({ x: -80, y: -80 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const hide = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', hide);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[9999] select-none"
      style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
    >
      {/* crosshair horizontal */}
      <div className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-[#00ff41]" />
      {/* crosshair vertical */}
      <div className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-[#00ff41]" />
      {/* center dot */}
      <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-[#00ff41]" />
      {/* outer glow ring */}
      <div
        className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 border border-[#00ff41]"
        style={{ boxShadow: '0 0 6px rgba(0,255,65,0.6)' }}
      />
    </div>
  );
};
