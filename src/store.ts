// Per-viewer state in localStorage: drafts, progress, layout. Every access is
// guarded — storage can be missing (private mode) and the app must still work.
import { useEffect, useState } from 'preact/hooks';

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    if (value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const getDraft = (path: string) => read<string | null>(`cm:draft:${path}`, null);
export const setDraft = (path: string, text: string | undefined) => write(`cm:draft:${path}`, text);

// 1 = started, 2 = passed
export type Status = 0 | 1 | 2;
let progress = read<Record<string, Status>>('cm:progress', {});
const subs = new Set<() => void>();
export function setStatus(path: string, s: Status) {
  if ((progress[path] ?? 0) === s) return;
  progress = { ...progress, [path]: s };
  if (!s) delete progress[path];
  write('cm:progress', progress);
  subs.forEach((f) => f());
}
export function useProgress() {
  const [p, set] = useState(progress);
  useEffect(() => {
    const f = () => set(progress);
    subs.add(f);
    return () => void subs.delete(f);
  }, []);
  return p;
}

export const getPref = <T,>(k: string, d: T) => read<T>(`cm:pref:${k}`, d);
export const setPref = (k: string, v: unknown) => write(`cm:pref:${k}`, v);
