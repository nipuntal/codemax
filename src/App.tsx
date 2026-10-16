import { useEffect, useRef, useState } from 'preact/hooks';
import { loadIndex, scopeFor, type Index, type Scope } from './data';
import { navigate, usePath } from './router';
import { getPref, setPref, useProgress } from './store';
import { Sidebar } from './Sidebar';
import { List } from './List';
import { Detail } from './Detail';
import { Shelves } from './shelves/Shelves';

export function App() {
  const path = usePath();
  const progress = useProgress();
  const [index, setIndex] = useState<Index | null>(null);
  const [sidebar, setSidebar] = useState<boolean>(() => getPref('sidebar', innerWidth >= 1100));
  const lastScope = useRef<Scope | null>(null);

  useEffect(() => void loadIndex().then(setIndex), []);

  const toggleSidebar = () => {
    setSidebar(!sidebar);
    setPref('sidebar', !sidebar);
  };

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
  const current = items.find((i) => i.path === qpath);
  // "Day 1 · Python · Q5": name the question's own group, not the list's.
  const home = qpath && index ? scopeFor(index, segs.slice(0, -1)) : null;
  const crumb = home ? `${home.title} · Q${segs[segs.length - 1]}` : '';

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
  if (path === '/') return <Shelves index={index} />;

  return (
    <div class="app" data-sidebar={sidebar ? 'open' : 'closed'} data-view={qpath ? 'detail' : 'list'}>
      {sidebar && <Sidebar index={index} active={scope?.key ?? ''} progress={progress} onToggle={toggleSidebar} />}
      {sidebar && <div class="scrim" onClick={toggleSidebar} />}
      {scope
        ? <List scope={scope} active={qpath} progress={progress} sidebarOpen={sidebar} onToggleSidebar={toggleSidebar} />
        : <section class="list"><div class="empty">Nothing here.</div></section>}
      <main class="detail">
        {qpath && scope
          ? <Detail path={qpath} crumb={crumb} backHref={`/${scope.key}`} />
          : <div class="empty">{scope ? 'Pick a question' : 'Not found'}</div>}
      </main>
    </div>
  );
}
