// The way in: two wireframe bookcases, courses on the left, that course's
// sets on the right. Everything is drawn in one-point perspective towards the
// middle of the scroller, so as you scroll, planks show their top or their
// underside and each case its inner wall — you are standing between them.
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { count, type Course, type Index } from './data';
import { getPref, setPref } from './store';

interface P { x: number; y: number }
interface Box { x: number; y: number; w: number; h: number }

const CASE_DEPTH = 0.16;  // how far the back of a case recedes towards the vanishing point
const BOOK_DEPTH = 0.07;
const FRAME = 7;          // thickness of the case's front frame
const PLANK = 6;
const CHAMFER = 14;

const toward = (p: P, vp: P, k: number): P => ({ x: p.x + (vp.x - p.x) * k, y: p.y + (vp.y - p.y) * k });
const poly = (...ps: P[]) => 'M' + ps.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L') + 'Z';

/** The faces of a book (a box resting on a plank, so never its underside) the eye at `vp` can see. */
function solid(b: Box, vp: P, k: number, chamfer = 0) {
  const tl = { x: b.x, y: b.y }, tr = { x: b.x + b.w, y: b.y }, br = { x: b.x + b.w, y: b.y + b.h }, bl = { x: b.x, y: b.y + b.h };
  const back = (p: P) => toward(p, vp, k);
  const faces: string[] = [];
  if (vp.y < b.y) faces.push(poly(tl, chamfer ? { x: tr.x - chamfer, y: tr.y } : tr, back(chamfer ? { x: tr.x - chamfer, y: tr.y } : tr), back(tl)));
  if (vp.x > b.x + b.w) faces.push(poly(chamfer ? { x: tr.x, y: tr.y + chamfer } : tr, br, back(br), back(chamfer ? { x: tr.x, y: tr.y + chamfer } : tr)));
  if (vp.x < b.x) faces.push(poly(tl, bl, back(bl), back(tl)));
  if (chamfer && (vp.y < b.y + chamfer || vp.x > b.x + b.w - chamfer)) {
    const a = { x: tr.x - chamfer, y: tr.y }, c = { x: tr.x, y: tr.y + chamfer };
    faces.push(poly(a, c, back(c), back(a)));
  }
  const front = chamfer ? poly(tl, { x: tr.x - chamfer, y: tr.y }, { x: tr.x, y: tr.y + chamfer }, br, bl) : poly(tl, tr, br, bl);
  return { faces, front };
}

interface BookSpec { key: string; kicker: string; title: string; lines: string[]; href?: string; onOpen?: () => void; active?: boolean }

function Book({ b, vp, spec, index }: { b: Box; vp: P; spec: BookSpec; index: number }) {
  const { faces, front } = solid(b, vp, BOOK_DEPTH, CHAMFER);
  const body = (
    <>
      {faces.map((d) => <path class="bk-face" d={d} />)}
      <path class="bk-front" d={front} />
      <text class="bk-kicker" x={b.x + 12} y={b.y + 22}>{spec.kicker}</text>
      <text class="bk-title" x={b.x + 11} y={b.y + 56}>{spec.title}</text>
      {spec.lines.map((l, i) => (
        <text class={i ? 'bk-meta' : 'bk-line'} x={b.x + 12} y={b.y + b.h - 14 - (spec.lines.length - 1 - i) * 16}>{l}</text>
      ))}
    </>
  );
  const cls = `bk${spec.active ? ' on' : ''}`;
  const style = { '--i': index } as preact.JSX.CSSProperties;
  // a set is a real link (middle-click works); a course just selects
  return spec.href ? (
    <a class={cls} href={spec.href} style={style} aria-label={`${spec.kicker} ${spec.title}`}>{body}</a>
  ) : (
    <g class={cls} style={style} role="button" tabIndex={0} aria-pressed={spec.active} aria-label={`${spec.kicker} ${spec.title}`}
      onPointerDown={(e) => e.preventDefault() /* a click shouldn't focus-scroll the page */} onClick={spec.onOpen} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), spec.onOpen?.())}>
      {body}
    </g>
  );
}

