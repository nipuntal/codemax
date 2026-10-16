// Run and Test, independent of where they execute (browser worker or Node).
import { makeShell, routeExecs, interpreterFor } from './shell';
import { ensurePg, query } from './pg';
import { warmPy } from './py';

export interface FileEntry { name: string; text?: string; b64?: string; x?: boolean }
export interface Case { name: string; show: string; script: string; expected?: string; reload?: boolean }
export interface Spec {
  kind: 'compare' | 'exact';
  setup?: string | null;
  cases: Case[];
  files?: FileEntry[];
}
export interface Job { path: string; answer: { name: string; text: string }; files: FileEntry[]; tests: Spec }

export interface CaseResult {
  name: string;
  show: string;
  pass: boolean;
  got: string;
  want: string;
  note?: string;
}
export interface RunResult { output: string; exitCode: number }

const GOT = '/tmp/.codemax-got', WANT = '/tmp/.codemax-want';
const usesPg = (job: Job) => job.path.startsWith('3311/');

function b64(s: string) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function shellFor(job: Job) {
  const files: Record<string, string | Uint8Array> = {};
  for (const f of [...job.files, ...(job.tests.files ?? [])]) files[f.name] = f.text ?? b64(f.b64!);
  files[job.answer.name] = job.answer.text;
  const sh = await makeShell(files, [job.answer.name, ...job.files.filter((f) => f.x).map((f) => f.name)]);
  const answerInterp = interpreterFor(job.answer.text, job.answer.name);
  const lookup = (target: string) => {
    if (target === '"$A"' || target === '$A' || target === `./${job.answer.name}`) return answerInterp;
    const name = target.slice(2);
    const f = files[name];
    if (typeof f === 'string') return interpreterFor(f, name);
    return /\.py$/.test(name) ? 'python3' : /\.sh$/.test(name) ? 'dash' : null;
  };
  // stdout and stderr interleaved, as a terminal (and `2>&1`) shows them
  const exec = (script: string) => sh.exec(`{\n${routeExecs(script, lookup)}\n} 2>&1`);
  return { sh, exec };
}

/** 3311: every run is wrapped in a transaction that is rolled back. */
async function isolated<T>(job: Job, f: () => Promise<T>): Promise<T> {
  if (!usesPg(job)) return f();
  // a Python answer needs both runtimes: fetch them side by side
  await Promise.all([ensurePg(), job.answer.name.endsWith('.py') && warmPy()]);
  query('BEGIN');
  try {
    return await f();
  } finally {
    query('ROLLBACK');
  }
}

async function load(job: Job, exec: (s: string) => Promise<{ stdout: string; exitCode: number }>) {
  if (!job.tests.setup) return null;
  const r = await exec(job.tests.setup);
  return r.exitCode === 0 ? null : `Your ${job.answer.name} did not load:\n${r.stdout}`;
}

export async function run(job: Job, command: string): Promise<RunResult> {
  return isolated(job, async () => {
    const { exec } = await shellFor(job);
    const failed = await load(job, exec);
    if (failed) return { output: failed, exitCode: 1 };
    const r = await exec(command);
    return { output: r.stdout, exitCode: r.exitCode };
  });
}

export async function test(job: Job): Promise<CaseResult[]> {
  if (job.tests.kind === 'exact') return exactCases(job);
  const out: CaseResult[] = [];
  for (const c of job.tests.cases) out.push(await compareCase(job, c));
  return out;
}

// 2041: the test script itself computes $got and $want.
async function compareCase(job: Job, c: Case): Promise<CaseResult> {
  const { sh, exec } = await shellFor(job);
  const r = await exec(c.script);
  const read = async (p: string) => ((await sh.fs.exists(p)) ? sh.fs.readFile(p) : null);
  const got = await read(GOT), want = (await read(WANT)) ?? '';
  if (got === null) return { name: c.name, show: c.show, pass: false, got: r.stdout, want, note: 'The test could not finish.' };
  return { name: c.name, show: c.show, ...verdict(got, want) };
}

// 3311, like the course's check script: load the answer once, then run the
// tests in order against the same database. Each test gets a savepoint, so an
// error in one can't break the next; "reload-db" rewinds to the loaded state.
async function exactCases(job: Job): Promise<CaseResult[]> {
  return isolated(job, async () => {
    const { exec } = await shellFor(job);
    const failed = await load(job, exec);
    if (failed) {
      return job.tests.cases.map((c) => ({ name: c.name, show: c.show, pass: false, got: failed, want: c.expected ?? '', note: 'Your answer did not load.' }));
    }
    query('SAVEPOINT codemax_loaded');
    const out: CaseResult[] = [];
    for (const c of job.tests.cases) {
      if (c.reload) query('ROLLBACK TO SAVEPOINT codemax_loaded');
      query('SAVEPOINT codemax_case');
      const r = await exec(c.script);
      if (query('RELEASE SAVEPOINT codemax_case').error) {
        query('ROLLBACK TO SAVEPOINT codemax_case');
        query('RELEASE SAVEPOINT codemax_case');
      }
      out.push({ name: c.name, show: c.show, ...verdict(r.stdout, c.expected ?? '') });
    }
    return out;
  });
}

// The same hints the course's check script gives.
function verdict(got: string, want: string) {
  if (got === want) return { pass: true, got, want };
  const squash = (s: string) => s.replace(/[ \t]+/g, ' ').replace(/ +$/gm, '').trimEnd();
  const lines = (s: string) => s.trimEnd().split('\n').sort().join('\n');
  const note =
    squash(got) === squash(want) ? 'Right values, wrong spacing.' :
    lines(got) === lines(want) ? 'Right lines, wrong order.' :
    got.trimEnd() === want.trimEnd() ? 'Only the trailing newlines differ.' : undefined;
  return { pass: false, got, want, note };
}
