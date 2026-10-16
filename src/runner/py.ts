// CPython (Pyodide), loaded on first use. Each run gets the shell's files
// copied in, runs the script as __main__ with fresh argv/stdin/stdout, and
// copies any file changes back out.
import type { PyodideAPI } from 'pyodide';
import psycopg2 from './psycopg2';
import { query, formatError, pgReady } from './pg';

let ready: Promise<PyodideAPI> | null = null;
let loader: (() => Promise<PyodideAPI>) | null = null;
let pgBoot: (() => Promise<unknown>) | null = null;

const HARNESS = `
import sys, io, os, runpy, traceback

def _codemax_run(path, argv, cwd, stdin, code=None):
    out, err = io.BytesIO(), io.BytesIO()
    sys.stdout = io.TextIOWrapper(out, encoding='utf-8', write_through=True)
    sys.stderr = io.TextIOWrapper(err, encoding='utf-8', write_through=True)
    sys.stdin = io.TextIOWrapper(io.BytesIO(stdin.encode()), encoding='utf-8')
    sys.argv = list(argv)
    before = set(sys.modules)
    status = 0
    try:
        os.chdir(cwd)
        if code is not None:
            exec(compile(code, '<string>', 'exec'), {'__name__': '__main__'})
        else:
            sys.path.insert(0, os.path.dirname(os.path.abspath(path)))
            try:
                runpy.run_path(argv[0], run_name='__main__')  # argv[0] as typed, like python3 does
            finally:
                sys.path.pop(0)
    except SystemExit as e:
        c = e.code
        if c is None: status = 0
        elif isinstance(c, int): status = c
        else:
            print(c, file=sys.stderr); status = 1
    except BaseException:
        tb = traceback.format_exc().splitlines(True)
        # hide the harness frames, keep the student's
        keep = [l for l in tb if '_codemax_run' not in l and 'runpy' not in l and '<frozen runpy>' not in l]
        sys.stderr.write(''.join(keep)); status = 1
    finally:
        # read the buffers before the wrappers go away (closing one closes its buffer)
        res = []
        for w, b in ((sys.stdout, out), (sys.stderr, err)):
            try: w.flush()
            except Exception: pass
            res.append(b.getvalue().decode('utf-8', 'replace'))
        pg = sys.modules.get('psycopg2')
        if pg is not None:
            try: pg._finish()
            except Exception: pass
        for m in set(sys.modules) - before:
            f = getattr(sys.modules[m], '__file__', None) or ''
            if f.startswith('/work'): del sys.modules[m]
        sys.stdout, sys.stderr, sys.stdin = sys.__stdout__, sys.__stderr__, sys.__stdin__
    return res[0], res[1], status
`;

/** Pyodide loads on the first python3; Postgres on the first psycopg2 import. */
export function configurePy(load: () => Promise<PyodideAPI>, pgBooter: () => Promise<unknown>) {
  loader = load;
  pgBoot = pgBooter;
}

function ensurePy() {
  return (ready ??= loader!().then((p) => {
    p.registerJsModule('_pglink', {
      query: (sql: string) => {
        if (!pgReady()) throw new Error('Postgres is not loaded');
        const r = query(sql);
        return JSON.stringify({
          results: r.results,
          error: r.error && { code: r.error.code, text: formatError(r.error, sql) },
        });
      },
    });
    p.FS.mkdirTree('/codemax');
    p.FS.writeFile('/codemax/psycopg2.py', psycopg2);
    p.runPython(`import sys; sys.path.append('/codemax')\n${HARNESS}`);
    return p;
  }));
}

export const needsPg = (src: string) => /\bimport\s+psycopg2|\bfrom\s+psycopg2\b/.test(src);

export interface PyRun { stdout: string; stderr: string; exitCode: number }

/** files: absolute path -> content, mirrored into Python's filesystem. */
export async function runPython(
  opts: { script?: string; code?: string; argv: string[]; cwd: string; stdin: string; files: Map<string, Uint8Array> },
): Promise<{ result: PyRun; files: Map<string, Uint8Array> }> {
  const p = await ensurePy();
  const src = opts.code ?? (opts.script ? new TextDecoder().decode(opts.files.get(opts.script) ?? new Uint8Array()) : '');
  if (needsPg(src) && pgBoot) await pgBoot();

  const FS = p.FS;
  rmTree(FS, '/work');
  for (const [path, data] of opts.files) {
    FS.mkdirTree(path.slice(0, path.lastIndexOf('/')) || '/');
    FS.writeFile(path, data);
  }
  FS.mkdirTree(opts.cwd);
  const run = p.globals.get('_codemax_run');
  const res = run(opts.script, opts.argv, opts.cwd, opts.stdin, opts.code);
  const [stdout, stderr, exitCode] = res.toJs() as [string, string, number];
  res.destroy();
  run.destroy();
  const after = new Map<string, Uint8Array>();
  walk(FS, '/work', after);
  return { result: { stdout, stderr, exitCode }, files: after };
}

function walk(FS: PyodideAPI['FS'], dir: string, out: Map<string, Uint8Array>) {
  if (!FS.analyzePath(dir).exists) return;
  for (const name of FS.readdir(dir)) {
    if (name === '.' || name === '..' || name === '__pycache__') continue;
    const p = `${dir}/${name}`;
    if (FS.isDir(FS.stat(p).mode)) walk(FS, p, out);
    else out.set(p, FS.readFile(p));
  }
}

function rmTree(FS: PyodideAPI['FS'], dir: string) {
  if (!FS.analyzePath(dir).exists) return;
  for (const name of FS.readdir(dir)) {
    if (name === '.' || name === '..') continue;
    const p = `${dir}/${name}`;
    if (FS.isDir(FS.stat(p).mode)) { rmTree(FS, p); FS.rmdir(p); } else FS.unlink(p);
  }
}

export const warmPy = () => ensurePy();
