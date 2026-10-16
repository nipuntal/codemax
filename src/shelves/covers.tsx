// Flat line icons for the book covers. Each is drawn to fill a square of side
// `s` with its top-left at (x, y); the book sets it large in its bottom-right
// corner and crops it at the cover's edge.

const f = (n: number) => n.toFixed(1);

/** A terminal window: title bar with three dots, a prompt. */
export function Terminal({ x, y, s }: { x: number; y: number; s: number }) {
  const h = s * 0.74, top = y + (s - h) / 2, bar = top + h * 0.18;
  const r = h * 0.04, px = x + s * 0.12, py = bar + h * 0.27, c = h * 0.08;
  return (
    <g class="art">
      <path class="art-fill" d={`M${f(x)} ${f(top)}h${f(s)}v${f(h)}h${f(-s)}Z`} />
      <path d={`M${f(x)} ${f(top)}h${f(s)}v${f(h)}h${f(-s)}ZM${f(x)} ${f(bar)}h${f(s)}`} />
      {[0, 1, 2].map((i) => <circle cx={x + h * 0.09 + i * h * 0.1} cy={(top + bar) / 2} r={r} />)}
      <path d={`M${f(px)} ${f(py - c)}l${f(c)} ${f(c)}l${f(-c)} ${f(c)}M${f(px + c * 1.8)} ${f(py + c)}h${f(c * 2)}`} />
    </g>
  );
}

/** The database glyph: a cylinder of stacked discs. */
export function Database({ x, y, s }: { x: number; y: number; s: number }) {
  const rx = s * 0.42, ry = rx * 0.32, cx = x + s / 2, top = y + ry + s * 0.04, bottom = y + s - ry - s * 0.04;
  const front = (yy: number) => `M${f(cx - rx)} ${f(yy)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(yy)}`;
  return (
    <g class="art">
      <path class="art-fill" d={`M${f(cx - rx)} ${f(top)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${f(top)}V${f(bottom)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(bottom)}Z`} />
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} />
      <path d={`M${f(cx - rx)} ${f(top)}V${f(bottom)}M${f(cx + rx)} ${f(top)}V${f(bottom)}`} />
      {[1 / 3, 2 / 3, 1].map((t) => <path d={front(top + (bottom - top) * t)} />)}
    </g>
  );
}

/** A day: `n` sheets, fanned up and to the left. */
export function Sheets({ x, y, s, n }: { x: number; y: number; s: number; n: number }) {
  const step = s * 0.1, w = s * 0.62, h = s * 0.78;
  return (
    <g class="art">
      {Array.from({ length: n }, (_, i) => {
        const o = (n - 1 - i) * step; // back sheet first, so the front one covers it
        const d = `M${f(x + s - w - o)} ${f(y + s - h - o)}h${f(w)}v${f(h)}h${f(-w)}Z`;
        return <path class="art-sheet" d={d} />;
      })}
    </g>
  );
}
