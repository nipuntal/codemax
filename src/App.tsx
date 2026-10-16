import { useEffect, useRef, useState } from 'preact/hooks';
import { loadIndex, scopeFor, type Index, type Scope } from './data';
import { navigate, usePath } from './router';
import { getPref, setPref, useProgress } from './store';
import { List } from './List';
import { Detail } from './Detail';
import { Shelves } from './shelves/Shelves';
import { Rail, RailToggle } from './shelves/Rail';

export function App() {
  const path = usePath();
  const progress = useProgress();
  const [index, setIndex] = useState<Index | null>(null);
  const lastScope = useRef<Scope | null>(null);
  const [railOpen, setRailOpen] = useState(() => getPref('rail', true));
  const toggleRail = () => setRailOpen((o) => (setPref('rail', !o), !o));

  useEffect(() => void loadIndex().then(setIndex), []);

  const segs = path.split('/').filter(Boolean);
  const isQuestion = segs.length > 2 && /^\d+$/.test(segs[segs.length - 1]);
  const qpath = isQuestion ? segs.join('/') : null;

  // Keep the list the user was browsing while they open questions inside it
  // (Mail keeps the mailbox selected while you read a message).
  let scope: Scope | null = null;
  if (index) {
    const prev = lastScope.current;
    scope = qpath && prev && qpath.startsWith(prev.key + '/') ? prev : scopeFor(index, isQuestion ? segs.slice(0, -1) : segs);
    if (scope) lastScope.current = scope;
  }
  const items = scope ? scope.groups.flatMap((g) => g.items) : [];
  const at = items.findIndex((i) => i.path === qpath);
  const current = items[at];
  const next = at >= 0 ? items[at + 1]?.path ?? null : null;
  // "COMP2041 · Day 1 · Python · Q5": name the question's own group, not the list's.
  const home = qpath && index ? scopeFor(index, segs.slice(0, -1)) : null;
  const course = index?.courses.find((c) => c.id === segs[0]);
  const crumb = home && course ? `${course.title} · ${home.title} · Q${segs[segs.length - 1]}` : '';

  useEffect(() => {
    document.title = current ? `${current.title} · codemax` : scope ? `${scope.title} · codemax` : 'codemax';
  }, [current, scope?.key]);

  // ↑/↓ moves through the list, unless the user is typing.
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      if ((e.target as Element).closest?.('.cm-editor, input, textarea')) return;
      e.preventDefault();
      const i = items.findIndex((x) => x.path === qpath);
      const next = items[i < 0 ? 0 : Math.min(items.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))];
      if (next) navigate(`/${next.path}`);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [items, qpath]);

  if (!index) return <div class="app booting" />;
  // while the rail is hidden, its toggle stands before the list's title
  const lead = !railOpen && <RailToggle open={false} onToggle={toggleRail} />;
  if (path === '/') return <Shelves index={index} />;

  return (
    <div class={`app${railOpen ? '' : ' rail-closed'}`} data-view={qpath ? 'detail' : 'list'}>
      {railOpen && <Rail index={index} course={segs[0]} set={segs[1]} onToggle={toggleRail} />}
      {scope
        ? <List scope={scope} active={qpath} progress={progress} lead={lead} />
        : <section class="list">{lead && <header class="list-head">{lead}</header>}<div class="empty label">Nothing here</div></section>}
      <main class="detail">
        {qpath && scope
          ? <Detail path={qpath} crumb={crumb} backHref={`/${scope.key}`} next={next} />
          : <div class="empty label">{scope ? 'Pick a question' : 'Not found'}</div>}
      </main>
    </div>
  );
}
