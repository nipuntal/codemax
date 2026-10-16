// Rubber-band scrolling, done by hand so the scene can redraw while it
// overshoots. Wheel and touch move one offset (the active one); past either end
// it gives with growing resistance, and once input stops it eases back.
import { useEffect, useRef, useState } from 'preact/hooks';
import type { RefObject } from 'preact';

const band = (x: number, give: number) => give * (1 - 1 / ((x / give) * 0.55 + 1));

/** The drawn offset for a raw one: linear within [0, max], resisting beyond. */
export const rubber = (raw: number, max: number, give: number) =>
  raw < 0 ? -band(-raw, give) : raw > max ? max + band(raw - max, give) : raw;

const SETTLE_AFTER = 90; // ms without wheel input before easing back
const EASE = 90;         // ms time constant of the ease back

export function useRubberScroll(el: RefObject<HTMLElement>, count: number, active: number, max: number) {
  const raw = useRef<number[]>(Array(count).fill(0));
  const live = useRef({ active, max });
  live.current = { active, max };
  const settleRef = useRef(() => {});
  const [, redraw] = useState(0);

  useEffect(() => {
    const node = el.current!;
    let raf = 0, idle = 0, settling = false, last = 0;
    let touch: { id: number; y: number } | null = null;

    const frame = (t: number) => {
      raf = 0;
      if (settling) {
        const k = 1 - Math.exp(-(last ? t - last : 16) / EASE);
        last = t;
        let moving = false;
        raw.current = raw.current.map((v) => {
          const to = Math.min(live.current.max, Math.max(0, v));
          const next = v + (to - v) * k;
          if (Math.abs(to - next) < 0.5) return to;
          moving = true;
          return next;
        });
        settling = moving;
        if (moving) raf = requestAnimationFrame(frame);
      }
      redraw((n) => n + 1);
    };
    const draw = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const settle = () => { settling = true; last = 0; draw(); };
    settleRef.current = settle;
    const nudge = (dy: number) => {
      settling = false;
      raw.current[live.current.active] += dy;
      draw();
    };

    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      nudge(e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY);
      clearTimeout(idle);
      idle = window.setTimeout(settle, SETTLE_AFTER);
    };
    const down = (e: PointerEvent) => { if (e.pointerType !== 'mouse') touch = { id: e.pointerId, y: e.clientY }; };
    const move = (e: PointerEvent) => {
      if (touch?.id !== e.pointerId) return;
      nudge(touch.y - e.clientY);
      touch.y = e.clientY;
    };
    const up = (e: PointerEvent) => { if (touch?.id === e.pointerId) { touch = null; settle(); } };

    node.addEventListener('wheel', wheel, { passive: false });
    node.addEventListener('pointerdown', down);
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    return () => {
      node.removeEventListener('wheel', wheel);
      node.removeEventListener('pointerdown', down);
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      cancelAnimationFrame(raf);
      clearTimeout(idle);
    };
  }, []);

  // a resize can shrink the range under an offset: ease it back in
  useEffect(() => settleRef.current(), [max]);

  return raw.current;
}
