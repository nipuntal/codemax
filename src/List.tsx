import { useEffect, useRef } from 'preact/hooks';
import { count, prefetch, type Scope } from './data';
import type { Status } from './store';
import { Stars } from './Detail';
import * as Icon from './icons';

const LANG = { shell: 'Shell', python: 'Python', sql: 'SQL', text: 'Text' } as const;

export function List({ scope, active, progress, sidebarOpen, onToggleSidebar }: {
  scope: Scope; active: string | null; progress: Record<string, Status>; sidebarOpen: boolean; onToggleSidebar: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  // Keep the selected card in view when it changes from the keyboard.
  useEffect(() => {
    box.current?.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <section class="list" ref={box}>
      <header class="list-head">
        {!sidebarOpen && <button class="tb-icon" onClick={onToggleSidebar} title="Show sidebar"><Icon.Sidebar /></button>}
        <div>
          <h1>{scope.title}</h1>
          <p>{scope.subtitle} · {count(scope.groups)} questions</p>
        </div>
      </header>
      {scope.groups.map((g) => (
        <>
          {scope.groups.length > 1 && <h2 class="group">{g.title}</h2>}
          {g.items.map((q) => {
            const s = progress[q.path] ?? 0;
            return (
              <a href={`/${q.path}`} class="card" aria-current={q.path === active ? 'true' : undefined}
                onMouseEnter={() => prefetch(q.path)} onFocus={() => prefetch(q.path)} onTouchStart={() => prefetch(q.path)}>
                <span class={`dot s${s}`} aria-label={s === 2 ? 'passed' : s === 1 ? 'started' : undefined} />
                <div class="card-top">
                  <strong>{q.title}</strong>
                  <span class="qn">Q{q.n}</span>
                </div>
                <div class="card-sub">
                  <span>{q.tag ?? LANG[q.lang]}</span>
                  <Stars n={q.stars} />
                  {q.mins && <span class="mins">{q.mins} min</span>}
                </div>
                <p class="card-prev">{q.preview}</p>
              </a>
            );
          })}
        </>
      ))}
    </section>
  );
}
