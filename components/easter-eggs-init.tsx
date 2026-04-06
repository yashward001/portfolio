'use client';

import { useEffect } from 'react';
import { initEasterEggs } from '@/lib/easter-eggs';

export function EasterEggsInit() {
  useEffect(() => {
    initEasterEggs();
  }, []);
  return null;
}
