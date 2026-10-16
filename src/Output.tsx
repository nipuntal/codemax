import type { CaseResult, RunResult } from './runner/client';
import * as Icon from './icons';

export type OutputState =
  | { kind: 'run'; busy: boolean; status?: string; result?: RunResult; error?: string }
  | { kind: 'test'; busy: boolean; status?: string; results?: CaseResult[]; error?: string };

const MAX_LINES = 400;
const clip = (s: string) => {
  const lines = s.split('\n');
  return lines.length > MAX_LINES ? lines.slice(0, MAX_LINES).join('\n') + `\n… ${lines.length - MAX_LINES} more lines` : s;
};

export function Output({ state, command, onCommand, onRun, onClose }: {
  state: OutputState;
  command: string;
  onCommand: (c: string) => void;
  onRun: () => void;
  onClose: () => void;
}) {
  const passed = state.kind === 'test' && state.results ? state.results.filter((r) => r.pass).length : 0;
  const total = state.kind === 'test' && state.results ? state.results.length : 0;
  return (
    <div class="output">
      <div class="output-head">
        {state.kind === 'run' ? (
          <form class="cmd" onSubmit={(e) => { e.preventDefault(); onRun(); }}>
            <span class="prompt">$</span>
            <input value={command} onInput={(e) => onCommand(e.currentTarget.value)} spellcheck={false}
              autocomplete="off" autocapitalize="off" aria-label="Command to run" />
          </form>
        ) : (
          <span class={`verdict label${state.results ? (passed === total ? ' pass' : ' fail') : ''}`}>
            {state.busy ? 'Testing…' : state.results ? `${passed} of ${total} passed` : 'Test'}
          </span>
        )}
        <button class="tb-icon small" onClick={onClose} aria-label="Close output"><Icon.Close size={14} /></button>
      </div>
      <div class="output-body">
        {state.busy && <p class="muted">{state.status || 'Running…'}</p>}
        {state.error && <pre class="err">{state.error}</pre>}
        {state.kind === 'run' && state.result && (
          <>
            <pre>{clip(state.result.output) || <span class="muted">(no output)</span>}</pre>
            {state.result.exitCode !== 0 && <p class="muted">exit status {state.result.exitCode}</p>}
          </>
        )}
        {state.kind === 'test' && state.results?.map((r) => <Case r={r} single={total === 1} />)}
      </div>
    </div>
  );
}

function Case({ r, single }: { r: CaseResult; single: boolean }) {
  return (
    <details class={`case ${r.pass ? 'pass' : 'fail'}`} open={!r.pass}>
      <summary>
        <span class="mark">{r.pass ? <Icon.Check size={14} /> : <Icon.Close size={14} />}</span>
        <code>{single ? r.show.split('\n')[0] : r.show}</code>
      </summary>
      {single && r.show.includes('\n') && <pre class="muted">{r.show}</pre>}
      {!r.pass && (
        <>
          {r.note && <p class="note">{r.note}</p>}
          <Diff want={r.want} got={r.got} />
        </>
      )}
    </details>
  );
}

// Line diff (LCS): "−" lines were expected but missing, "+" lines are extra.
function Diff({ want, got }: { want: string; got: string }) {
  const a = clip(want).split('\n'), b = clip(got).split('\n');
  const n = a.length, m = b.length;
  const L = new Uint16Array((n + 1) * (m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      L[i * (m + 1) + j] = a[i] === b[j] ? L[(i + 1) * (m + 1) + j + 1] + 1 : Math.max(L[(i + 1) * (m + 1) + j], L[i * (m + 1) + j + 1]);
    }
  }
  const rows: [string, string][] = [];
  let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) { rows.push([' ', a[i]]); i++; j++; }
    else if (i < n && (j >= m || L[(i + 1) * (m + 1) + j] >= L[i * (m + 1) + j + 1])) rows.push(['−', a[i++]]);
    else rows.push(['+', b[j++]]);
  }
  return (
    <div class="diff">
      <div class="legend label"><span class="minus">− expected</span><span class="plus">+ yours</span></div>
      <pre>{rows.map(([k, l]) => <div class={k === '+' ? 'plus' : k === '−' ? 'minus' : ''}>{k} {l || ' '}</div>)}</pre>
    </div>
  );
}
