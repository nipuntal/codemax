// The way in: two wireframe shelves, courses on the left, that course's sets
// on the right. Books are flat outlines; only the planks carry a hint of
// depth — above the middle of the scroller you see a plank's underside,
// below it its top, and that shifts as you scroll.
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { count, type Course, type Index } from './data';
import { getPref, setPref } from './store';

const PLANK = 5;
const MAX_DEPTH = 16;     // deepest a plank face gets, at the top/bottom of the view
const INSET = 12;
const STACKED = '(max-width: 560px)'; // keep in step with the .cases media query
const GAP = 10;

interface BookSpec { key: string; title: string; lines: string[]; href?: string; onOpen?: () => void; active?: boolean }

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const quad = (pts: [number, number][]) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';

function Book({ x, y, w, h, spec, i }: { x: number; y: number; w: number; h: number; spec: BookSpec; i: number }) {
  const body = (
    <>
      <path class="bk-front" d={rect(x, y, w, h)} />
      <text class="bk-title" x={x + 9} y={y + 19}>{spec.title}</text>
      <text class="bk-line" x={x + 9} y={y + h - 22}>{spec.lines[0]}</text>
      <text class="bk-meta" x={x + 9} y={y + h - 9}>{spec.lines[1]}</text>
    </>
  );
  const cls = `bk${spec.active ? ' on' : ''}`;
  const style = { '--i': i } as preact.JSX.CSSProperties;
  // a set is a real link (middle-click works); a course just selects
  return spec.href ? (
    <a class={cls} href={spec.href} style={style} aria-label={spec.title}>{body}</a>
  ) : (
    <g class={cls} style={style} role="button" tabIndex={0} aria-pressed={spec.active} aria-label={spec.title}
      onPointerDown={(e) => e.preventDefault() /* a click shouldn't focus-scroll the page */} onClick={spec.onOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), spec.onOpen?.())}>
      {body}
    </g>
  );
}

function Shelf({ label, books, horizon, dim, empty, setKey, rows }: {
  label: string; books: BookSpec[]; horizon: (el: Element) => { y: number; span: number }; dim: boolean; empty?: string; setKey: string; rows: number;
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

  // three books fit across every shelf, so both shelves share one book size
  const bw = Math.round(Math.min(96, Math.max(72, (w - INSET * 2 - GAP * 2) / 3)));
  const bh = Math.round(bw * 1.32);
  const pitch = bh + 32;
  const top = 8;
  const h = top + rows * pitch;
  const eye = box.current ? horizon(box.current) : { y: h / 2, span: 300 };

  return (
    <section class={`shelf${dim ? ' dim' : ''}`} aria-label={label}>
      <h2 class="shelf-label">{label}</h2>
      <div class="shelf-box" ref={box} style={{ height: `${h}px` }}>
        {w > 0 && (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} class="shelf-svg">
            {Array.from({ length: rows }, (_, r) => {
              const py = top + bh + 4 + r * pitch;
              // eased depth by distance from eye level, as the original shelf did
              const t = Math.max(-1, Math.min(1, (py - eye.y) / eye.span));
              const depth = t * t * (3 - 2 * Math.abs(t)) * MAX_DEPTH;
              const inset = depth * 2.4;
              const face = depth < 0.6 ? null
                : t > 0 ? quad([[0, py], [w, py], [w - inset, py - depth], [inset, py - depth]])
                : quad([[0, py + PLANK], [w, py + PLANK], [w - inset, py + PLANK + depth], [inset, py + PLANK + depth]]);
              return (
                <g key={r}>
                  {face && <path class="pl-face" d={face} />}
                  <path class="pl-front" d={rect(0, py, w, PLANK)} />
                  {r === 0 && (
                    <g key={setKey}>
                      {books.map((b, i) => <Book x={INSET + i * (bw + GAP)} y={py - bh} w={bw} h={bh} spec={b} i={i} />)}
                      {!books.length && empty && <text class="pl-empty" x={INSET} y={py - 14}>{empty}</text>}
                    </g>
                  )}
                </g>
              );
            })}
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
  const [course, setCourse] = useState<string | null>(() => getPref('course', null));
  const [, setTick] = useState(0);
  // side by side, an empty plank under the books makes each read as a bookcase;
  // stacked on a phone it would only add scrolling
  const [stacked, setStacked] = useState(() => matchMedia(STACKED).matches);
  useEffect(() => {
    const mq = matchMedia(STACKED);
    const f = () => setStacked(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  const rows = stacked ? 1 : 2;
  const selected = index.courses.find((c) => c.id === course) ?? null;

  // Re-project the planks on scroll and resize, at most once a frame.
  useEffect(() => {
    const el = scroller.current!;
    let raf = 0;
    const kick = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; setTick((t) => t + 1); }); };
    el.addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    kick();
    return () => { el.removeEventListener('scroll', kick); removeEventListener('resize', kick); cancelAnimationFrame(raf); };
  }, []);

  // Eye level is the middle of the scroller, in a shelf's own coordinates.
  const horizon = (el: Element) => {
    const s = scroller.current!.getBoundingClientRect();
    return { y: s.top + s.height / 2 - el.getBoundingClientRect().top, span: Math.max(160, s.height * 0.42) };
  };

  const pick = (id: string) => {
    const next = course === id ? null : id;
    setCourse(next);
    setPref('course', next);
  };

  const courses: BookSpec[] = index.courses.map((c) => ({
    key: c.id, title: c.title, active: c.id === course, onOpen: () => pick(c.id),
    lines: [c.sub, `${c.sets.reduce((n, s) => n + count(s.groups), 0)} questions`],
  }));

  return (
    <div class="shelves" ref={scroller}>
      <div class="cases">
        {/* the step you're on is lit; the other recedes */}
        <Shelf setKey="courses" label="Course" books={courses} horizon={horizon} dim={!!selected} rows={rows} />
        <Shelf setKey={`sets-${course}`} label="Set" books={selected ? setsOf(selected) : []} horizon={horizon}
          dim={!selected} empty="Select a course" rows={rows} />
      </div>
    </div>
  );
}
