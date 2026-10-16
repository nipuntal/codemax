import { useState } from 'preact/hooks';
import { count, type Index } from './data';
import { getPref, setPref, type Status } from './store';
import * as Icon from './icons';

const groupIcon = (id: string | null, course: string) =>
  id === 'shell' ? <Icon.Terminal /> : id === 'python' ? <Icon.Snake /> : course === '3311' ? <Icon.Db /> : <Icon.Tray />;

export function Sidebar({ index, active, progress, onToggle }: {
  index: Index; active: string; progress: Record<string, Status>; onToggle: () => void;
}) {
  const [closed, setClosed] = useState<Record<string, boolean>>(() => getPref('collapsed', {}));
  const flip = (k: string) => {
    const next = { ...closed, [k]: !closed[k] };
    setClosed(next);
    setPref('collapsed', next);
  };
  const done = (prefix: string) => Object.keys(progress).filter((p) => p.startsWith(prefix + '/') && progress[p] === 2).length;

  const Row = ({ href, icon, label, n, depth, chevron }: {
    href: string; icon: preact.JSX.Element; label: string; n: number; depth: number; chevron?: string;
  }) => (
    <div class={`row d${depth}${active === href.slice(1) ? ' on' : ''}`}>
      {chevron !== undefined
        ? <button class={`disc${closed[chevron] ? '' : ' open'}`} onClick={() => flip(chevron)} aria-label="Toggle"><Icon.Chevron size={12} /></button>
        : <span class="disc" />}
      <a href={href} aria-current={active === href.slice(1) ? 'page' : undefined}>
        <span class="ico">{icon}</span>
        <span class="label">{label}</span>
        <span class="n">{done(href.slice(1)) ? `${done(href.slice(1))}/${n}` : n}</span>
      </a>
    </div>
  );

  return (
    <aside class="sidebar">
      <div class="sb-head">
        <a class="brand" href="/">codemax</a>
        <button class="tb-icon" onClick={onToggle} title="Hide sidebar"><Icon.Sidebar /></button>
      </div>
      {index.courses.map((c) => (
        <section>
          <h2 class="sb-label">{c.sub}</h2>
          <Row href={`/${c.id}`} icon={<Icon.Book />} label={c.title} n={c.sets.reduce((n, s) => n + count(s.groups), 0)} depth={0} />
          {c.sets.map((s) => {
            const k = `${c.id}/${s.id}`;
            const grouped = s.groups.length > 1;
            return (
              <>
                <Row href={`/${k}`} icon={groupIcon(null, c.id)} label={s.title} n={count(s.groups)} depth={1} chevron={grouped ? k : undefined} />
                {grouped && !closed[k] && s.groups.map((g) => (
                  <Row href={`/${k}/${g.id}`} icon={groupIcon(g.id, c.id)} label={g.title!} n={g.items.length} depth={2} />
                ))}
              </>
            );
          })}
        </section>
      ))}
    </aside>
  );
}
