import { useEffect, useRef, useState } from 'preact/hooks';
import { loadQuestion, loadSolution, prefetch, type Question, type Solution } from './data';
import { Editor, answerText, fileText, forgetAnswer } from './Editor';
import { setDraft, setStatus, getPref, setPref } from './store';
import { Output, type OutputState } from './Output';
import * as runner from './runner/client';
import * as Icon from './icons';
import { navigate } from './router';

const LEVELS = ['Easy', 'Medium', 'Hard'];
/** Difficulty (1–3): slanted bars lit up to the level, then its name. */
export const Level = ({ n }: { n: number | null }) => (n ? (
  <span class="level label">
    <span class="bars" aria-hidden="true">{LEVELS.map((_, k) => <i class={k < n ? 'on' : undefined} />)}</span>
    {LEVELS[n - 1]}
  </span>
) : null);

/**
 * A question's row of facts: difficulty on the left (or "Lesson" for the unrated
 * teaching modules), and its time on the right (or, where the course gives no
 * times, its language).
 */
export const Facts = ({ q }: { q: Pick<Question, 'stars' | 'mins' | 'kind'> }) => (
  <>
    {q.stars ? <Level n={q.stars} /> : <span class="level label">Lesson</span>}
    <span class="mins label">{q.mins ? `${q.mins} min` : q.kind}</span>
  </>
);

/** A shortcut, one key per square. */
const Keys = ({ k }: { k: string[] }) => <span class="keys" aria-hidden="true">{k.map((x) => <kbd>{x}</kbd>)}</span>;

// The Run command each question was last given (this session only).
const commands = new Map<string, string>();
const MOD = /Mac|iP/.test(navigator.platform) ? '⌘' : 'Ctrl';
const ADVANCE_MS = 900; // a beat to see it pass before moving on

const jobOf = (q: Question): runner.Job => ({ path: q.path, answer: { name: q.answer.name, text: answerText(q) }, files: q.files, tests: q.tests });

