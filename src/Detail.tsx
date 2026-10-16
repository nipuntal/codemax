import { useEffect, useRef, useState } from 'preact/hooks';
import { loadQuestion, loadSolution, type Question, type Solution } from './data';
import { Editor, fileText, forgetAnswer } from './Editor';
import { setDraft, setStatus, getPref, setPref } from './store';
import * as Icon from './icons';

const Stars = ({ n }: { n: number | null }) => (n ? <span class="stars" aria-label={`difficulty ${n} of 5`}>{'★'.repeat(n)}<i>{'★'.repeat(Math.max(0, 5 - n))}</i></span> : null);
export { Stars };

type Output = { kind: 'run' | 'test'; lines: string[] } | null;

export function Detail({ path, crumb, backHref }: { path: string; crumb: string; backHref: string }) {
  const [q, setQ] = useState<Question | null>(null);
  const [failed, setFailed] = useState(false);
  const [doc, setDoc] = useState('readme');
  const [file, setFile] = useState('');
  const [epoch, setEpoch] = useState(0);
  const [output, setOutput] = useState<Output>(null);
  const [sol, setSol] = useState<Solution | null>(null);

  useEffect(() => {
    let live = true;
    setFailed(false);
    loadQuestion(path).then(
      (next) => {
        if (!live) return;
        setQ(next);
        setDoc('readme');
        setFile(next.answer.name);
        setOutput(null);
        setSol(null);
      },
      () => live && setFailed(true),
    );
    return () => void (live = false);
  }, [path]);

  if (failed) return <div class="empty">Couldn’t load this question.</div>;
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
  // The runners arrive in the next step; for now the drawer shows what will run.
  const run = (kind: 'run' | 'test') =>
    setOutput({
      kind,
      lines: kind === 'test'
        ? [`${q.tests.length} test file${q.tests.length === 1 ? '' : 's'} ready:`, ...q.tests.map((t) => `  ${t.name}`), '', 'The in-browser runner isn’t connected yet.']
        : [`$ ${runHint(q)}`, '', 'The in-browser runner isn’t connected yet.'],
    });

  const docs = sol ? [...q.docs, { id: 'solution', title: 'Solution', html: '' }] : q.docs;
  const current = docs.find((d) => d.id === doc) ?? docs[0];

  return (
    <div class={`detail-inner${stale ? ' stale' : ''}`}>
      <header class="toolbar">
        <a class="tb-back" href={backHref} aria-label="Back to list"><Icon.Back /></a>
        <div class="crumb">{crumb}</div>
        <div class="tb-group">
          <button class="tb-btn" onClick={() => run('run')} title="Run (⌘↵)"><Icon.Play size={16} /><span>Run</span></button>
          <button class="tb-btn primary" onClick={() => run('test')} title="Test (⌘⇧↵)"><Icon.Check size={16} /><span>Test</span></button>
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
            <div class="chips">
              {q.tag && <span class="chip">{q.tag}</span>}
              <span class="chip mono">{q.answer.name}</span>
              <Stars n={q.stars} />
              {q.mins && <span class="chip ghost">{q.mins} min</span>}
            </div>
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

        <section class="code">
          <nav class="files" aria-label="Files">
            <button class={`file answer${file === q.answer.name ? ' on' : ''}`} onClick={() => setFile(q.answer.name)}>
              <Icon.Pencil size={13} />{q.answer.name}
            </button>
            {q.files.map((f) => (
              <button class={`file${file === f.name ? ' on' : ''}`} onClick={() => setFile(f.name)} title="Read-only">{f.name}</button>
            ))}
          </nav>
          <Editor q={q} file={file || q.answer.name} epoch={epoch} />
          {output && (
            <div class="output">
              <div class="output-head">
                <span>{output.kind === 'test' ? 'Test' : 'Run'}</span>
                <button class="tb-icon small" onClick={() => setOutput(null)} aria-label="Close output"><Icon.Close size={14} /></button>
              </div>
              <pre>{output.lines.join('\n')}</pre>
            </div>
          )}
        </section>
      </Split>
    </div>
  );
}

function runHint(q: Question) {
  const a = q.answer.name;
  return q.lang === 'sql' ? `psql -f ${a}` : q.lang === 'python' ? `python3 ${a}` : q.lang === 'shell' ? `./${a}` : `cat ${a}`;
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
