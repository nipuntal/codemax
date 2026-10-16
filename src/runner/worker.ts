// The runner's home in the browser: a module worker, so a runaway program can
// be stopped by terminating it, and the page never stutters.
import { configurePy, warmPy } from './py';
import { configurePg, ensurePg } from './pg';
import { run, test, type Job } from './engine';

export type Request =
  | { id: number; type: 'run'; job: Job; command: string }
  | { id: number; type: 'test'; job: Job }
  | { id: number; type: 'warm'; python: boolean; pg: boolean };
export type Reply =
  | { id: number; type: 'status'; text: string }
  | { id: number; type: 'done'; result: unknown }
  | { id: number; type: 'error'; message: string };

const PYODIDE = `/pyodide/${__PYODIDE_VERSION__}/`;
let current = 0;
const status = (text: string) => postMessage({ id: current, type: 'status', text } satisfies Reply);

// A status with text means "loading" (the page pauses its time limit);
// an empty one means loading is over.
const loading = async <T,>(text: string, f: () => Promise<T>) => {
  status(text);
  try { return await f(); } finally { status(''); }
};
const loadPy = () => loading('Loading Python (first run only)…', async () => {
  const { loadPyodide } = await import('pyodide');
  return loadPyodide({ indexURL: PYODIDE });
});
const loadPg = () => loading('Loading Postgres (first run only)…', async () => {
  const [{ PGlite }, sql] = await Promise.all([
    import('@electric-sql/pglite'),
    fetch('/c/3311/classes.txt').then((r) => r.text()),
  ]);
  return { PGlite, sql };
});
configurePg(loadPg);
configurePy(loadPy, ensurePg);

onmessage = async (e: MessageEvent<Request>) => {
  const req = e.data;
  current = req.id;
  try {
    let result: unknown;
    if (req.type === 'warm') {
      // start the downloads while the student is still typing
      if (req.pg) void ensurePg().catch(() => {});
      if (req.python) void warmPy().catch(() => {});
      result = null;
    } else if (req.type === 'run') result = await run(req.job, req.command);
    else result = await test(req.job);
    postMessage({ id: req.id, type: 'done', result } satisfies Reply);
  } catch (err) {
    postMessage({ id: req.id, type: 'error', message: err instanceof Error ? err.message : String(err) } satisfies Reply);
  }
};
