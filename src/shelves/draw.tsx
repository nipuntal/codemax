// The bookshelf drawing, shared by the landing page and the app's rail: one
// SVG in screen coordinates, in one-point perspective towards `eye`. Uprights
// are fixed rails that fade out above and below; planks (with thickness) and
// 3D books travel along them as a case scrolls.
import { count, type Course } from '../data';
import { Database, Sheets, Terminal } from './covers';

export interface P { x: number; y: number }
export interface Rect { x: number; y: number; w: number; h: number }

const DEPTH = 0.16;       // how far a case's back recedes towards the eye
const BOOK_DEPTH = 0.07;
const Z_REACH = 0.7;      // how far a plank's depth edges run on past it, either way

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

export const GlowFilter = () => (
  <filter id="glow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="6" /></filter>
);

export interface BookSpec {
  key: string; title: string; sub: string; meta: string;
  art: (x: number, y: number, s: number) => preact.JSX.Element;
  href?: string; onPick?: () => void; on?: boolean;
}

/** A book: a box showing its front, and its top and inner side when the eye can see them (just the front when `flat`). */
function Book({ r, eye, spec, flat }: { r: Rect; eye: P; spec: BookSpec; flat?: boolean }) {
  const tl = { x: r.x, y: r.y }, tr = { x: r.x + r.w, y: r.y }, br = { x: r.x + r.w, y: r.y + r.h }, bl = { x: r.x, y: r.y + r.h };
  const back = (p: P) => toward(p, eye, BOOK_DEPTH);
  const faces = flat ? [] : [
    eye.y < r.y && poly(tl, tr, back(tr), back(tl)),
    eye.x > r.x + r.w && poly(tr, br, back(br), back(tr)),
    eye.x < r.x && poly(tl, bl, back(bl), back(tl)),
  ].filter(Boolean) as string[];
  const front = poly(tl, tr, br, bl);

  // cover: title, sub-line and count top-left; a large icon owns the bottom-right, cropped by the cover
  const pad = Math.round(r.w * 0.09);
  const title = Math.max(11, Math.round(r.w * 0.098));
  const small = Math.max(9, Math.round(r.w * 0.064));
  const s = r.w * 0.8;
  const clip = `clip-${spec.key.replace(/\W/g, '-')}`;
  const line = (n: number) => r.y + pad + title * 0.8 + small * n;

  const body = (
    <>
      <path class="bk-glow" d={front} />
      {faces.map((d) => <path class="bk-side" d={d} />)}
      <path class="bk-front" d={front} />
      <clipPath id={clip}><path d={front} /></clipPath>
      <g clip-path={`url(#${clip})`}>{spec.art(r.x + r.w - s * 0.86, r.y + r.h - s * 0.8, s)}</g>
      <text class="bk-title" x={r.x + pad} y={line(0)} font-size={title}>{spec.title}</text>
      <text class="bk-sub" x={r.x + pad} y={line(1.5)} font-size={small}>{spec.sub}</text>
      <text class="bk-meta" x={r.x + pad} y={line(2.9)} font-size={small}>{spec.meta}</text>
    </>
  );
  const cls = `bk${spec.on ? ' on' : ''}`;
  // a link where there is somewhere to go (middle-click works), otherwise a button
  return spec.href ? (
    <a class={cls} href={spec.href} aria-label={spec.title} aria-current={spec.on ? 'page' : undefined}>{body}</a>
  ) : (
    <g class={cls} role="button" tabIndex={0} aria-pressed={spec.on} aria-label={spec.title} onClick={spec.onPick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), spec.onPick?.())}>
      {body}
    </g>
  );
}

/** Vertical placement shared by a case's planks and books. */
export interface Frame { eye: P; top: number; head: number; bh: number; pitch: number; plank: number }
export const plankY = (fr: Frame, row: number) => fr.top + fr.head + fr.bh + row * fr.pitch;

/** A plank at rest height `y`; a book at rest rect `r`. `alpha` fades one out, `scale` grows a book about its centre. */
export interface PlankAt { y: number; alpha?: number }
export interface BookAt { spec: BookSpec; r: Rect; alpha?: number; scale?: number }

/**
 * One case's planks and books, scrolled up by `dy`. `tint` shades a band
 * [top, bottom] from behind, to group what stands in it. `flatBooks` draws
 * books as just their fronts; the planks keep their depth either way.
 */
