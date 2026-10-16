// The way in: two bookcases drawn like a line illustration, side by side at
// 1:2. Courses stand one per shelf on the left; picking one fills the right with
// its sets, two per shelf.
//
// The whole scene is one SVG in screen coordinates, in one-point perspective
// towards the middle of the screen. The uprights are fixed rails that fade out
// above and below; the shelves (planks with thickness, and 3D books) travel
// along them. Only the case for the step you're on moves, with a rubber-band
// overshoot at either end.
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { count, type Course, type Index } from '../data';
import { getPref, setPref } from '../store';
import { rubber, useRubberScroll } from './scroll';
import { Database, Plates, Terminal } from './covers';

interface P { x: number; y: number }
interface Rect { x: number; y: number; w: number; h: number }

const SHELVES = 2;
const DEPTH = 0.16;       // how far a case's back recedes towards the eye
const BOOK_DEPTH = 0.07;
const Z_REACH = 0.7;      // how far a plank's depth edges run on past it, either way

/** Sizes everything off the book, and the book off the screen. */
function layout(vw: number, vh: number) {
  const gap = Math.round(Math.min(40, Math.max(16, vw * 0.03)));
  const byWidth = (Math.min(vw - 32, 1040) - gap) / 3 / 1.32; // narrow case = book + 2 × 15% side, rounding to spare
  const byHeight = (vh * 0.56) / 3.5;
  const bw = Math.round(Math.max(80, Math.min(200, byWidth, byHeight)));
  const bh = Math.round(bw * 1.3);
  const side = Math.round(bw * 0.15);
  const narrow = bw + side * 2;
  const plank = Math.max(5, Math.round(bw * 0.05));
  const head = Math.round(bh * 0.32);
  const pitch = head + bh + plank;
  const height = pitch * SHELVES;
  const top = Math.round((vh - height) / 2);
  const left = Math.round((vw - (narrow * 3 + gap)) / 2);
  return {
    bw, bh, side, plank, head, pitch, height, top,
    eye: { x: vw / 2, y: vh / 2 },
    cases: [{ x: left, w: narrow, perShelf: 1 }, { x: left + narrow + gap, w: narrow * 2, perShelf: 2 }],
    reach: Math.round(Math.max(40, Math.min(height * 0.5, ((vh - height) / 2) * 0.85))), // rails past the case
    max: Math.round(pitch * 0.55),   // how far the active case scrolls
    give: Math.round(vh * 0.2),      // how far it can overshoot
  };
}
type L = ReturnType<typeof layout>;

const f = (n: number) => n.toFixed(1);
const toward = (p: P, to: P, k: number): P => ({ x: p.x + (to.x - p.x) * k, y: p.y + (to.y - p.y) * k });
const poly = (...ps: P[]) => 'M' + ps.map((p) => `${f(p.x)} ${f(p.y)}`).join('L') + 'Z';

/** A hairline that fades out at both ends; `solid` is the fraction at full strength. */
function Fade({ id, a, b, solid, cls }: { id: string; a: P; b: P; solid: number; cls: string }) {
  const e = (1 - solid) / 2;
  return (
    <g class={cls}>
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={a.x} y1={a.y} x2={b.x} y2={b.y}>
        <stop offset="0" stop-color="currentColor" stop-opacity="0" />
        <stop offset={e} stop-color="currentColor" />
        <stop offset={1 - e} stop-color="currentColor" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
      <path d={`M${f(a.x)} ${f(a.y)}L${f(b.x)} ${f(b.y)}`} stroke={`url(#${id})`} />
    </g>
  );
}

interface BookSpec {
  key: string; title: string; sub: string; meta: string;
  art: (cx: number, cy: number, s: number) => preact.JSX.Element;
  href?: string; onPick?: () => void; on?: boolean;
}

