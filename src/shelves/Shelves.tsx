// The way in: two bookcases side by side at 1:2. Courses stand one per shelf
// on the left; picking one fills the right with its sets, two per shelf. Only
// the case for the step you're on scrolls; it only stretches and springs back,
// since everything fits.
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import type { Index } from '../data';
import { getPref, setPref } from '../store';
import { useShelfScroll } from './scroll';
import { GlowFilter, Shelf, courseBook, plankY, rails, setBooks, type Frame } from './draw';

const SHELVES = 2;

/** A small floating credit, bottom centre, linking to the author's site. */
const Byline = () => (
  <a class="byline" href="https://nipuntal.vercel.app" target="_blank" rel="noopener" aria-label="nipun's site">
    <svg viewBox="0 0 20 20" aria-hidden="true">
      {/* a razorbill, head bowed: dark ground, the bird, its white chest and the line from eye to beak */}
      <path d="M2 2h16v16H2z" fill="#3a3a3c" />
      <path d="M6.6 18C7.1 16.1 8.9 15 11.2 14.9C14 15.4 16.4 16 18 16.6V18Z" fill="#fff" />
      <path d="M18 13C15.7 12 13.7 10.4 13 8.2C12.4 5.4 10.3 4 8.2 4.3C5.8 4.7 4.4 7 4.8 9.3L7 15.7L8.9 12.3C9.3 13.6 10 14.5 11.2 14.9C14 15.4 16.4 16 18 16.6Z" fill="#0d0d0e" />
      <path d="M10.2 8.6C8.9 9 7.6 9.7 6.1 10.9" stroke="#fff" stroke-width="0.4" stroke-linecap="round" fill="none" />
    </svg>
    nipun
  </a>
);

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
  const fr: Frame = { eye: { x: vw / 2, y: vh / 2 }, top: Math.round((vh - height) / 2), head, bh, pitch, plank };
  const left = Math.round((vw - (narrow * 3 + gap)) / 2);
  return {
    fr, bw, side, height,
    cases: [{ x: left, w: narrow }, { x: left + narrow + gap, w: narrow * 2 }],
    reach: Math.round(Math.max(40, Math.min(height * 0.5, ((vh - height) / 2) * 0.85))),
  };
}

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
  const dy = useShelfScroll(root, 2, selected ? 1 : 0, 0, 0);
  if (!l) return <div class="shelves" ref={root}><Byline /></div>;

  const pick = (id: string) => {
    setCourse(id);
    setPref('course', id);
  };
  // n books per shelf, left to right then down
  const place = (caseX: number, perShelf: number) => (i: number) => ({
    x: caseX + l.side + (i % perShelf) * (l.bw + l.side * 2),
    y: plankY(l.fr, Math.floor(i / perShelf)) - l.fr.bh, w: l.bw, h: l.fr.bh,
  });
  const left = place(l.cases[0].x, 1), right = place(l.cases[1].x, 2);
  const r = rails('home', l.cases, l.fr.eye, l.fr.top, l.height, l.reach);
  const planks = Array.from({ length: SHELVES }, (_, row) => ({ y: plankY(l.fr, row) }));

  return (
    <div class="shelves" ref={root}>
      <Byline />
      <svg class="scene" width={size.vw} height={size.vh}>
        <GlowFilter />
        {r.back}
        <Shelf id="courses" fr={l.fr} {...l.cases[0]} planks={planks} dy={dy[0]}
          books={index.courses.map((c, i) => ({ spec: courseBook(c, { on: c.id === course, onPick: () => pick(c.id) }), r: left(i) }))} />
        <Shelf id="sets" fr={l.fr} {...l.cases[1]} planks={planks} dy={dy[1]} empty="Select a course"
          books={selected ? setBooks(selected).map((spec, i) => ({ spec, r: right(i) })) : []} />
        {r.front}
      </svg>
    </div>
  );
}