/** `next`: the question after this one in the list, moved on to once every test passes. */
export function Detail({ path, crumb, backHref, next }: { path: string; crumb: string; backHref: string; next: string | null }) {
  const [q, setQ] = useState<Question | null>(null);
  const [failed, setFailed] = useState(false);
  const [doc, setDoc] = useState('readme');
  const [file, setFile] = useState('');
  const [epoch, setEpoch] = useState(0);
  const [out, setOut] = useState<OutputState | null>(null);
  const [command, setCommand] = useState('');
  const [sol, setSol] = useState<Solution | null>(null);
  const shown = useRef(path); // the question on screen, so late results don't land on another
  shown.current = path;
  const nextRef = useRef(next);
  nextRef.current = next;
  const advance = useRef(0);
  useEffect(() => () => clearTimeout(advance.current), [path]);
  // have the next question in hand, so moving on to it is instant
  useEffect(() => void (next && prefetch(next)), [next]);

  useEffect(() => {
    let live = true;
    setFailed(false);
    loadQuestion(path).then(
      (next) => {
        if (!live) return;
        setQ(next);
        setDoc('readme');
        setFile(next.answer.name);
        setOut(null);
        setSol(null);
        setCommand(commands.get(next.path) ?? next.run);
        warmed.current = false;
        runner.warm(next, false); // the shell is small: have it ready
      },
      () => live && setFailed(true),
    );
    return () => void (live = false);
  }, [path]);

  // Python and Postgres are big: fetch them once the student shows intent
  const warmed = useRef(false);
  const warmHeavy = () => {
    if (!q || warmed.current) return;
    warmed.current = true;
    runner.warm(q, true);
  };

  const go = async (kind: 'run' | 'test') => {
    if (!q) return;
    clearTimeout(advance.current); // asked for something else: stay
    if (out?.busy) return runner.stop();
    const forPath = q.path;
    const land = (o: OutputState) => shown.current === forPath && setOut(o);
    const status = (s: string) => shown.current === forPath && setOut((o) => o && { ...o, status: s });
    try {
      if (kind === 'run') {
        commands.set(q.path, command);
        if (!command.trim()) return setOut({ kind: 'run', busy: false });
        setOut({ kind: 'run', busy: true });
        land({ kind: 'run', busy: false, result: await runner.run(jobOf(q), command, status) });
      } else {
        setOut({ kind: 'test', busy: true });
        const results = await runner.test(jobOf(q), status);
        const passed = results.every((r) => r.pass);
        setStatus(q.path, passed ? 2 : 1);
        const to = passed && shown.current === forPath ? nextRef.current : null;
        land({ kind: 'test', busy: false, results, next: !!to });
        if (to) advance.current = setTimeout(() => shown.current === forPath && navigate(`/${to}`), ADVANCE_MS);
      }
    } catch (e) {
      land({ kind, busy: false, error: (e as Error).message } as OutputState);
    }
  };

  // ⌘↵ runs, ⌘⇧↵ tests — even from inside the editor
  const goRef = useRef(go);
  goRef.current = go;
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || !(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      e.stopPropagation();
      void goRef.current(e.shiftKey ? 'test' : 'run');
    };
    addEventListener('keydown', key, true);
    return () => removeEventListener('keydown', key, true);
  }, []);

  if (failed) return <div class="empty label">Couldn’t load this question</div>;
  if (!q) return <div class="detail-loading" />;
  const stale = q.path !== path;

  const reset = () => {
    if (!confirm('Reset your answer to the starter file?')) return;
    setDraft(q.path, undefined);
    setStatus(q.path, 0);
    forgetAnswer(q);
    setFile(q.answer.name);
    setEpoch((e) => e + 1);
  };
  const reveal = () => {
    if (sol) return setDoc('solution');
    loadSolution(q.path).then((s) => {
      setSol(s);
      setDoc('solution');
    });
  };
  const busy = out?.busy ? out.kind : null;

  const docs = sol ? [...q.docs, { id: 'solution', title: 'Solution', html: '' }] : q.docs;
  const current = docs.find((d) => d.id === doc) ?? docs[0];

  return (
    <div class={`detail-inner${stale ? ' stale' : ''}`}>
      <header class="toolbar">
        <a class="tb-back" href={backHref} aria-label="Back to list"><Icon.Back /></a>
        <div class="crumb label">{crumb}</div>
        <div class="tb-group" onPointerEnter={warmHeavy}>
          <button class="tb-btn" onClick={() => go('run')} disabled={busy === 'test'} title={`Run (${MOD} ↵)`}>
            {busy === 'run' ? <><Icon.Stop size={16} /><span>Stop</span></> : <><Icon.Play size={16} /><span>Run</span></>}
            <Keys k={[MOD, '↵']} />
          </button>
          <button class="tb-btn primary" onClick={() => go('test')} disabled={busy === 'run'} title={`Test (${MOD} ⇧ ↵)`}>
            {busy === 'test' ? <><Icon.Stop size={16} /><span>Stop</span></> : <><Icon.Check size={16} /><span>Test</span></>}
            <Keys k={[MOD, '⇧', '↵']} />
          </button>
        </div>
        <div class="tb-group">
          <button class="tb-icon" onClick={reset} title="Reset to starter"><Icon.Reset /></button>
          <button class={`tb-icon${doc === 'solution' ? ' on' : ''}`} onClick={reveal} title="Solution"><Icon.Bulb /></button>
        </div>
      </header>

      <Split>
        <article class="doc">
          <div class="doc-head">
            <h1>{q.title}</h1>
            <div class="meta"><Facts q={q} /></div>
            {docs.length > 1 && (
              <nav class="seg" role="tablist">
                {docs.map((d) => (
                  <button role="tab" aria-selected={d.id === current.id} onClick={() => setDoc(d.id)}>{d.title}</button>
                ))}
              </nav>
            )}
          </div>
          {current.id === 'solution' && sol ? (
            <div class="md">
              {sol.files.map((f) => (<><h3 class="mono">{f.name}</h3><pre class="plain"><code>{fileText(f)}</code></pre></>))}
              {sol.docs.map((d) => (<><h2>{d.title}</h2><div dangerouslySetInnerHTML={{ __html: d.html }} /></>))}
            </div>
          ) : (
            <div class="md" key={q.path + current.id} dangerouslySetInnerHTML={{ __html: current.html }} />
          )}
        </article>

        <section class="code" onKeyDown={warmHeavy}>
          <nav class="files" aria-label="Files">
            <button class={`file answer${file === q.answer.name ? ' on' : ''}`} onClick={() => setFile(q.answer.name)}>
              <Icon.Pencil size={13} />{q.answer.name}
            </button>
            {q.files.map((f) => (
              <button class={`file${file === f.name ? ' on' : ''}`} onClick={() => setFile(f.name)} title="Read-only">{f.name}</button>
            ))}
          </nav>
          <Editor q={q} file={file || q.answer.name} epoch={epoch} />
          {out && (
            <Output state={out} command={command} onCommand={setCommand}
              onRun={() => go('run')} onClose={() => { clearTimeout(advance.current); if (out.busy) runner.stop(); setOut(null); }} />
          )}
        </section>
      </Split>
    </div>
  );
}

// Two panes and a draggable divider. Dragging writes a CSS variable directly,
// so it never re-renders the panes.
function Split({ children }: { children: preact.ComponentChildren }) {
  const el = useRef<HTMLDivElement>(null);
  const init = getPref('split', 0.5);
  const down = (e: PointerEvent) => {
    const box = el.current!, rect = box.getBoundingClientRect();
    const vertical = getComputedStyle(box).flexDirection === 'column';
    (e.target as Element).setPointerCapture(e.pointerId);
    box.classList.add('dragging');
    let r = init;
    const move = (ev: PointerEvent) => {
      r = vertical ? (ev.clientY - rect.top) / rect.height : (ev.clientX - rect.left) / rect.width;
      r = Math.min(0.75, Math.max(0.25, r));
      box.style.setProperty('--split', String(r));
    };
    const up = () => {
      box.classList.remove('dragging');
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      setPref('split', r);
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
  };
  const [a, b] = children as preact.VNode[];
  return (
    <div class="split" ref={el} style={{ '--split': init }}>
      {a}
      <div class="gutter" onPointerDown={down} role="separator" aria-orientation="vertical" />
      {b}
    </div>
  );
}