/** A book: a box showing its front, and its top and inner side when the eye can see them. */
function Book({ r, eye, spec }: { r: Rect; eye: P; spec: BookSpec }) {
  const tl = { x: r.x, y: r.y }, tr = { x: r.x + r.w, y: r.y }, br = { x: r.x + r.w, y: r.y + r.h }, bl = { x: r.x, y: r.y + r.h };
  const back = (p: P) => toward(p, eye, BOOK_DEPTH);
  const faces = [
    eye.y < r.y && poly(tl, tr, back(tr), back(tl)),
    eye.x > r.x + r.w && poly(tr, br, back(br), back(tr)),
    eye.x < r.x && poly(tl, bl, back(bl), back(tl)),
  ].filter(Boolean) as string[];
  const front = poly(tl, tr, br, bl);

  // cover: title and sub-line top-left, the illustration in the middle, the count at the foot
  const pad = Math.round(r.w * 0.09);
  const title = Math.max(11, Math.round(r.w * 0.098));
  const small = Math.max(9, Math.round(r.w * 0.064));
  const artTop = r.y + pad + title + small * 1.6;
  const artBottom = r.y + r.h - pad - small * 1.4;
  const s = Math.min(r.w - pad * 2, artBottom - artTop) * 0.82;

  const body = (
    <>
      <path class="bk-glow" d={front} />
      {faces.map((d) => <path class="bk-side" d={d} />)}
      <path class="bk-front" d={front} />
      <text class="bk-title" x={r.x + pad} y={r.y + pad + title * 0.8} font-size={title}>{spec.title}</text>
      <text class="bk-sub" x={r.x + pad} y={r.y + pad + title * 0.8 + small * 1.5} font-size={small}>{spec.sub}</text>
      {spec.art(r.x + r.w / 2, (artTop + artBottom) / 2, s)}
      <text class="bk-meta" x={r.x + pad} y={r.y + r.h - pad} font-size={small}>{spec.meta}</text>
    </>
  );
  const cls = `bk${spec.on ? ' on' : ''}`;
  // a set is a real link (middle-click works); a course selects
  return spec.href ? (
    <a class={cls} href={spec.href} aria-label={spec.title}>{body}</a>
  ) : (
    <g class={cls} role="button" tabIndex={0} aria-pressed={spec.on} aria-label={spec.title} onClick={spec.onPick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), spec.onPick?.())}>
      {body}
    </g>
  );
}

/** One case's shelves and books at vertical offset `dy` (the rails are drawn separately). */
function Shelf({ id, l, x, w, perShelf, dy, books, empty }: {
  id: string; l: L; x: number; w: number; perShelf: number; dy: number; books: BookSpec[]; empty?: string;
}) {
  const back = (p: P) => toward(p, l.eye, DEPTH);
  const plankY = (row: number) => l.top - dy + l.head + l.bh + row * l.pitch;
  const planks = Array.from({ length: SHELVES }, (_, row) => {
    const y = plankY(row);
    const above = l.eye.y < y, below = l.eye.y > y + l.plank;
    const edge = above ? y : y + l.plank; // the top face from above, the underside from below
    const a = { x, y: edge }, b = { x: x + w, y: edge };
    return { y, seen: above || below, a, b };
  });

  return (
    <g>
      {/* plank faces first: books stand in front of them */}
      {planks.map((p) => p.seen && (
        <g>
          <path class="pl-face" d={poly(p.a, p.b, back(p.b), back(p.a))} />
          <path class="pl-back" d={`M${f(back(p.a).x)} ${f(back(p.a).y)}L${f(back(p.b).x)} ${f(back(p.b).y)}`} />
        </g>
      ))}
      {books.map((b, i) => (
        <Book key={b.key} eye={l.eye} spec={b}
          r={{ x: x + l.side + (i % perShelf) * (l.bw + l.side * 2), y: plankY(Math.floor(i / perShelf)) - l.bh, w: l.bw, h: l.bh }} />
      ))}
      {!books.length && empty && (
        <text class="cs-empty" x={x + l.side} y={plankY(0) - l.bh / 2} font-size={Math.max(10, Math.round(l.bw * 0.06))}>{empty}</text>
      )}
      {/* plank fronts cover the foot of the books; depth edges run on past the plank and fade */}
      {planks.map((p, row) => (
        <g>
          <path class="pl-front" d={poly({ x, y: p.y }, { x: x + w, y: p.y }, { x: x + w, y: p.y + l.plank }, { x, y: p.y + l.plank })} />
          {p.seen && [p.a, p.b].map((q, k) => {
            const u = { x: back(q).x - q.x, y: back(q).y - q.y };
            const from = { x: q.x - u.x * Z_REACH, y: q.y - u.y * Z_REACH };
            const to = { x: back(q).x + u.x * Z_REACH, y: back(q).y + u.y * Z_REACH };
            return <Fade id={`z-${id}-${row}-${k}`} a={from} b={to} solid={1 / (1 + Z_REACH * 2)} cls="pl-z" />;
          })}
        </g>
      ))}
    </g>
  );
}

