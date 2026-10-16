// Small wireframe illustrations for the book covers, drawn in a fixed oblique
// view (not the scene's perspective), like a printed cover. Each fits a square
// of side `s` centred on (cx, cy).

const f = (n: number) => n.toFixed(1);

/** A terminal window as a shallow slab: front face, top and right side, a title bar and a prompt. */
export function Terminal({ cx, cy, s }: { cx: number; cy: number; s: number }) {
  const d = s * 0.14;              // depth of the slab
  const w = s - d, h = w * 0.68;
  const x = cx - s / 2, y = cy - (h + d) / 2 + d;
  const bar = y + h * 0.2;
  const r = h * 0.045;
  const px = x + w * 0.1, py = bar + h * 0.24, c = h * 0.075;
  return (
    <g class="art">
      <path class="art-fill" d={`M${f(x)} ${f(y)}l${f(d)} ${f(-d)}h${f(w)}v${f(h)}l${f(-d)} ${f(d)}h${f(-w)}Z`} />
      <path d={`M${f(x)} ${f(y)}l${f(d)} ${f(-d)}h${f(w)}v${f(h)}l${f(-d)} ${f(d)}M${f(x + w)} ${f(y)}l${f(d)} ${f(-d)}`} />
      <path d={`M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}ZM${f(x)} ${f(bar)}h${f(w)}`} />
      {[0, 1, 2].map((i) => <circle cx={x + h * 0.1 + i * h * 0.11} cy={(y + bar) / 2} r={r} />)}
      <path d={`M${f(px)} ${f(py - c)}l${f(c)} ${f(c)}l${f(-c)} ${f(c)}M${f(px + c * 1.7)} ${f(py + c)}h${f(c * 1.8)}`} />
      <path class="art-faint" d={`M${f(px)} ${f(py + h * 0.22)}h${f(w * 0.56)}M${f(px)} ${f(py + h * 0.34)}h${f(w * 0.36)}`} />
    </g>
  );
}

/** The standard database glyph: a cylinder of stacked discs, with the hidden back of the base faint. */
export function Database({ cx, cy, s }: { cx: number; cy: number; s: number }) {
  const rx = s * 0.38, ry = rx * 0.3, h = s * 0.56;
  const top = cy - h / 2;
  const arc = (y: number, sweep: 0 | 1) => `M${f(cx - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 0 ${sweep} ${f(cx + rx)} ${f(y)}`;
  return (
    <g class="art">
      {/* silhouette: over the top, down the right, back along the front of the base */}
      <path class="art-fill" d={`${arc(top, 1)}V${f(top + h)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(top + h)}Z`} />
      <path class="art-faint" d={arc(top + h, 1)} />
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} />
      <path d={`M${f(cx - rx)} ${f(top)}V${f(top + h)}M${f(cx + rx)} ${f(top)}V${f(top + h)}`} />
      {[1 / 3, 2 / 3, 1].map((t) => <path d={arc(top + h * t, 0)} />)}
    </g>
  );
}

/** A stack of `n` plates: the day's level at a glance. */
export function Plates({ cx, cy, s, n }: { cx: number; cy: number; s: number; n: number }) {
  const a = s * 0.4, b = a * 0.52, t = s * 0.05, gap = s * 0.15;
  return (
    <g class="art">
      {Array.from({ length: n }, (_, i) => {
        const y = cy + ((n - 1) / 2 - i) * gap - t / 2; // bottom plate first, so upper ones cover it
        const outline = `M${f(cx - a)} ${f(y)}L${f(cx)} ${f(y - b)}L${f(cx + a)} ${f(y)}V${f(y + t)}L${f(cx)} ${f(y + b + t)}L${f(cx - a)} ${f(y + t)}Z`;
        return (
          <g>
            <path class="art-fill" d={outline} />
            <path d={`${outline}M${f(cx - a)} ${f(y)}L${f(cx)} ${f(y + b)}L${f(cx + a)} ${f(y)}M${f(cx)} ${f(y + b)}V${f(y + b + t)}`} />
          </g>
        );
      })}
    </g>
  );
}
