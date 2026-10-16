import { useEffect, useState } from 'preact/hooks';

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((f) => f());
addEventListener('popstate', notify);

export function navigate(to: string, replace = false) {
  if (to === location.pathname) return;
  history[replace ? 'replaceState' : 'pushState'](null, '', to);
  notify();
}

export function usePath(): string {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => {
    const f = () => setPath(location.pathname);
    listeners.add(f);
    return () => void listeners.delete(f);
  }, []);
  return path;
}

// Plain <a href> everywhere, so middle-click and copy-link keep working;
// ordinary clicks are routed in-page.
addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element).closest?.('a[href^="/"]') as HTMLAnchorElement | null;
  if (!a || a.target) return;
  e.preventDefault();
  navigate(a.getAttribute('href')!);
});
