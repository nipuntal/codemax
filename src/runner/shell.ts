// The shell every run happens in: just-bash (a bash interpreter over an
// in-memory filesystem) plus the commands it lacks — dash, cksum, python3 and
// psql — wired to Pyodide and PGlite.
import { Bash, defineCommand } from 'just-bash';
import { bytesOf, textOf } from './bytes';
import { runPython } from './py';
import { query, formatError, ensurePg, type Result } from './pg';
import { sort, grep, uniq, wc, cmp } from './coreutils';

export const CWD = '/work';
type Ctx = Parameters<Parameters<typeof defineCommand>[1]>[1];
type Out = { stdout: string; stderr: string; exitCode: number };
const ok = (stdout = '', stderr = '', exitCode = 0): Out => ({ stdout, stderr, exitCode });

const enc = new TextEncoder();
const dec = new TextDecoder();

// ---- dash: run a script with dash's echo (backslash escapes on) and $0 set
const dash = (name: string) => defineCommand(name, async (args, ctx) => {
  if (args[0] === '-n' || args[0] === '-c' || !args.length) return ctx.exec!('bash', { cwd: ctx.cwd, stdin: textOf(ctx.stdin), args });
  const path = ctx.fs.resolvePath(ctx.cwd, args[0]);
  if (!(await ctx.fs.exists(path))) return ok('', `${name}: 0: cannot open ${args[0]}: No such file\n`, 2);
  const src = await ctx.fs.readFile(path);
  return ctx.exec!('bash', { cwd: ctx.cwd, stdin: textOf(ctx.stdin), args: ['-c', `shopt -s xpg_echo\n${src}`, args[0], ...args.slice(1)] });
});

// ---- cksum: POSIX CRC
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i << 24;
    for (let k = 0; k < 8; k++) c = c & 0x80000000 ? (c << 1) ^ 0x04c11db7 : c << 1;
    t[i] = c >>> 0;
  }
  return t;
})();
function cksumOf(bytes: Uint8Array) {
  let crc = 0;
  for (const b of bytes) crc = ((crc << 8) ^ CRC[((crc >>> 24) ^ b) & 0xff]) >>> 0;
  for (let n = bytes.length; n > 0; n = Math.floor(n / 256)) crc = ((crc << 8) ^ CRC[((crc >>> 24) ^ (n & 0xff)) & 0xff]) >>> 0;
  return `${(~crc) >>> 0} ${bytes.length}`;
}
const cksum = defineCommand('cksum', async (args, ctx) => {
  if (!args.length) return ok(cksumOf(bytesOf(ctx.stdin)) + '\n');
  let out = '';
  for (const a of args) out += `${cksumOf(await ctx.fs.readFileBuffer(ctx.fs.resolvePath(ctx.cwd, a)))} ${a}\n`;
  return ok(out);
});

// ---- python3: Pyodide, with the shell's files mirrored in and out
async function snapshot(ctx: Ctx) {
  const files = new Map<string, Uint8Array>();
  for (const p of ctx.fs.getAllPaths()) {
    if (!p.startsWith(CWD + '/')) continue;
    if ((await ctx.fs.stat(p)).isFile) files.set(p, await ctx.fs.readFileBuffer(p));
  }
  return files;
}
const python = (name: string) => defineCommand(name, async (args, ctx) => {
  let code: string | undefined, script: string | undefined, argv: string[];
  // drop interpreter flags that change nothing here (-u, -B), but only before the script
  let k = 0;
  while (args[k] === '-u' || args[k] === '-B') k++;
  const a = args.slice(k);
  if (a[0] === '-c') { code = a[1] ?? ''; argv = ['-c', ...a.slice(2)]; }
  else if (a[0]) { script = ctx.fs.resolvePath(ctx.cwd, a[0]); argv = a; }
  else return ok('', `${name}: interactive mode is not available here\n`, 2);
  const before = await snapshot(ctx);
  if (script && !before.has(script)) return ok('', `${name}: can't open file '${a[0]}': [Errno 2] No such file or directory\n`, 2);
  const { result, files } = await runPython({ script, code, argv, cwd: ctx.cwd.startsWith(CWD) ? ctx.cwd : CWD, stdin: textOf(ctx.stdin), files: before });
  // write back what Python changed
  for (const [p, data] of files) {
    const old = before.get(p);
    if (!old || old.length !== data.length || old.some((b, i) => b !== data[i])) await ctx.fs.writeFile(p, data);
  }
  for (const p of before.keys()) if (!files.has(p)) await ctx.fs.rm(p, { force: true });
  return ok(result.stdout, result.stderr, result.exitCode);
});

// ---- psql: the flags the course uses, printing the way psql 16 prints
const NUMERIC = new Set([20, 21, 23, 26, 700, 701, 1700]);
function aligned(r: Result, tuplesOnly: boolean) {
  const cols = r.fields.length;
  const cells = r.rows.map((row) => row.map((v) => v ?? ''));
  const w = r.fields.map((f, i) => Math.max(tuplesOnly ? 0 : f.name.length, ...cells.map((row) => row[i].length)));
  const lines: string[] = [];
  if (!tuplesOnly) {
    lines.push(r.fields.map((f, i) => {
      const pad = w[i] - f.name.length, l = Math.floor(pad / 2);
      return ' ' + ' '.repeat(l) + f.name + ' '.repeat(pad - l) + ' ';
    }).join('|').replace(/ +$/, ''));
    lines.push(w.map((x) => '-'.repeat(x + 2)).join('+'));
  }
  for (const row of cells) {
    lines.push(row.map((v, i) => {
      const s = NUMERIC.has(r.fields[i].oid) ? v.padStart(w[i]) : v.padEnd(w[i]);
      return ' ' + s + (i < cols - 1 ? ' ' : '');
    }).join('|').replace(/ +$/, ''));
  }
  if (!tuplesOnly) lines.push(`(${r.rows.length} row${r.rows.length === 1 ? '' : 's'})`, '');
  return lines.join('\n') + '\n';
}
function unaligned(r: Result, tuplesOnly: boolean, sep: string) {
  const lines = r.rows.map((row) => row.map((v) => v ?? '').join(sep));
  if (!tuplesOnly) lines.unshift(r.fields.map((f) => f.name).join(sep)), lines.push(`(${r.rows.length} row${r.rows.length === 1 ? '' : 's'})`);
  return lines.length ? lines.join('\n') + '\n' : '';
}

