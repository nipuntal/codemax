// The app's left rail: one narrow bookcase, a book per shelf. Home first, then
// each course on its own shelf; the open course's sets stand on the shelves
// beneath it, a little smaller and shaded from behind as a group. Drawn like the
// landing shelves, but quieter: the eye on the rail's own centre line so it's
// symmetrical, no uprights or depth edges, and small plain books (a titled
// front each). The planks keep their depth.
// Clicking the open course folds its sets away behind it, one by one; clicking
// it again unfolds them. A small tile above Home tucks the whole rail away;
// while it's hidden, the same tile stands before the list's title.
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import type { Index } from '../data';
import { useShelfScroll } from './scroll';
import { GlowFilter, Shelf, courseBook, setBooks, type BookAt, type BookSpec, type Frame } from './draw';
import * as Icon from '../icons';

const INSET = 14;       // the toggle's (and every book's) distance from the rail's edges
const HEAD = 16;        // headroom above each book
const TOP = INSET + 36 + 12 - HEAD; // the case starts here: the toggle (36 tall), a gap, then Home
const SET_SCALE = 0.84; // sets are a little smaller than their course
const FOLD_MS = 150;    // each set's fold into (or out of) its course…
const STAGGER = 55;     // …starting this long after the one above it

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
/** The course's small swell as a set arrives in it. */
const swell = (p: number) => 0.05 * Math.sin(Math.PI * clamp01((p - 0.6) / 0.4));

/** Hides or shows the rail. */
export const RailToggle = ({ open, onToggle, left }: { open: boolean; onToggle: () => void; left?: number }) => (
  <button class="rail-btn" onClick={onToggle} aria-expanded={open} title={open ? 'Hide shelf' : 'Show shelf'}
    style={left === undefined ? undefined : { left }}>
    <Icon.Panel size={15} />
  </button>
);

export function Rail({ index, course, set, onToggle }: { index: Index; course?: string; set?: string; onToggle: () => void }) {
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

  // the open course can be folded shut; a fold (or unfold) in progress is timed from t0
  const [shut, setShut] = useState(false);
  const [fold, setFold] = useState<{ t0: number; closing: boolean } | null>(null);
  const [, tick] = useState(0);
  useEffect(() => { setShut(false); setFold(null); }, [course]);
  const sets = index.courses.find((c) => c.id === course)?.sets.length ?? 0;
  useEffect(() => {
    if (!fold) return;
    const total = FOLD_MS + STAGGER * Math.max(0, sets - 1);
    let raf = requestAnimationFrame(function step() {
      if (performance.now() - fold.t0 < total) { tick((n) => n + 1); raf = requestAnimationFrame(step); }
      else { if (fold.closing) setShut(true); setFold(null); }
    });
    return () => cancelAnimationFrame(raf);
  }, [fold]);
  const toggle = () => {
    if (fold) return;
    if (shut) setShut(false);
    setFold({ t0: performance.now(), closing: !shut });
  };

  // one book per shelf: each course, then (under the open one) its sets
  type Row = { spec: BookSpec; small: boolean; k?: number }; // k: which set under the course
  const rows: Row[] = [{ spec: { key: 'home', title: 'Home', sub: '', meta: '', href: '/' }, small: false }];
  let parent = -1;
  for (const c of index.courses) {
    const open = c.id === course;
    rows.push({ spec: courseBook(c, open ? { onPick: toggle, on: !set } : { href: `/${c.id}` }), small: false });
    if (!open || shut) continue;
    parent = rows.length - 1;
    rows.push(...setBooks(c, set).map((spec, k) => ({ spec, small: true, k })));
  }
  // how far each set has folded (0 open, 1 tucked behind its course); unfolding runs it backwards
  const folded = (k: number) => {
    if (!fold) return 0;
    const e = easeOut(clamp01((performance.now() - fold.t0 - k * STAGGER) / FOLD_MS));
    return fold.closing ? e : 1 - e;
  };

  const side = INSET;
  const bw = box.w - side * 2;
  const bh = Math.round(bw * 0.7);
  const plank = 4;
  const head = HEAD;
  const pitch = head + bh + plank;
  const fr: Frame = { eye: { x: box.w / 2, y: box.vh / 2 - box.y }, top: TOP, head, bh, pitch, plank };

  // stack the shelves: a folding set's shelf shrinks to nothing, so it sinks into the one above
  let y = fr.top + head + bh - pitch;
  const placed = rows.map((row) => {
    const p = row.k === undefined ? 0 : folded(row.k);
    y += pitch * (1 - p);
    return { row, p, y };
  });
  const height = y + plank - fr.top;
  // whatever doesn't fit; past either end it stretches and springs back
  const [dy] = useShelfScroll(root, 1, 0, 0, Math.max(0, fr.top + height + INSET - box.h));

  // sets shrink as they fold; the course swells a little as each one reaches it
  const books: BookAt[] = placed.map(({ row, p, y: py }, i) => {
    const w = row.small ? Math.round(bw * SET_SCALE) : bw, h = row.small ? Math.round(bh * SET_SCALE) : bh;
    const scale = i === parent ? 1 + placed.reduce((s, q) => s + (q.row.k === undefined ? 0 : swell(q.p)), 0) : 1 - p * 0.35;
    return { spec: row.spec, r: { x: Math.round((box.w - w) / 2), y: py - h, w, h }, scale };
  });
  // sets are drawn before their course, so they slide behind it
  if (parent >= 0) books.splice(parent, 0, ...books.splice(parent + 1, sets));
  const group = parent >= 0 ? placed.filter((q, i) => i === parent || q.row.k !== undefined) : [];
  const tint: [number, number] | undefined = group.length > 1
    ? [group[0].y - bh - head / 2, group[group.length - 1].y + plank] : undefined;

  return (
    <nav class="rail" ref={root} aria-label="Courses">
      {/* the toggle sits in the first shelf's headroom, over Home's left edge, and scrolls with it */}
      <div class="rail-top" style={{ transform: `translateY(${(-dy).toFixed(1)}px)` }}>
        <RailToggle open onToggle={onToggle} left={side} />
      </div>
      {box.w > 0 && (
        <svg class="scene" width={box.w} height={box.h}>
          <GlowFilter />
          <Shelf id="rail" fr={fr} x={0.5} w={box.w - 1} dy={dy} tint={tint} tintOn={!set} books={books} backLines={false} plain
            planks={placed.map(({ p, y: py }) => ({ y: py, alpha: 1 - Math.min(1, p * 3) }))} />
        </svg>
      )}
    </nav>
  );
}
