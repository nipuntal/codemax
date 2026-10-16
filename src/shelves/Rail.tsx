// The app's left rail: one narrow bookcase, a book per shelf. Each course
// stands on its own shelf; the open course's sets stand on the shelves beneath
// it, a little smaller and shaded from behind as a group. Drawn exactly like
// the landing shelves, in perspective towards the middle of the screen, and
// scrolled by hand (half a shelf past whatever doesn't fit).
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import type { Index } from '../data';
import { useShelfScroll } from './scroll';
import { GlowFilter, Shelf, courseBook, plankY, rails, setBooks, type BookSpec, type Frame, type Rect } from './draw';

const SET_SCALE = 0.84; // sets are a little smaller than their course

export function Rail({ index, course, set }: { index: Index; course?: string; set?: string }) {
  const root = useRef<HTMLDivElement>(null);
  // the rail's own box, and where it sits on screen (the eye is the screen's middle)
  const [box, setBox] = useState({ w: 0, h: 0, x: 0, y: 0, vw: 0, vh: 0 });
  useLayoutEffect(() => {
    const el = root.current!;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height, x: r.left, y: r.top, vw: innerWidth, vh: innerHeight });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    addEventListener('resize', measure);
    measure();
    return () => { ro.disconnect(); removeEventListener('resize', measure); };
  }, []);

  // one book per shelf: each course, then (under the open one) its sets
  const rows: { spec: BookSpec; small: boolean }[] = [];
  let group: [number, number] | undefined;
  for (const c of index.courses) {
    rows.push({ spec: courseBook(c, { href: `/${c.id}`, on: c.id === course && !set }), small: false });
    if (c.id !== course) continue;
    const books = setBooks(c, set);
    group = [rows.length - 1, rows.length + books.length - 1];
    rows.push(...books.map((spec) => ({ spec, small: true })));
  }

  const side = Math.round(box.w * 0.1);
  const bw = box.w - side * 2;
  const bh = Math.round(bw * 1.3);
  const plank = Math.max(4, Math.round(bw * 0.045));
  const head = Math.round(bh * 0.2);
  const fr: Frame = { eye: { x: box.vw / 2 - box.x, y: box.vh / 2 - box.y }, top: 12, head, bh, pitch: head + bh + plank, plank };
  const height = rows.length * fr.pitch;
  const max = Math.max(0, fr.top + height + 24 - box.h) + Math.round(fr.pitch / 2);
  const [dy] = useShelfScroll(root, 1, 0, max);

  const place = (row: number, small: boolean): Rect => {
    const w = small ? Math.round(bw * SET_SCALE) : bw, h = small ? Math.round(bh * SET_SCALE) : bh;
    return { x: Math.round((box.w - w) / 2), y: plankY(fr, row) - h, w, h };
  };
  const r = rails('rail', [{ x: 0.5, w: box.w - 1 }], fr.eye, fr.top, height, 48);

  return (
    <nav class="rail" ref={root} aria-label="Courses">
      {box.w > 0 && (
        <svg class="scene" width={box.w} height={box.h}>
          <GlowFilter />
          {r.back}
          <Shelf id="rail" fr={fr} x={0.5} w={box.w - 1} rows={rows.length} dy={dy} tint={group}
            books={rows.map((b, i) => ({ spec: b.spec, r: place(i, b.small) }))} />
          {r.front}
        </svg>
      )}
    </nav>
  );
}
