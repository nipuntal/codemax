// Content is static JSON under /c, produced by scripts/build-content.mjs.
// Every fetch is memoised, so hovering a row warms the cache for the click.
import type { Spec, FileEntry } from './runner/engine';

export type { FileEntry };

export type Lang = 'shell' | 'python' | 'sql' | 'text';

export interface Summary {
  path: string;
  n: number;
  title: string;
  stars: number | null; // difficulty, 1–3
  mins: number | null;
  kind: string | null;  // 3311's language: SQL, PLpgSQL, Python + Psycopg2
}
export interface Group { id: string | null; title: string | null; items: Summary[] }
export interface QSet { id: string; title: string; blurb: string; groups: Group[] }
export interface Course { id: string; title: string; sub: string; sets: QSet[] }
export interface Index { courses: Course[] }

export interface Doc { id: string; title: string; html: string }
export interface Question {
  path: string;
  title: string;
  stars: number | null;
  mins: number | null;
  kind: string | null;
  lang: Lang;
  answer: { name: string; text: string };
  docs: Doc[];
  files: FileEntry[];
  tests: Spec;
  run: string;
}
export interface Solution { files: FileEntry[]; docs: Doc[] }

const cache = new Map<string, Promise<unknown>>();
function get<T>(url: string): Promise<T> {
  let p = cache.get(url) as Promise<T> | undefined;
  if (!p) {
    p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return r.json() as Promise<T>;
    });
    p.catch(() => cache.delete(url));
    cache.set(url, p);
  }
  return p;
}

export const loadIndex = () => get<Index>('/c/index.json');
export const loadQuestion = (path: string) => get<Question>(`/c/${path}.json`);
export const loadSolution = (path: string) => get<Solution>(`/c/${path}.sol.json`);
export const prefetch = (path: string) => void loadQuestion(path).catch(() => {});

// A list "scope" is any non-question route: a course, a set, or a set's group.
export interface Scope { key: string; title: string; subtitle: string; groups: Group[] }

export function scopeFor(index: Index, segs: string[]): Scope | null {
  const course = index.courses.find((c) => c.id === segs[0]);
  if (!course) return null;
  if (segs.length === 1) {
    return {
      key: course.id, title: course.title, subtitle: course.sub,
      groups: course.sets.flatMap((s) => s.groups.map((g) => ({ ...g, title: g.title ? `${s.title} · ${g.title}` : s.title }))),
    };
  }
  const set = course.sets.find((s) => s.id === segs[1]);
  if (!set) return null;
  const group = segs[2] && set.groups.find((g) => g.id === segs[2]);
  if (group) return { key: `${course.id}/${set.id}/${group.id}`, title: `${set.title} · ${group.title}`, subtitle: set.blurb, groups: [group] };
  return { key: `${course.id}/${set.id}`, title: set.title, subtitle: set.blurb, groups: set.groups };
}

export const count = (groups: Group[]) => groups.reduce((n, g) => n + g.items.length, 0);