const setsOf = (c: Course): BookSpec[] =>
  c.sets.map((s, i) => ({
    key: `${c.id}/${s.id}`,
    title: s.title,
    sub: s.groups.length > 1 ? s.groups.map((g) => g.title).join(' · ') : s.blurb,
    meta: `${count(s.groups)} questions`,
    art: (cx, cy, sz) => <Plates cx={cx} cy={cy} s={sz} n={i + 1} />,
    href: `/${c.id}/${s.id}`,
  }));

const ART: Record<string, BookSpec['art']> = {
  '2041': (cx, cy, s) => <Terminal cx={cx} cy={cy} s={s} />,
  '3311': (cx, cy, s) => <Database cx={cx} cy={cy} s={s} />,
};

export function Shelves({ index }: { index: Index }) {
  const root = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ vw: 0, vh: 0 });
  const [course, setCourse] = useState<string | null>(() => getPref('course', null));
  const selected = index.courses.find((c) => c.id === course) ?? null;

  useLayoutEffect(() => {
    const el = root.current!;
    const measure = () => setSize({ vw: el.clientWidth, vh: el.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const l = size.vw ? layout(size.vw, size.vh) : null;
  // the case for the step you're on takes the scrolling; the other stays put
  const active = selected ? 1 : 0;
  const raw = useRubberScroll(root, 2, active, l?.max ?? 0);

  const pick = (id: string) => {
    setCourse(id);
    setPref('course', id);
  };
  const courses: BookSpec[] = index.courses.map((c) => ({
    key: c.id, title: c.title, sub: c.sub, on: c.id === course, onPick: () => pick(c.id),
    meta: `${c.sets.reduce((n, s) => n + count(s.groups), 0)} questions`,
    art: ART[c.id] ?? (() => <g />),
  }));

  return (
    <div class="shelves" ref={root}>
      {l && (
        <svg class="scene" width={size.vw} height={size.vh}>
          <filter id="glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3" /></filter>
          {(() => {
            const back = (p: P) => toward(p, l.eye, DEPTH);
            const solid = l.height / (l.height + l.reach * 2);
            // the rails: fixed in place, faded at both ends; back ones behind everything, front ones in front
            const rails = l.cases.flatMap((c, i) => [c.x, c.x + c.w].map((x, k) => {
              const a = { x, y: l.top - l.reach }, b = { x, y: l.top + l.height + l.reach };
              return { key: `${i}-${k}`, a, b, ba: back(a), bb: back(b) };
            }));
            const dy = l.cases.map((_, i) => rubber(raw[i], l.max, l.give));
            return (
              <>
                {rails.map((r) => <Fade id={`rb-${r.key}`} a={r.ba} b={r.bb} solid={solid} cls="rail-back" />)}
                <Shelf id="courses" l={l} {...l.cases[0]} dy={dy[0]} books={courses} />
                <Shelf id="sets" l={l} {...l.cases[1]} dy={dy[1]} books={selected ? setsOf(selected) : []} empty="Select a course" />
                {rails.map((r) => <Fade id={`rf-${r.key}`} a={r.a} b={r.b} solid={solid} cls="rail" />)}
              </>
            );
          })()}
        </svg>
      )}
    </div>
  );
}
