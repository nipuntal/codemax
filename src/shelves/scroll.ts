// Rubber-band scrolling, done by hand so the scene can redraw while it
// overshoots. Wheel and touch move one offset (the active one). Past either end
// it gives only a little, with heavy resistance, and is pulled straight back on
// every frame it's out of range (unless a finger is holding it there).
import { useEffect, useRef, useState } from 'preact/hooks';
import type { RefObject } from 'preact';

const STIFF = 1.6;  // resistance past the end: higher gives less
const PULL = 12;    // ms time constant of the pull back: back within ~3 frames, no visible ease

const band = (x: number, give: number) => give * (1 - 1 / ((x / give) * STIFF + 1));

/** The drawn offset for a raw one: linear within [0, max], resisting beyond, never past `give`. */
export const rubber = (raw: number, max: number, give: number) =>
  raw < 0 ? -band(-raw, give) : raw > max ? max + band(raw - max, give) : raw;

export function useRubberScroll(el: RefObject<HTMLElement>, count: number, active: number, max: number) {
  const raw = useRef<number[]>(Array(count).fill(0));
  const live = useRef({ active, max });
  live.current = { active, max };
  const kick = useRef(() => {});
  const [, redraw] = useState(0);

  useEffect(() => {
    const node = el.current!;
    let raf = 0, last = 0;
    let touch: { id: number; y: number } | null = null;

    const frame = (t: number) => {
      raf = 0;
      const k = 1 - Math.exp(-(last ? Math.min(t - last, 50) : 16) / PULL);
      let out = false;
      if (!touch) {
        raw.current = raw.current.map((v) => {
          const to = Math.min(live.current.max, Math.max(0, v));
          if (v === to) return v;
          const next = v + (to - v) * k;
          if (Math.abs(to - next) < 2) return to;
          out = true;
          return next;
        });
      }
      last = out ? t : 0;
      if (out) raf = requestAnimationFrame(frame);
      redraw((n) => n + 1);
    };
    const draw = () => { if (!raf) raf = requestAnimationFrame(frame); };
    kick.current = draw;

    const nudge = (dy: number) => {
      const i = live.current.active, m = live.current.max;
      // don't bank more stretch than can be shown: the pull back stays instant
      raw.current[i] = Math.max(-m, Math.min(m * 2, raw.current[i] + dy));
      draw();
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      nudge(e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY);
    };
    const down = (e: PointerEvent) => { if (e.pointerType !== 'mouse') touch = { id: e.pointerId, y: e.clientY }; };
    const move = (e: PointerEvent) => {
      if (touch?.id !== e.pointerId) return;
      nudge(touch.y - e.clientY);
      touch.y = e.clientY;
    };
    const up = (e: PointerEvent) => { if (touch?.id === e.pointerId) { touch = null; draw(); } };

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
    };
  }, []);

  // a resize can shrink the range under an offset: pull it back in
  useEffect(() => kick.current(), [max]);

  return raw.current;
}
