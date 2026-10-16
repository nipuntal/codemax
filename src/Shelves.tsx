// The way in: two wireframe bookcases side by side (1:2). Courses stand one per
// shelf on the left; picking one fills the right with its sets, two per shelf.
//
// Everything is drawn in one-point perspective towards the middle of the
// scroller, the eye of someone standing in front of both cases: each case shows
// the inner walls it can see, planks show their top or underside, and books
// their top and inner side. Scrolling moves the eye, so the drawing re-projects.
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { count, type Course, type Index } from './data';
import { getPref, setPref } from './store';

interface P { x: number; y: number }

const ROWS = 5;           // shelves per case: taller than the view, so it scrolls
const CASE_DEPTH = 0.17;  // how far the back recedes towards the eye's vanishing point
const BOOK_DEPTH = 0.06;
const TOP = 30;

/** Book size follows the narrow case (a third of the pair), so the 1:2 holds at any width. */
function geometry(total: number, gutter: number) {
  const narrow = (total - gutter) / 3;
  const side = Math.round(Math.min(26, narrow * 0.08));
  const bw = Math.round(Math.min(124, narrow - side * 2));
  const bh = Math.round(bw * 1.26);
  return { bw, bh, side, gap: Math.round(side * 0.85), pitch: bh + Math.round(bh * 0.4) };
}
type G = ReturnType<typeof geometry>;

const toward = (p: P, vp: P, k: number): P => ({ x: p.x + (vp.x - p.x) * k, y: p.y + (vp.y - p.y) * k });
const path = (...ps: P[]) => 'M' + ps.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L');
const closed = (...ps: P[]) => path(...ps) + 'Z';

interface BookSpec { key: string; title: string; lines: [string, string]; href?: string; onPick?: () => void; on?: boolean }

function Book({ x, y, w, h, vp, spec }: { x: number; y: number; w: number; h: number; vp: P; spec: BookSpec }) {
  const tl = { x, y }, tr = { x: x + w, y }, br = { x: x + w, y: y + h }, bl = { x, y: y + h };
  const back = (p: P) => toward(p, vp, BOOK_DEPTH);
  const faces: string[] = [];
  if (vp.y < y) faces.push(closed(tl, tr, back(tr), back(tl)));        // top, when below eye level
  if (vp.x > x + w) faces.push(closed(tr, br, back(br), back(tr)));    // right side, when left of the eye
  if (vp.x < x) faces.push(closed(tl, bl, back(bl), back(tl)));        // left side, when right of it
  const front = closed(tl, tr, br, bl);
  const pad = Math.round(Math.min(12, w * 0.08));

  const body = (
    <>
      <path class="bk-glow" d={front} />
      {faces.map((d) => <path class="bk-face" d={d} />)}
      <path class="bk-front" d={front} />
      <text class="bk-title" x={x + pad} y={y + 22}>{spec.title}</text>
      <text class="bk-line" x={x + pad} y={y + h - 27}>{spec.lines[0]}</text>
      <text class="bk-meta" x={x + pad} y={y + h - 12}>{spec.lines[1]}</text>
    </>
  );
  const cls = `bk${spec.on ? ' on' : ''}`;
  // a set is a real link (middle-click works); a course selects
  return spec.href ? (
    <a class={cls} href={spec.href} aria-label={spec.title}>{body}</a>
  ) : (
    <g class={cls} role="button" tabIndex={0} aria-pressed={spec.on} aria-label={spec.title}
      onPointerDown={(e) => e.preventDefault() /* a click shouldn't focus-scroll the page */} onClick={spec.onPick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), spec.onPick?.())}>
      {body}
    </g>
  );
}

