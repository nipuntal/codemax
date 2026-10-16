// Scrolling done by hand, so the scene can redraw its perspective as it moves.
// Wheel and touch move one offset (the active one) within [min, max]. Past an
// end there's no dead space, only stretch: the push meets more resistance the
// further it goes, and on letting go a spring snaps it back, overshooting a
// touch before it settles. One rAF loop runs only while something is moving.
import { useEffect, useRef, useState } from 'preact/hooks';
import type { RefObject } from 'preact';

const K = 700;      // spring stiffness (1/s²): a ~0.27s swing
const ZETA = 0.45;  // damping ratio, under 1 so it overshoots (~20%)
const GAIN = 20;    // wheel past an end kicks velocity, px/s per px of delta…
const VMAX = 2400;  // …up to this, so a run of notches can't pile up
const STEP = 1 / 240;

// `to`: the end it's settling on; `dir`: which way the push that stretched it went
interface Spring { o: number; v: number; to: number | null; dir: number }

export function useShelfScroll(el: RefObject<HTMLElement>, count: number, active: number, min: number, max: number) {
  const st = useRef<Spring[]>(Array.from({ length: count }, () => ({ o: 0, v: 0, to: null, dir: 0 })));
  const live = useRef({ active, min, max });
  live.current = { active, min, max };
  const kick = useRef(() => {});
  const [, redraw] = useState(0);

  useEffect(() => {
    const node = el.current!;
    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, last = 0;
    let touch: { id: number; y: number; t: number; v: number } | null = null;
    const reach = () => Math.min(140, node.clientHeight * 0.15); // how far it can stretch
    const nearest = (o: number) => (o > live.current.max ? live.current.max : live.current.min);
    const outside = (o: number) => o > live.current.max ? o - live.current.max : o < live.current.min ? live.current.min - o : 0;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const c = 2 * (calm.matches ? 1 : ZETA) * Math.sqrt(K);
      let moving = false;
      st.current.forEach((s, i) => {
        if (s.to === null || (touch && i === live.current.active)) return;
        for (let t = 0; t < dt; t += STEP) {
          const h = Math.min(STEP, dt - t);
          s.v += (-K * (s.o - s.to) - c * s.v) * h;
          s.o += s.v * h;
        }
        if (Math.abs(s.o - s.to) < 0.05 && Math.abs(s.v) < 2) { s.o = s.to; s.v = 0; s.to = null; s.dir = 0; }
        else moving = true;
      });
      redraw((n) => n + 1);
      if (moving) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    };
    kick.current = start;

    /**
     * Move by `dy`: freely while inside the range, resisted past it (as velocity
     * for a wheel, as position for a finger). Coming back over the end clears
     * whatever stretch had built up, so a push the other way starts from nothing.
     */
    const push = (dy: number, wheel: boolean) => {
      const { active, min, max } = live.current;
      const s = st.current[active];
      if (dy > 0 && s.o < max) { const d = Math.min(dy, max - s.o); s.o += d; dy -= d; }
      else if (dy < 0 && s.o > min) { const d = Math.max(dy, min - s.o); s.o += d; dy -= d; }
      if (!outside(s.o)) { s.to = null; s.v = 0; s.dir = 0; } // back in range by hand: it's yours again
      if (dy) {
        // a fresh direction, or against the spring's return: rebuild from here, nothing carried over
        if (s.dir !== Math.sign(dy) || s.v * dy < 0) { s.v = 0; s.dir = Math.sign(dy); }
        const give = (1 - Math.min(1, outside(s.o) / reach())) ** 2;
        if (wheel) s.v = Math.max(-VMAX, Math.min(VMAX, s.v + dy * give * GAIN));
        else s.o += dy * give;
        s.to = dy > 0 ? max : min;
      }
      start();
    };

    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      push(e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY, true);
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      touch = { id: e.pointerId, y: e.clientY, t: e.timeStamp, v: 0 };
      st.current[live.current.active].v = 0; // caught mid-swing
    };
    const drag = (e: PointerEvent) => {
      if (touch?.id !== e.pointerId) return;
      const s = st.current[live.current.active], o = s.o;
      push(touch.y - e.clientY, false);
      const dt = Math.max(1, e.timeStamp - touch.t) / 1000;
      touch.v = touch.v * 0.2 + ((s.o - o) / dt) * 0.8;
      touch.y = e.clientY;
      touch.t = e.timeStamp;
    };
    const up = (e: PointerEvent) => {
      if (touch?.id !== e.pointerId) return;
      const s = st.current[live.current.active];
      if (outside(s.o)) {
        // fling it back with whatever speed the finger let go at (none if it had stopped)
        s.v = e.timeStamp - touch.t < 60 ? Math.max(-3000, Math.min(3000, touch.v)) : 0;
        s.to = nearest(s.o);
      }
      touch = null;
      start();
    };

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
      kick.current = () => {};
    };
  }, []);

  // a resize (or a fold) can move an end out from under an offset: spring to the new one
  useEffect(() => {
    let any = false;
    for (const s of st.current) {
      if (s.to !== null) { s.to = Math.max(min, Math.min(max, s.to)); any = true; }
      else if (s.o > max || s.o < min) { s.to = s.o > max ? max : min; any = true; }
    }
    if (any) kick.current();
  }, [min, max]);

  return st.current.map((s) => s.o);
}