/** One bookcase: a front frame, its inner walls, a plank per row, a book per plank. */
function Case({ label, rows, books, vpGlobal, empty, caseKey }: {
  label: string; rows: number; books: BookSpec[]; vpGlobal: (el: Element) => P; empty?: string; caseKey: string;
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

  const bookW = Math.round(Math.min(168, Math.max(108, w * 0.5)));
  const bookH = Math.round(bookW * 1.18);
  const pitch = bookH + 72;
  const top = 28;
  const h = top + rows * pitch + 24;
  const inner = { x: FRAME, y: FRAME, w: w - FRAME * 2, h: h - FRAME * 2 };
  const vp = box.current ? vpGlobal(box.current) : { x: w / 2, y: h / 2 };
  const back = (p: P) => toward(p, vp, CASE_DEPTH);
  const c = {
    tl: { x: inner.x, y: inner.y }, tr: { x: inner.x + inner.w, y: inner.y },
    br: { x: inner.x + inner.w, y: inner.y + inner.h }, bl: { x: inner.x, y: inner.y + inner.h },
  };
  // a hollow box: we see the inside walls that face us
  const walls: string[] = [];
  if (vp.x > c.tl.x) walls.push(poly(c.tl, c.bl, back(c.bl), back(c.tl)));
  if (vp.x < c.tr.x) walls.push(poly(c.tr, c.br, back(c.br), back(c.tr)));
  if (vp.y > c.tl.y) walls.push(poly(c.tl, c.tr, back(c.tr), back(c.tl)));
  if (vp.y < c.bl.y) walls.push(poly(c.bl, c.br, back(c.br), back(c.bl)));

  return (
    <section class="case" aria-label={label}>
      <h2 class="case-label">{label}</h2>
      <div class="case-box" ref={box} style={{ height: `${h}px` }}>
        {w > 0 && (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} class="case-svg">
            {walls.map((d) => <path class="cs-wall" d={d} />)}
            <path class="cs-back" d={poly(back(c.tl), back(c.tr), back(c.br), back(c.bl))} />
            <path class="cs-frame" fill-rule="evenodd"
              d={`${poly({ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h })}${poly(c.tl, c.tr, c.br, c.bl)}`} />
            {Array.from({ length: rows }, (_, r) => {
              const py = top + (r + 1) * pitch - 30;
              const plank = { x: inner.x, y: py, w: inner.w, h: PLANK };
              const pb = (p: P) => toward(p, vp, CASE_DEPTH);
              const face = vp.y < py
                ? poly({ x: plank.x, y: py }, { x: plank.x + plank.w, y: py }, pb({ x: plank.x + plank.w, y: py }), pb({ x: plank.x, y: py }))
                : vp.y > py + PLANK
                  ? poly({ x: plank.x, y: py + PLANK }, { x: plank.x + plank.w, y: py + PLANK }, pb({ x: plank.x + plank.w, y: py + PLANK }), pb({ x: plank.x, y: py + PLANK }))
                  : null;
              const book = books[r];
              const bb = { x: Math.round((w - bookW) / 2), y: py - bookH, w: bookW, h: bookH };
              return (
                <g key={`${caseKey}-${r}`}>
                  {/* back to front: plank's top/underside, the book, then the plank's front edge */}
                  {face && <path class="cs-plank-face" d={face} />}
                  {book && <Book b={bb} vp={vp} spec={book} index={r} />}
                  <path class="cs-plank" d={poly({ x: plank.x, y: py }, { x: plank.x + plank.w, y: py }, { x: plank.x + plank.w, y: py + PLANK }, { x: plank.x, y: py + PLANK })} />
                  {!book && r === 0 && empty && <text class="cs-empty" x={w / 2} y={py - 18} text-anchor="middle">{empty}</text>}
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
  c.sets.map((s) => {
    const n = count(s.groups);
    const split = s.groups.length > 1 ? s.groups.map((g) => g.title).join(' · ') : s.blurb;
    return {
      key: `${c.id}/${s.id}`, kicker: 'DAY', title: s.id.replace(/^day/, ''),
      lines: [split, `${n} questions`], href: `/${c.id}/${s.id}`,
    };
  });

export function Shelves({ index }: { index: Index }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [course, setCourse] = useState<string | null>(() => getPref('course', null));
  const [, setTick] = useState(0);
  const selected = index.courses.find((c) => c.id === course) ?? null;

  // Re-project on scroll and resize, at most once a frame.
  useEffect(() => {
    const el = scroller.current!;
    let raf = 0;
    const kick = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; setTick((t) => t + 1); }); };
    el.addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
    kick();
    return () => { el.removeEventListener('scroll', kick); removeEventListener('resize', kick); cancelAnimationFrame(raf); };
  }, []);

  // The eye sits at the centre of the scroller; express it in a case's own coordinates.
  const vpFor = (caseEl: Element): P => {
    const s = scroller.current!.getBoundingClientRect(), b = caseEl.getBoundingClientRect();
    return { x: s.left + s.width / 2 - b.left, y: s.top + s.height / 2 - b.top };
  };

  const pick = (id: string) => {
    const next = course === id ? null : id;
    setCourse(next);
    setPref('course', next);
  };

  const rows = Math.max(index.courses.length, ...index.courses.map((c) => c.sets.length)) + 1;
  const courses: BookSpec[] = index.courses.map((c) => ({
    key: c.id, kicker: c.title.replace(/\d+$/, ''), title: c.id, active: c.id === course,
    lines: [c.sub, `${c.sets.reduce((n, s) => n + count(s.groups), 0)} questions`], onOpen: () => pick(c.id),
  }));

  return (
    <div class="shelves" ref={scroller}>
      <header class="shelves-head">
        <span class="brand">codemax</span>
        <span class="shelves-hint">{selected ? `${selected.title} · pick a set` : 'pick a course'}</span>
      </header>
      <div class="cases">
        <Case caseKey="courses" label="Course" rows={rows} books={courses} vpGlobal={vpFor} />
        <Case caseKey={`sets-${course}`} label="Set" rows={rows} books={selected ? setsOf(selected) : []} vpGlobal={vpFor}
          empty={selected ? undefined : 'Select a course'} />
      </div>
    </div>
  );
}
