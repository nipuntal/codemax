// Page side of the runner. The worker starts on first use; a run that goes
// on too long (or is stopped) terminates it, and the next run starts afresh.
import type { Job, CaseResult, RunResult } from './engine';
import type { Reply, Request } from './worker';

export type { CaseResult, RunResult, Job };

const LIMIT_MS = 20_000;
let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void; status?: (s: string) => void }>();

function get() {
  if (worker) return worker;
  worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e: MessageEvent<Reply>) => {
    const r = e.data;
    if (r.type === 'status') {
      // loading messages may belong to an earlier warm-up; show them on whatever is running
      for (const p of pending.values()) p.status?.(r.text);
      return;
    }
    const p = pending.get(r.id);
    if (!p) return;
    pending.delete(r.id);
    r.type === 'done' ? p.resolve(r.result) : p.reject(new Error(r.message));
  };
  worker.onerror = (e) => kill(`The runner crashed: ${e.message || 'unknown error'}`);
  return worker;
}

function kill(reason: string) {
  worker?.terminate();
  worker = null;
  for (const p of pending.values()) p.reject(new Error(reason));
  pending.clear();
}

function call<T>(msg: Omit<Request, 'id'>, status?: (s: string) => void, limit = LIMIT_MS): Promise<T> {
  const id = ++seq;
  const w = get();
  return new Promise<T>((resolve, reject) => {
    // the clock is paused while a runtime downloads, so a slow first load isn't a "timeout"
    let timer = 0;
    const arm = () => { clearTimeout(timer); timer = window.setTimeout(() => kill(`Stopped after ${limit / 1000}s — is there an infinite loop?`), limit); };
    pending.set(id, {
      resolve: (v) => { clearTimeout(timer); resolve(v); },
      reject: (e) => { clearTimeout(timer); reject(e); },
      status: (s) => { status?.(s); s ? clearTimeout(timer) : arm(); },
    });
    arm();
    w.postMessage({ ...msg, id });
  });
}

export const run = (job: Job, command: string, status?: (s: string) => void) =>
  call<RunResult>({ type: 'run', job, command } as Omit<Request, 'id'>, status);
export const test = (job: Job, status?: (s: string) => void) =>
  call<CaseResult[]>({ type: 'test', job } as Omit<Request, 'id'>, status);
export const stop = () => kill('Stopped.');

/**
 * Get ready before the first Run: `heavy` also starts downloading Python and
 * Postgres if this question needs them (several MB, so only on intent).
 */
export function warm(job: Pick<Job, 'path' | 'answer'>, heavy: boolean) {
  const python = heavy && job.answer.name.endsWith('.py');
  const pg = heavy && job.path.startsWith('3311/');
  void call({ type: 'warm', python, pg } as Omit<Request, 'id'>).catch(() => {});
}
