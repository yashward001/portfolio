'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/* Treats the cursor as a query token and every bento card as a key.
   Attention weights = softmax(-distance / τ). Each card glows by its weight, its label shows
   the live value, and bezier "attention heads" are drawn from the cursor to every card. */

const TAU = 140; // softmax temperature in px: lower = sharper focus
const ACCENT = '232, 96, 15';

type Anchor = {
  card: HTMLElement;
  value: HTMLElement | null;
  x: number;
  y: number;
  cx: number;
  cy: number;
};

export const AttentionField = ({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (!fine || reduce) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let anchors: Anchor[] = [];
    let weights: number[] = [];
    let targets: number[] = [];
    let cursor = { x: 0, y: 0 };
    let drawn = { x: 0, y: 0 };
    let inside = false;
    let raf = 0;
    let width = 0;
    let height = 0;

    const measure = () => {
      const box = root.getBoundingClientRect();
      width = box.width;
      height = box.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      anchors = Array.from(
        root.querySelectorAll<HTMLElement>('[data-attn-card]')
      ).map((card) => {
        const chip =
          card.querySelector<HTMLElement>('[data-attn-anchor]') ?? card;
        const c = chip.getBoundingClientRect();
        const k = card.getBoundingClientRect();
        return {
          card,
          value: card.querySelector<HTMLElement>('[data-attn-value]'),
          x: c.left - box.left + c.width / 2,
          y: c.top - box.top + c.height / 2,
          cx: k.left - box.left + k.width / 2,
          cy: k.top - box.top + k.height / 2
        };
      });
      if (weights.length !== anchors.length) {
        weights = anchors.map(() => 0);
        targets = anchors.map(() => 0);
      }
    };

    const computeTargets = () => {
      if (!inside) {
        targets = anchors.map(() => 0);
        return;
      }
      // distance to the card centre decides relevance; lines still land on the label chip
      const logits = anchors.map(
        (a) => -Math.hypot(a.cx - cursor.x, a.cy - cursor.y) / TAU
      );
      const max = Math.max(...logits);
      const exps = logits.map((l) => Math.exp(l - max));
      const sum = exps.reduce((s, e) => s + e, 0);
      targets = exps.map((e) => e / sum);
    };

    const frame = () => {
      computeTargets();
      let settled = true;
      weights = weights.map((w, i) => {
        const next = w + (targets[i] - w) * 0.14;
        if (Math.abs(next - targets[i]) > 0.002) settled = false;
        return next;
      });
      drawn.x += (cursor.x - drawn.x) * 0.25;
      drawn.y += (cursor.y - drawn.y) * 0.25;

      ctx.clearRect(0, 0, width, height);
      anchors.forEach((a, i) => {
        const w = weights[i];
        a.card.style.setProperty('--attn', w.toFixed(3));
        if (a.value)
          a.value.textContent = inside || w > 0.02 ? w.toFixed(2) : '';
        if (w < 0.01) return;

        const mx = (drawn.x + a.x) / 2;
        const my = (drawn.y + a.y) / 2;
        const dx = a.x - drawn.x;
        const dy = a.y - drawn.y;
        // bow each head sideways so overlapping lines fan out
        const bend = 0.22 * (i % 2 ? 1 : -1);
        const qx = mx - dy * bend;
        const qy = my + dx * bend;

        ctx.beginPath();
        ctx.moveTo(drawn.x, drawn.y);
        ctx.quadraticCurveTo(qx, qy, a.x, a.y);
        ctx.strokeStyle = `rgba(${ACCENT}, ${0.12 + w * 0.85})`;
        ctx.lineWidth = 0.6 + w * 3;
        ctx.setLineDash(w > 0.25 ? [] : [3, 4]);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(a.x, a.y, 2 + w * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT}, ${0.3 + w * 0.7})`;
        ctx.fill();
      });

      if (inside) {
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(drawn.x, drawn.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT}, 1)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(drawn.x, drawn.y, 11, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ACCENT}, 0.35)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (inside || !settled) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        ctx.clearRect(0, 0, width, height);
        anchors.forEach((a) => {
          a.card.style.setProperty('--attn', '0');
          if (a.value) a.value.textContent = '';
        });
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const box = root.getBoundingClientRect();
      cursor = { x: e.clientX - box.left, y: e.clientY - box.top };
      if (!inside) {
        inside = true;
        measure();
        drawn = { ...cursor };
      }
      kick();
    };
    const onLeave = () => {
      inside = false;
      kick();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', measure, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', measure);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <div className={className}>{children}</div>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
      />
    </div>
  );
};
