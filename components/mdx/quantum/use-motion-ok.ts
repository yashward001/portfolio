'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * `false` during SSR and the first client render, then whether motion is allowed.
 * Deciding after mount keeps server and client markup identical.
 */
export const useMotionOk = () => {
  const reduce = useReducedMotion();
  const [state, setState] = useState<{ mounted: boolean; ok: boolean }>({
    mounted: false,
    ok: false
  });
  useEffect(() => setState({ mounted: true, ok: !reduce }), [reduce]);
  return state;
};

export const EASE = [0.22, 1, 0.36, 1] as const;
