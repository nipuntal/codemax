// The way in: two bookcases drawn like a line illustration, side by side at
// 1:2. Courses stand one per shelf on the left; picking one fills the right with
// its sets, two per shelf.
//
// Books are flat outlines. The planks they rest on are solid: a front edge with
// thickness, and the top or underside you'd see from the middle of the screen.
// The uprights are long hairlines that fade out above and below. The case for
// the step you're on scrolls; the other stays pinned in place.
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { count, type Course, type Index } from './data';
import { getPref, setPref } from './store';

interface P { x: number; y: number }

const SHELVES = 2;
const DEPTH = 0.16;   // how far the back of a case recedes towards the eye

/** Everything is sized off the book, and the book off the screen: big, but both shelves fit. */
function geometry(vw: number, vh: number) {
  const gap = Math.round(Math.min(40, Math.max(16, vw * 0.03)));
  const byWidth = (Math.min(vw - 32, 1120) - gap) / 3 / 1.26; // narrow case = book + 2 × side (12%), with rounding to spare
  const byHeight = (vh * 0.64) / 3.45;
  const bw = Math.round(Math.max(84, Math.min(240, byWidth, byHeight)));
  const bh = Math.round(bw * 1.28);
  const side = Math.round(bw * 0.12);
  const plank = Math.max(5, Math.round(bw * 0.045));
  const head = Math.round(bh * 0.3);
  const pitch = head + bh + plank;
  const height = pitch * SHELVES;
  // the uprights run on past the case and fade out within the margin left on screen
  const reach = Math.round(Math.max(40, Math.min(height * 0.5, ((vh - height) / 2) * 0.85)));
  return { gap, bw, bh, side, plank, head, pitch, narrow: bw + side * 2, height, reach };
}
type G = ReturnType<typeof geometry>;