const psql = defineCommand('psql', async (args, ctx) => {
  // One message per -c/-f, so the first error always stops: ON_ERROR_STOP is implied.
  let A = false, t = false, q = false, sep = '|';
  const cmds: { sql: string; file?: string }[] = [];
  for (let i = 0; i < args.length; i++) {
    let a = args[i];
    // split bundled short flags: -At, -qAt …
    if (/^-[Atqx]{2,}$/.test(a)) { args.splice(i + 1, 0, ...a.slice(2).split('').map((c) => '-' + c)); a = a.slice(0, 2); }
    if (a === '-A' || a === '--no-align') A = true;
    else if (a === '-t' || a === '--tuples-only') t = true;
    else if (a === '-q' || a === '--quiet') q = true;
    else if (a === '-F' || a === '--field-separator') sep = args[++i] ?? '|';
    else if (a.startsWith('-F')) sep = a.slice(2);
    else if (a === '-c' || a === '--command') cmds.push({ sql: args[++i] ?? '' });
    else if (a === '-f' || a === '--file') {
      const f = args[++i] ?? '';
      const path = ctx.fs.resolvePath(ctx.cwd, f);
      if (!(await ctx.fs.exists(path))) return ok('', `psql: error: ${f}: No such file or directory\n`, 1);
      cmds.push({ sql: await ctx.fs.readFile(path), file: f });
    } else if (a === '-v' || a === '--set') i++;
    // -X, -v…, a database name: nothing to do (there is one database)
  }
  if (!cmds.length) cmds.push({ sql: textOf(ctx.stdin), file: '<stdin>' });
  await ensurePg();

  let stdout = '', stderr = '';
  for (const c of cmds) {
    if (/^\s*\\/m.test(c.sql)) {
      stderr += 'psql: backslash commands (\\d, \\i …) are not available here\n';
      return ok(stdout, stderr, 1);
    }
    const r = query(c.sql);
    const where = c.file ? `psql:${c.file}:${lineOf(c.sql, r.error?.position)}: ` : '';
    for (const n of r.notices) if (!q || !n.startsWith('NOTICE')) stderr += `${where}${n}\n`;
    for (const res of r.results) {
      if (res.fields.length) stdout += A ? unaligned(res, t, sep) : aligned(res, t);
      else if (!q && res.command) stdout += res.command + '\n';
    }
    if (r.error) {
      stderr += where + formatError(r.error, c.sql);
      return ok(stdout, stderr, c.file ? 3 : 1);
    }
  }
  return ok(stdout, stderr, 0);
});
function lineOf(sql: string, pos?: number) {
  return pos ? sql.slice(0, pos - 1).split('\n').length : 1;
}

export async function makeShell(files: Record<string, string | Uint8Array>, executable: string[] = []) {
  const abs: Record<string, string | Uint8Array> = {};
  for (const [k, v] of Object.entries(files)) abs[`${CWD}/${k}`] = v;
  const sh = new Bash({
    cwd: CWD,
    files: abs,
    env: { HOME: CWD, USER: 'student', LC_ALL: 'C' },
    customCommands: [
      dash('dash'), dash('sh'), python('python3'), python('python'), psql,
      sort, grep('grep'), grep('egrep'), grep('fgrep'), uniq, wc, cmp, cksum,
    ],
    // generous enough for the heaviest exam scripts, still stops runaway loops
    executionLimits: { maxCommandCount: 1_000_000, maxLoopIterations: 1_000_000, maxWorkUnits: 20_000_000 },
  });
  await sh.fs.mkdir('/tmp', { recursive: true });
  for (const f of executable) await sh.fs.chmod(`${CWD}/${f}`, 0o755);
  return sh;
}

// ---- run files through the interpreter their #! line names
export function interpreterFor(src: string, name: string) {
  const bang = src.match(/^#!\s*(\S+)(?:\s+(\S+))?/)?.slice(1).join(' ') ?? '';
  if (/python/.test(bang) || (!bang && name.endsWith('.py'))) return 'python3';
  if (/\bbash\b/.test(bang)) return 'bash';
  return 'dash';
}

/**
 * Prefix an interpreter wherever a file is executed directly — `./q01.sh`,
 * `"$A"` — since the shell can't follow #! lines itself.
 * `lookup` maps a path as written (./q01.sh) to its interpreter, or null.
 */
export function routeExecs(script: string, lookup: (path: string) => string | null) {
  return script.replace(
    /(^|[;&|(\n]|\$\(|\b(?:then|do|else|!)\s)(\s*)("\$A"|\$A\b|\.\/[^\s;&|()<>"']+)/g,
    (m, before: string, space: string, target: string) => {
      const interp = lookup(target);
      return interp ? `${before}${space}${interp} ${target}` : m;
    },
  );
}

export { dec as utf8 };
