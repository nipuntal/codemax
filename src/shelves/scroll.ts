// Scrolling done by hand, so the scene can redraw its perspective as it moves.
// Wheel and touch move one offset (the active one), clamped to [0, max].
import { useEffect, useRef, useState } from 'preact/hooks';
import type { RefObject } from 'preact';

export function useShelfScroll(el: RefObject<HTMLElement>, count: number, active: number, max: number) {
  const offsets = useRef<number[]>(Array(count).fill(0));
  const live = useRef({ active, max });
  live.current = { active, max };
  const [, redraw] = useState(0);

  useEffect(() => {
    const node = el.current!;
    let raf = 0;
    let touch: { id: number; y: number } | null = null;
    const move = (dy: number) => {
      const { active, max } = live.current;
      const next = Math.max(0, Math.min(max, offsets.current[active] + dy));
      if (next === offsets.current[active]) return;
      offsets.current[active] = next;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; redraw((n) => n + 1); });
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      move(e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY);
    };
    const down = (e: PointerEvent) => { if (e.pointerType !== 'mouse') touch = { id: e.pointerId, y: e.clientY }; };
    const drag = (e: PointerEvent) => {
      if (touch?.id !== e.pointerId) return;
      move(touch.y - e.clientY);
      touch.y = e.clientY;
    };
    const up = (e: PointerEvent) => { if (touch?.id === e.pointerId) touch = null; };

    node.addEventListener('wheel', wheel, { passive: false });
    node.addEventListener('pointerdown', down);
    addEventListener('pointermove', drag);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    return () => {
      node.removeEventListener('wheel', wheel);
      node.removeEventListener('pointerdown', down);
      removeEventListener('pointermove', drag);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      cancelAnimationFrame(raf);
    };
  }, []);

  // a resize can shrink the range under an offset
  offsets.current = offsets.current.map((o) => Math.min(o, max));
  return offsets.current;
}
