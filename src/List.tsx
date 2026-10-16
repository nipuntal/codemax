import { useEffect, useRef } from 'preact/hooks';
import { count, prefetch, type Scope } from './data';
import type { Status } from './store';
import { Facts } from './Detail';

/** `lead`: something to stand before the title (the rail's toggle, while the rail is hidden). */
export function List({ scope, active, progress, lead }: {
  scope: Scope; active: string | null; progress: Record<string, Status>; lead?: preact.ComponentChildren;
}) {
  const box = useRef<HTMLDivElement>(null);
  // Keep the selected card in view: centred on a deep link, nudged on ↑/↓.
  // Waits a frame so the first layout has settled.
  const first = useRef(true);
  useEffect(() => {
    const block = first.current ? 'center' : 'nearest';
    first.current = false;
    const id = requestAnimationFrame(() => box.current?.querySelector('[aria-current]')?.scrollIntoView({ block }));
    return () => cancelAnimationFrame(id);
  }, [active]);

  return (
    <section class="list">
      <header class="list-head">
        {lead}
        <div>
          <h1>{scope.title}</h1>
          <p class="label">{scope.subtitle} · {count(scope.groups)} questions</p>
        </div>
      </header>
      <div class="list-body" ref={box}>
        {scope.groups.map((g) => (
          <>
            {scope.groups.length > 1 && <h2 class="group label">{g.title}</h2>}
            {g.items.map((q) => {
              const s = progress[q.path] ?? 0;
              return (
                <a href={`/${q.path}`} class="card" aria-current={q.path === active ? 'true' : undefined}
                  onMouseEnter={() => prefetch(q.path)} onFocus={() => prefetch(q.path)} onTouchStart={() => prefetch(q.path)}>
                  <span class={`dot s${s}`} aria-label={s === 2 ? 'passed' : s === 1 ? 'started' : undefined} />
                  <div class="card-top">
                    <strong>{q.title}</strong>
                    <span class="qn label">Q{q.n}</span>
                  </div>
                  <div class="card-sub"><Facts q={q} /></div>
                </a>
              );
            })}
          </>
        ))}
      </div>
    </section>
  );
}
