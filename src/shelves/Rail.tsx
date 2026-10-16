// The app's left rail: one narrow bookcase, a book per shelf. Each course
// stands on its own shelf; the open course's sets stand on the shelves beneath
// it, a little smaller and shaded from behind as a group. Drawn like the
// landing shelves, but with the eye on the rail's own centre line so it's
// symmetrical. Clicking the open course folds its sets away into it, one by
// one; clicking it again brings them back.
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import type { Index } from '../data';
import { useShelfScroll } from './scroll';
import { GlowFilter, Shelf, courseBook, rails, setBooks, type BookAt, type BookSpec, type Frame } from './draw';

const SET_SCALE = 0.84; // sets are a little smaller than their course
const FOLD_MS = 150;    // each set's fold into its course…
const STAGGER = 55;     // …starting this long after the one above it

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
/** The course's small swell as a set arrives in it. */
const swell = (p: number) => 0.05 * Math.sin(Math.PI * clamp01((p - 0.6) / 0.4));

export function Rail({ index, course, set }: { index: Index; course?: string; set?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0, y: 0, vh: 0 });
  useLayoutEffect(() => {
    const el = root.current!;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height, y: r.top, vh: innerHeight });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    addEventListener('resize', measure);
    measure();
    return () => { ro.disconnect(); removeEventListener('resize', measure); };
  }, []);

  // the open course can be folded shut; a fold in progress is timed from t0
  const [shut, setShut] = useState(false);
  const [fold, setFold] = useState<number | null>(null);
  const [, tick] = useState(0);
  useEffect(() => { setShut(false); setFold(null); }, [course]);
  const sets = index.courses.find((c) => c.id === course)?.sets.length ?? 0;
  useEffect(() => {
    if (fold === null) return;
    const total = FOLD_MS + STAGGER * Math.max(0, sets - 1);
    let raf = requestAnimationFrame(function step() {
      if (performance.now() - fold < total) { tick((n) => n + 1); raf = requestAnimationFrame(step); }
      else { setShut(true); setFold(null); }
    });
    return () => cancelAnimationFrame(raf);
  }, [fold]);
  const toggle = () => {
    if (fold !== null) return;
    if (shut) setShut(false);
    else setFold(performance.now());
  };

  // one book per shelf: each course, then (under the open one) its sets
  type Row = { spec: BookSpec; small: boolean; k?: number }; // k: which set under the course
  const rows: Row[] = [];
  let parent = -1;
  for (const c of index.courses) {
    const open = c.id === course;
    rows.push({ spec: courseBook(c, open ? { onPick: toggle, on: !set } : { href: `/${c.id}` }), small: false });
    if (!open || shut) continue;
    parent = rows.length - 1;
    rows.push(...setBooks(c, set).map((spec, k) => ({ spec, small: true, k })));
  }
  // how far each set has folded (0 open, 1 gone)
  const folded = (k: number) => (fold === null ? 0 : easeOut(clamp01((performance.now() - fold - k * STAGGER) / FOLD_MS)));

  const side = Math.round(box.w * 0.1);
  const bw = box.w - side * 2;
  const bh = Math.round(bw * 1.3);
  const plank = Math.max(4, Math.round(bw * 0.045));
  const head = Math.round(bh * 0.2);
  const pitch = head + bh + plank;
  const fr: Frame = { eye: { x: box.w / 2, y: box.vh / 2 - box.y }, top: 12, head, bh, pitch, plank };

  // stack the shelves: a folding set's shelf shrinks to nothing, so it sinks into the one above
  let y = fr.top + head + bh - pitch;
  const placed = rows.map((row) => {
    const p = row.k === undefined ? 0 : folded(row.k);
    y += pitch * (1 - p);
    return { row, p, y };
  });
  const height = y + plank - fr.top;
  const max = Math.max(0, fr.top + height + 24 - box.h) + Math.round(pitch / 2);
  const [dy] = useShelfScroll(root, 1, 0, max);

  const books: BookAt[] = placed.map(({ row, p, y: py }, i) => {
    const w = row.small ? Math.round(bw * SET_SCALE) : bw, h = row.small ? Math.round(bh * SET_SCALE) : bh;
    const scale = i === parent ? 1 + placed.reduce((s, q) => s + (q.row.k === undefined ? 0 : swell(q.p)), 0) : 1 - p * 0.25;
    return { spec: row.spec, r: { x: Math.round((box.w - w) / 2), y: py - h, w, h }, alpha: 1 - p, scale };
  });
  const group = parent >= 0 ? placed.filter((q, i) => i === parent || q.row.k !== undefined) : [];
  const tint: [number, number] | undefined = group.length > 1
    ? [group[0].y - bh - head / 2, group[group.length - 1].y + plank] : undefined;
  const r = rails('rail', [{ x: 0.5, w: box.w - 1 }], fr.eye, fr.top, height, 48);

  return (
    <nav class="rail" ref={root} aria-label="Courses">
      {box.w > 0 && (
        <svg class="scene" width={box.w} height={box.h}>
          <GlowFilter />
          {r.back}
          <Shelf id="rail" fr={fr} x={0.5} w={box.w - 1} dy={dy} tint={tint} books={books}
            planks={placed.map(({ p, y: py }) => ({ y: py, alpha: 1 - p }))} />
          {r.front}
        </svg>
      )}
    </nav>
  );
}
