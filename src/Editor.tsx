import { useEffect, useRef } from 'preact/hooks';
import type { FileEntry, Lang, Question } from './data';
import { getDraft, getStatus, setDraft, setStatus } from './store';
import type { EditorState, EditorView } from './cm';

// Start fetching CodeMirror as soon as this module is evaluated (app start),
// in parallel with the content JSON.
const cm = import('./cm');

// One EditorState per open file, kept across navigation so undo history and
// cursor position survive switching questions.
const states = new Map<string, EditorState>();
export const forgetAnswer = (q: Question) => states.delete(`${q.path}::${q.answer.name}`);

const timers = new Map<string, number>();
function save(q: Question, text: string) {
  clearTimeout(timers.get(q.path));
  timers.delete(q.path);
  const pristine = text === q.answer.text;
  setDraft(q.path, pristine ? undefined : text);
  if (pristine) setStatus(q.path, 0);
  else if (!getStatus(q.path)) setStatus(q.path, 1);
}
function saveLater(q: Question, text: string) {
  clearTimeout(timers.get(q.path));
  timers.set(q.path, window.setTimeout(() => save(q, text), 300));
}

// The view on screen, so Run/Test read exactly what is in the editor.
let live: { view: EditorView; key: string } | null = null;

/** The answer as it stands right now (saved first, so nothing is lost). */
export function answerText(q: Question) {
  const k = `${q.path}::${q.answer.name}`;
  const text = live?.key === k ? live.view.state.doc.toString() : states.get(k)?.doc.toString() ?? getDraft(q.path) ?? q.answer.text;
  if (timers.has(q.path)) save(q, text);
  return text;
}

const langOf = (name: string, fallback: Lang): Lang =>
  /\.sh$/.test(name) ? 'shell' : /\.py$/.test(name) ? 'python' : /\.sql$/.test(name) ? 'sql' : fallback;

export function fileText(f: FileEntry) {
  return f.text ?? `(binary file, ${Math.floor((f.b64!.length * 3) / 4)} bytes)`;
}

export function Editor({ q, file, epoch }: { q: Question; file: string; epoch: number }) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const key = useRef('');
  const mod = useRef<typeof import('./cm') | null>(null);

  function show() {
    const m = mod.current, v = view.current;
    if (!m || !v) return;
    if (key.current) states.set(key.current, v.state);
    const k = `${q.path}::${file}`;
    let s = states.get(k);
    if (!s) {
      if (file === q.answer.name) {
        s = m.createState(getDraft(q.path) ?? q.answer.text, q.lang, { onChange: (t) => saveLater(q, t) });
      } else {
        const f = q.files.find((x) => x.name === file);
        s = m.createState(f ? fileText(f) : '', langOf(file, 'text'), { readOnly: true });
      }
    }
    key.current = k;
    v.setState(s);
    live = { view: v, key: k };
  }

  useEffect(() => {
    let dead = false;
    cm.then((m) => {
      if (dead) return;
      mod.current = m;
      view.current = m.createView(host.current!);
      show();
    });
    return () => {
      dead = true;
      if (view.current && key.current) states.set(key.current, view.current.state);
      view.current?.destroy();
      live = null;
    };
  }, []);

  const lastEpoch = useRef(epoch);
  useEffect(() => {
    if (epoch !== lastEpoch.current) key.current = ''; // answer was reset: don't save the old state back
    lastEpoch.current = epoch;
    show();
  }, [q.path, file, epoch]);

  return <div class="editor" ref={host} />;
}
