'use client';

import { useEffect, useRef, type ElementType, type ComponentPropsWithoutRef } from 'react';

type SpotlightCardProps<T extends ElementType = 'div'> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

export function SpotlightCard<T extends ElementType = 'div'>({
  as,
  className = '',
  children,
  ...rest
}: SpotlightCardProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--left', String(rect.left));
      el.style.setProperty('--top',  String(rect.top));
      el.style.setProperty('--w',    String(rect.width));
      el.style.setProperty('--h',    String(rect.height));
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('scroll', update, { passive: true });
    update();

    const onMove = (e: PointerEvent) => {
      if (!ref.current) return;
      ref.current.style.setProperty('--x',  String(e.clientX));
      ref.current.style.setProperty('--y',  String(e.clientY));
      ref.current.style.setProperty('--xp', `${(e.clientX / window.innerWidth)  * 100}%`);
      ref.current.style.setProperty('--yp', `${(e.clientY / window.innerHeight) * 100}%`);
    };

    window.addEventListener('pointermove', onMove);

    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      data-glow
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