function Case({ label, perShelf, books, eye, g, empty }: {
  label: string; perShelf: number; books: BookSpec[]; eye: (el: Element) => P; g: G; empty?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const h = TOP + ROWS * g.pitch;
  const vp = box.current ? eye(box.current) : { x: w / 2, y: h / 2 };
  const back = (p: P) => toward(p, vp, CASE_DEPTH);
  const c = { tl: { x: 0.5, y: 0.5 }, tr: { x: w - 0.5, y: 0.5 }, br: { x: w - 0.5, y: h - 0.5 }, bl: { x: 0.5, y: h - 0.5 } };
  const shelfY = (r: number) => TOP + g.bh + r * g.pitch;
  const rowW = perShelf * g.bw + (perShelf - 1) * g.gap;
  const startX = Math.max(g.side, Math.round((w - rowW) / 2));

  return (
    <section class="case" aria-label={label}>
      <div class="case-box" ref={box} style={{ height: `${h}px` }}>
        {w > 0 && (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} class="case-svg">
            {/* the hollow box: back panel, and the four edges running back to it */}
            <path class="cs-back" d={closed(back(c.tl), back(c.tr), back(c.br), back(c.bl))} />
            <path class="cs-back" d={[c.tl, c.tr, c.br, c.bl].map((p) => path(p, back(p))).join('')} />
            {/* planks: a front edge and the face we can see (top below eye level, underside above) */}
            {Array.from({ length: ROWS }, (_, r) => {
              const a = { x: c.tl.x, y: shelfY(r) }, b = { x: c.tr.x, y: shelfY(r) };
              return <path class="cs-plank" d={closed(a, b, back(b), back(a))} />;
            })}
            {/* books last: nothing on a shelf is ever in front of them */}
            {books.map((b, i) => (
              <Book key={b.key} x={startX + (i % perShelf) * (g.bw + g.gap)} y={shelfY(Math.floor(i / perShelf)) - g.bh}
                w={g.bw} h={g.bh} vp={vp} spec={b} />
            ))}
            {!books.length && empty && <text class="cs-empty" x={startX} y={shelfY(0) - 16}>{empty}</text>}
            <path class="cs-front" d={closed(c.tl, c.tr, c.br, c.bl)} />
          </svg>
        )}
      </div>
    </section>
  );
}

const setsOf = (c: Course): BookSpec[] =>
  c.sets.map((s) => ({
    key: `${c.id}/${s.id}`,
    title: s.title,
    lines: [s.groups.length > 1 ? s.groups.map((g) => g.title).join(' · ') : s.blurb, `${count(s.groups)} questions`],
    href: `/${c.id}/${s.id}`,
  }));

export function Shelves({ index }: { index: Index }) {
  const scroller = useRef<HTMLDivElement>(null);
  const pair = useRef<HTMLDivElement>(null);
  const [total, setTotal] = useState(0);
  useLayoutEffect(() => {
    const el = pair.current!;
    const ro = new ResizeObserver(() => setTotal(el.clientWidth));
    ro.observe(el);
    setTotal(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const g = geometry(total, parseFloat(pair.current ? getComputedStyle(pair.current).columnGap : '') || 24);
  const [course, setCourse] = useState<string | null>(() => getPref('course', null));
  const [, redraw] = useState(0);
  const selected = index.courses.find((c) => c.id === course) ?? null;

  // Re-project on scroll and resize, at most once a frame.
  useEffect(() => {
    const el = scroller.current!;
    let raf = 0;
    const kick = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; redraw((t) => t + 1); }); };
    el.addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    kick();
    return () => { el.removeEventListener('scroll', kick); removeEventListener('resize', kick); cancelAnimationFrame(raf); };
  }, []);

  // The eye: the middle of the scroller, in a case's own coordinates.
  const eye = (el: Element): P => {
    const s = scroller.current!.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: s.left + s.width / 2 - b.left, y: s.top + s.height / 2 - b.top };
  };

  const pick = (id: string) => {
    setCourse(id);
    setPref('course', id);
  };

  const courses: BookSpec[] = index.courses.map((c) => ({
    key: c.id, title: c.title, on: c.id === course, onPick: () => pick(c.id),
    lines: [c.sub, `${c.sets.reduce((n, s) => n + count(s.groups), 0)} questions`],
  }));

  return (
    <div class="shelves" ref={scroller}>
      {/* one shared blur for every glow */}
      <svg width="0" height="0" class="defs" aria-hidden="true">
        <filter id="glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3" /></filter>
      </svg>
      <div class="cases" ref={pair}>
        {total > 0 && <>
          <Case label="Course" perShelf={1} books={courses} eye={eye} g={g} />
          <Case label="Set" perShelf={2} books={selected ? setsOf(selected) : []} eye={eye} g={g} empty="Select a course" />
        </>}
      </div>
    </div>
  );
}