const toward = (p: P, vp: P, k: number): P => ({ x: p.x + (vp.x - p.x) * k, y: p.y + (vp.y - p.y) * k });
const line = (a: P, b: P) => `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
const quad = (a: P, b: P, c: P, d: P) => `${line(a, b)}L${c.x.toFixed(1)} ${c.y.toFixed(1)}L${d.x.toFixed(1)} ${d.y.toFixed(1)}Z`;

interface BookSpec { key: string; title: string; lines: [string, string]; href?: string; onPick?: () => void; on?: boolean }

function Book({ x, y, g, spec }: { x: number; y: number; g: G; spec: BookSpec }) {
  const d = `M${x} ${y}h${g.bw}v${g.bh}h${-g.bw}Z`;
  const pad = Math.round(g.bw * 0.08);
  const title = Math.max(11, Math.round(g.bw * 0.085));
  const small = Math.max(9.5, Math.round(g.bw * 0.058 * 2) / 2);
  const body = (
    <>
      <path class="bk-glow" d={d} />
      <path class="bk-front" d={d} />
      <text class="bk-title" x={x + pad} y={y + pad + title * 0.8} font-size={title}>{spec.title}</text>
      <text class="bk-line" x={x + pad} y={y + g.bh - pad - small * 1.55} font-size={small}>{spec.lines[0]}</text>
      <text class="bk-meta" x={x + pad} y={y + g.bh - pad} font-size={small}>{spec.lines[1]}</text>
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

function Case({ id, perShelf, books, g, eye, pinned, empty }: {
  id: string; perShelf: number; books: BookSpec[]; g: G; eye: (el: Element) => P; pinned: boolean; empty?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const w = g.narrow * perShelf;
  const h = g.height;
  const reach = g.reach;
  const solid = reach / (h + reach * 2); // full strength from the case's top to its bottom
  const vp = ref.current ? eye(ref.current) : { x: w / 2, y: h / 2 };
  const back = (p: P) => toward(p, vp, DEPTH);
  const plankY = (r: number) => g.head + g.bh + r * g.pitch;

  // the four uprights, front and back, running well past the case
  const uprights = [0, w].map((x) => {
    const top = { x, y: -reach }, bottom = { x, y: h + reach };
    return line(top, bottom) + line(back(top), back(bottom));
  }).join('');

  return (
    <div class={`case${pinned ? ' pinned' : ''}`} ref={ref} style={{ width: `${w}px`, height: `${h}px` }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} class="case-svg">
        <defs>
          <linearGradient id={`fade-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1={-reach} x2="0" y2={h + reach}>
            <stop offset="0" stop-color="#fff" stop-opacity="0" />
            <stop offset={solid} stop-color="#fff" stop-opacity="1" />
            <stop offset={1 - solid} stop-color="#fff" stop-opacity="1" />
            <stop offset="1" stop-color="#fff" stop-opacity="0" />
          </linearGradient>
          <mask id={`mask-${id}`} maskUnits="userSpaceOnUse" x={-w} y={-reach} width={w * 3} height={h + reach * 2}>
            <rect x={-w} y={-reach} width={w * 3} height={h + reach * 2} fill={`url(#fade-${id})`} />
          </mask>
        </defs>
        <path class="cs-upright" d={uprights} mask={`url(#mask-${id})`} />
        {Array.from({ length: SHELVES }, (_, r) => {
          const y = plankY(r);
          const ft = { x: 0, y }, fb = { x: 0, y: y + g.plank }, rt = { x: w, y }, rb = { x: w, y: y + g.plank };
          // the face you can see: the top from above, the underside from below
          const face = vp.y < y ? quad(ft, rt, back(rt), back(ft)) : vp.y > y + g.plank ? quad(fb, rb, back(rb), back(fb)) : null;
          return (
            <g key={r}>
              {face && <path class="pl-face" d={face} />}
              <path class="pl-front" d={quad(ft, rt, rb, fb)} />
            </g>
          );
        })}
        {books.map((b, i) => (
          <Book key={b.key} x={g.side + (i % perShelf) * g.narrow} y={plankY(Math.floor(i / perShelf)) - g.bh} g={g} spec={b} />
        ))}
        {!books.length && empty && (
          <text class="cs-empty" x={g.side} y={plankY(0) - g.bh / 2} font-size={Math.max(10, Math.round(g.bw * 0.055))}>{empty}</text>
        )}
      </svg>
    </div>
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
  const [size, setSize] = useState({ vw: 0, vh: 0 });
  const [course, setCourse] = useState<string | null>(() => getPref('course', null));
  const [, redraw] = useState(0);
  const selected = index.courses.find((c) => c.id === course) ?? null;

  useLayoutEffect(() => {
    const el = scroller.current!;
    const measure = () => setSize({ vw: el.clientWidth, vh: el.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // Re-project on scroll, at most once a frame.
  useEffect(() => {
    const el = scroller.current!;
    let raf = 0;
    const kick = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; redraw((t) => t + 1); }); };
    el.addEventListener('scroll', kick, { passive: true });
    return () => { el.removeEventListener('scroll', kick); cancelAnimationFrame(raf); };
  }, []);

  // The eye: the middle of the screen, in a case's own coordinates.
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

  const g = size.vw ? geometry(size.vw, size.vh) : null;
  return (
    <div class="shelves" ref={scroller}>
      {/* one shared blur for every glow */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3" /></filter>
      </svg>
      {g && (
        <div class="stage" style={{ '--case-h': `${g.height}px`, columnGap: `${g.gap}px` } as preact.JSX.CSSProperties}>
          {/* the step you're on scrolls; the other stays put */}
          <Case id="courses" perShelf={1} books={courses} g={g} eye={eye} pinned={!!selected} />
          <Case id="sets" perShelf={2} books={selected ? setsOf(selected) : []} g={g} eye={eye} pinned={!selected}
            empty="Select a course" />
        </div>
      )}
    </div>
  );
}