export function Shelf({ id, fr, x, w, planks, dy, books, tint, tintOn, backLines = true, flatBooks, empty }: {
  id: string; fr: Frame; x: number; w: number; planks: PlankAt[]; dy: number;
  books: BookAt[]; tint?: [number, number]; tintOn?: boolean; backLines?: boolean; flatBooks?: boolean; empty?: string;
}) {
  const back = (p: P) => toward(p, fr.eye, DEPTH);
  const ps = planks.map(({ y: rest, alpha = 1 }) => {
    const y = rest - dy;
    const above = fr.eye.y < y, below = fr.eye.y > y + fr.plank;
    const edge = above ? y : y + fr.plank; // the top face from above, the underside from below
    return { y, alpha, seen: above || below, a: { x, y: edge }, b: { x: x + w, y: edge } };
  });
  const fade = (alpha: number) => (alpha < 1 ? { opacity: alpha } : undefined);

  return (
    <g>
      {tint && <path class={`sh-tint${tintOn ? ' on' : ''}`} d={`M${x + 2} ${f(tint[0] - dy)}h${w - 4}V${f(tint[1] - dy)}h${4 - w}Z`} />}
      {/* plank faces first: books stand in front of them */}
      {ps.map((p) => p.seen && (
        <g style={fade(p.alpha)}>
          <path class="pl-face" d={poly(p.a, p.b, back(p.b), back(p.a))} />
          {backLines && <path class="pl-back" d={`M${f(back(p.a).x)} ${f(back(p.a).y)}L${f(back(p.b).x)} ${f(back(p.b).y)}`} />}
        </g>
      ))}
      {books.map(({ spec, r, alpha = 1, scale = 1 }) => {
        const book = <Book key={spec.key} eye={fr.eye} spec={spec} flat={flatBooks} r={{ ...r, y: r.y - dy }} />;
        if (alpha === 1 && scale === 1) return book;
        const cx = r.x + r.w / 2, cy = r.y - dy + r.h / 2;
        return (
          <g key={spec.key} style={fade(alpha)} transform={`translate(${f(cx)} ${f(cy)}) scale(${scale.toFixed(4)}) translate(${f(-cx)} ${f(-cy)})`}>
            {book}
          </g>
        );
      })}
      {!books.length && empty && (
        <text class="cs-empty" x={x + 12} y={plankY(fr, 0) - dy - fr.bh / 2} font-size={11}>{empty}</text>
      )}
      {/* plank fronts cover the foot of the books; depth edges run on past the plank and fade */}
      {ps.map((p, row) => (
        <g style={fade(p.alpha)}>
          <path class="pl-front" d={poly({ x, y: p.y }, { x: x + w, y: p.y }, { x: x + w, y: p.y + fr.plank }, { x, y: p.y + fr.plank })} />
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

/**
 * The fixed uprights of some cases spanning [top, top + height], running `reach`
 * past both ends and fading. Draw `back` before the shelves and `front` after.
 */
export function rails(id: string, cases: { x: number; w: number }[], eye: P, top: number, height: number, reach: number) {
  const solid = height / (height + reach * 2);
  const back = (p: P) => toward(p, eye, DEPTH);
  const lines = cases.flatMap((c, i) => [c.x, c.x + c.w].map((x, k) => {
    const a = { x, y: top - reach }, b = { x, y: top + height + reach };
    return { key: `${id}-${i}-${k}`, a, b };
  }));
  return {
    back: lines.map((l) => <Fade id={`rb-${l.key}`} a={back(l.a)} b={back(l.b)} solid={solid} cls="rl-back" />),
    front: lines.map((l) => <Fade id={`rf-${l.key}`} a={l.a} b={l.b} solid={solid} cls="rl-front" />),
  };
}

// ---------------------------------------------------------------- the books themselves

const ART: Record<string, BookSpec['art']> = {
  '2041': (x, y, s) => <Terminal x={x} y={y} s={s} />,
  '3311': (x, y, s) => <Database x={x} y={y} s={s} />,
};

export const courseBook = (c: Course, extra: Partial<BookSpec>): BookSpec => ({
  key: c.id, title: c.title, sub: c.sub,
  meta: `${c.sets.reduce((n, s) => n + count(s.groups), 0)} questions`,
  art: ART[c.id] ?? (() => <g />),
  ...extra,
});

export const setBooks = (c: Course, current?: string): BookSpec[] =>
  c.sets.map((s, i) => ({
    key: `${c.id}/${s.id}`,
    title: s.title,
    sub: s.groups.length > 1 ? s.groups.map((g) => g.title).join(' · ') : s.blurb,
    meta: `${count(s.groups)} questions`,
    art: (x, y, sz) => <Sheets x={x} y={y} s={sz} n={i + 1} />,
    href: `/${c.id}/${s.id}`,
    on: s.id === current,
  }));
