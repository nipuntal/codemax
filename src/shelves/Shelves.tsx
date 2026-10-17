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
  <a class="byline" href="https://nipuntal.vercel.app" aria-label="nipun's site">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      {/* a penguin, after the user's reference: flipper raised, white belly, on white */}
      <rect width="100" height="100" fill="#fff" />
      <path fill="#161514" d="M85 21.6C82 21.2 79 22 76.6 23.6C74.2 25.6 73.2 29 72.8 33.4C72.6 36 72.6 38 72.4 40.4C76 41 80.6 43.4 82.2 47.6C83.2 50.6 80.6 52.2 77.4 51.4C75.4 50.9 73.6 50.2 72 49.6C70.4 56.8 66.4 63.4 61 69.4C58.4 72.2 56.8 75.6 56.6 80C61 81 65 82.4 67 84.6L23 84.6C24.6 83 26 81.4 27 79.4C27.8 77.4 28 75.4 28 73C28.6 63 30.4 52 35.6 42.6C31 37.4 24.6 30.6 18.6 24.6C15.4 21.4 16 16.6 20.6 16.4C30 16 41 21 47.6 27.2C52 27.8 56 25.6 58.8 21C61.6 16.4 66.6 14.2 71.4 14.4C75.2 14.6 78 16.6 79.4 19.4C81.6 20 83.6 20.6 85 21.6Z" />
      <path fill="#fff" d="M64.8 25.4C68.6 24.6 71.2 27 71 31.6C70.8 40 70.4 49 66.6 57.6C63.6 64.4 58.6 70 57 76.8C56.6 79 55 81.2 51.8 81.4C46 81.6 40 80.6 40 76.4C40 70.4 44.4 63.6 50 56.6C55.8 49.4 61.6 42.4 62.8 34C63.2 30 63.2 27 64.8 25.4Z" />
      <path fill="#161514" d="M50.4 64.2L54.2 78.4L52.6 78.6Z" />
      <path d="M76 18.9L80.4 20.2" stroke="#fff" stroke-width="1" stroke-linecap="round" />
      <path fill="#161514" d="M27 84.1H67V85.3H27Z" />
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
