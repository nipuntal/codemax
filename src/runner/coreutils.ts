// GNU-faithful replacements for the commands COMP2041 leans on hardest, where
// just-bash's versions differ: sort (C-locale order, per-key flags), grep
// (POSIX BRE/ERE including back-references), uniq (GNU count width), wc (GNU
// padding, -L) and cmp.
import { defineCommand } from 'just-bash';
import { textOf } from './bytes';

type Ctx = Parameters<Parameters<typeof defineCommand>[1]>[1];
const ok = (stdout = '', stderr = '', exitCode = 0) => ({ stdout, stderr, exitCode });

/** Read operands (or stdin for none / "-"). */
async function inputs(ctx: Ctx, files: string[], name: string) {
  const out: { name: string; text: string | null; err?: string }[] = [];
  if (!files.length) files = ['-'];
  for (const f of files) {
    if (f === '-') { out.push({ name: '-', text: textOf(ctx.stdin) }); continue; }
    const p = ctx.fs.resolvePath(ctx.cwd, f);
    if (!(await ctx.fs.exists(p))) { out.push({ name: f, text: null, err: `${name}: ${f}: No such file or directory\n` }); continue; }
    if ((await ctx.fs.stat(p)).isDirectory) { out.push({ name: f, text: null, err: `${name}: ${f}: Is a directory\n` }); continue; }
    out.push({ name: f, text: await ctx.fs.readFile(p) });
  }
  return out;
}
const linesOf = (s: string) => (s === '' ? [] : s.replace(/\n$/, '').split('\n'));

/** Split "-abc" style flags; `withArg` letters take the rest or the next arg. */
function getopt(args: string[], withArg: string) {
  const flags: [string, string | true][] = [];
  const rest: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--') { rest.push(...args.slice(i + 1)); break; }
    if (a.startsWith('--') && a.length > 2) {
      const [k, v] = a.slice(2).split(/=(.*)/s);
      flags.push([`--${k}`, v ?? true]);
      continue;
    }
    if (!a.startsWith('-') || a === '-') { rest.push(a); continue; }
    for (let j = 1; j < a.length; j++) {
      const c = a[j];
      if (withArg.includes(c)) {
        const v = j + 1 < a.length ? a.slice(j + 1) : args[++i];
        flags.push([c, v ?? '']);
        break;
      }
      flags.push([c, true]);
    }
  }
  return { flags, rest };
}

// ---------------------------------------------------------------- sort
interface Key { sf: number; sc: number; ef: number; ec: number; opts: string }

function parsePos(s: string, end: boolean): [number, number, string] {
  const m = s.match(/^(\d+)(?:\.(\d+))?([bdfgMnrV]*)$/);
  if (!m) throw new Error(`invalid field specification '${s}'`);
  return [+m[1], m[2] ? +m[2] : end ? 0 : 1, m[3]];
}

export const sort = defineCommand('sort', async (args, ctx) => {
  let global = '', sep: string | null = null, unique = false, stable = false, check = false, outFile: string | null = null;
  const keys: Key[] = [];
  const { flags, rest } = getopt(args, 'tkoST');
  try {
    for (const [f, v] of flags) {
      if ('bdfgMnrV'.includes(f) && f.length === 1) global += f;
      else if (f === 'h') global += 'n';
      else if (f === 'u' || f === '--unique') unique = true;
      else if (f === 's' || f === '--stable') stable = true;
      else if (f === 'c' || f === 'C') check = true;
      else if (f === 't') sep = v as string;
      else if (f === 'o') outFile = v as string;
      else if (f === 'k') {
        const [a, b] = (v as string).split(',');
        const [sf, sc, so] = parsePos(a, false);
        const [ef, ec, eo] = b ? parsePos(b, true) : [Infinity, 0, ''];
        keys.push({ sf, sc, ef, ec, opts: so + eo });
      } else if (f === '--numeric-sort') global += 'n';
      else if (f === '--reverse') global += 'r';
      else if (f === '--ignore-case') global += 'f';
    }
  } catch (e) {
    return ok('', `sort: ${(e as Error).message}\n`, 2);
  }
  if (sep !== null && sep.length !== 1) return ok('', sep ? 'sort: multi-character tab\n' : 'sort: empty tab\n', 2);

  const ins = await inputs(ctx, rest, 'sort');
  const bad = ins.find((i) => i.err);
  if (bad) return ok('', bad.err, 2);
  const lines = ins.flatMap((i) => linesOf(i.text!));

  // Fields: with -t, split on it; otherwise a field is its leading blanks plus
  // the non-blanks after them (so "  a b" is ["  a", " b"]).
  const extract = (line: string, k: Key, blanks: boolean) => {
    const fs = sep !== null ? line.split(sep) : line.match(/[ \t]*[^ \t]+/g) ?? [];
    const starts: number[] = [];
    let p = 0;
    for (const f of fs) { starts.push(p); p += f.length + (sep !== null ? 1 : 0); }
    if (k.sf > fs.length) return '';
    const f = fs[k.sf - 1];
    let skip = 0;
    if (blanks) while (skip < f.length && (f[skip] === ' ' || f[skip] === '\t')) skip++;
    const s = starts[k.sf - 1] + Math.min(skip + k.sc - 1, f.length);
    let e = line.length;
    if (k.ef <= fs.length) {
      const ef = fs[k.ef - 1], es = starts[k.ef - 1];
      e = k.ec === 0 ? es + ef.length : Math.min(es + k.ec, es + ef.length);
    }
    return e > s ? line.slice(s, e) : '';
  };
  const num = (s: string) => {
    const m = s.match(/^[ \t]*(-?)(\d*)(\.\d*)?/);
    if (!m || (!m[2] && !(m[3] && m[3].length > 1))) return 0;
    return parseFloat(`${m[1]}${m[2] || '0'}${m[3] ?? ''}`);
  };
  const gnum = (s: string) => { const n = parseFloat(s.trim()); return Number.isNaN(n) ? -Infinity : n; };
  const cmpStr = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
  const cmpKey = (a: string, b: string, o: string) => {
    let r: number;
    if (o.includes('n')) r = num(a) - num(b);
    else if (o.includes('g')) r = gnum(a) - gnum(b);
    else {
      if (o.includes('d')) { a = a.replace(/[^ \t0-9A-Za-z]/g, ''); b = b.replace(/[^ \t0-9A-Za-z]/g, ''); }
      if (o.includes('f')) { a = a.toUpperCase(); b = b.toUpperCase(); }
      r = cmpStr(a, b);
    }
    return Math.sign(r) * (o.includes('r') ? -1 : 1);
  };
  const compareKeys = (a: string, b: string) => {
    if (!keys.length) return cmpKey(global.includes('b') ? a.replace(/^[ \t]+/, '') : a, global.includes('b') ? b.replace(/^[ \t]+/, '') : b, global);
    for (const k of keys) {
      const o = k.opts.replace(/[^dfgMnrV]/g, '') ? k.opts : k.opts + global;
      const blanks = o.includes('b');
      const r = cmpKey(extract(a, k, blanks), extract(b, k, blanks), o);
      if (r) return r;
    }
    return 0;
  };
  // GNU breaks ties by comparing whole lines, unless -s or -u
  const compare = (a: string, b: string) => {
    const r = compareKeys(a, b);
    if (r || stable || unique) return r;
    return cmpStr(a, b) * (global.includes('r') ? -1 : 1);
  };

  if (check) {
    for (let i = 1; i < lines.length; i++) {
      const r = compare(lines[i - 1], lines[i]);
      if (r > 0 || (unique && r === 0)) return ok('', `sort: ${rest[0] ?? '-'}:${i + 1}: disorder: ${lines[i]}\n`, 1);
    }
    return ok();
  }
  const sorted = lines.map((l, i) => [l, i] as const).sort((x, y) => compare(x[0], y[0]) || x[1] - y[1]).map((x) => x[0]);
  const out = unique ? sorted.filter((l, i) => i === 0 || compareKeys(sorted[i - 1], l) !== 0) : sorted;
  const text = out.length ? out.join('\n') + '\n' : '';
  if (outFile) { await ctx.fs.writeFile(ctx.fs.resolvePath(ctx.cwd, outFile), text); return ok(); }
  return ok(text);
});

// ---------------------------------------------------------------- grep
const CLASSES: Record<string, string> = {
  alpha: 'A-Za-z', digit: '0-9', alnum: '0-9A-Za-z', upper: 'A-Z', lower: 'a-z', space: ' \\t\\n\\r\\f\\v',
  blank: ' \\t', punct: '!-\\/:-@\\[-`{-~', print: ' -~', graph: '!-~', cntrl: '\\x00-\\x1f\\x7f', xdigit: '0-9A-Fa-f',
};

/** POSIX BRE/ERE (with GNU extensions) -> JavaScript RegExp source. */
export function posixToJs(re: string, extended: boolean, ignoreCase = false) {
  let out = '';
  let i = 0;
  const atStart = () => out === '' || /(\(|\||\^)$/.test(out) && !/\\[(|^]$/.test(out);
  while (i < re.length) {
    const c = re[i];
    if (c === '[') {
      let j = i + 1, cls = '[';
      if (re[j] === '^') { cls += '^'; j++; }
      if (re[j] === ']') { cls += '\\]'; j++; }
      while (j < re.length && re[j] !== ']') {
        if (re[j] === '[' && re[j + 1] === ':') {
          const end = re.indexOf(':]', j + 2);
          const name = re.slice(j + 2, end);
          if (end < 0 || !(name in CLASSES)) throw new Error('invalid character class');
          cls += ignoreCase && (name === 'upper' || name === 'lower') ? 'A-Za-z' : CLASSES[name];
          j = end + 2;
          continue;
        }
        if (re[j] === '\\' || re[j] === '[' || (re[j] === '^' && cls.length > 1)) cls += '\\' + re[j];
        else cls += re[j];
        j++;
      }
      if (j >= re.length) throw new Error('Unmatched [, [^, [:, [., or [=');
      out += cls + ']';
      i = j + 1;
      continue;
    }
    if (c === '\\') {
      const n = re[i + 1];
      i += 2;
      if (n === undefined) throw new Error('Trailing backslash');
      if (/[1-9]/.test(n)) out += '\\' + n;
      else if (n === '<') out += '\\b(?=\\w)';
      else if (n === '>') out += '\\b(?<=\\w)';
      else if ('bBwWsS'.includes(n)) out += '\\' + n;
      else if (!extended && '(){}|+?'.includes(n)) out += n;
      else if (n === '`') out += '^';
      else if (n === "'") out += '$';
      else out += /[\w\s]/.test(n) ? n : '\\' + n;
      continue;
    }
    if (extended) {
      if (c === '{' && !/^\{\d*(,\d*)?\}/.test(re.slice(i))) out += '\\{';
      else if ((c === '*' || c === '+' || c === '?') && atStart()) out += '\\' + c;
      else out += c === '/' ? '\\/' : c;
    } else {
      if ('(){}|+?'.includes(c)) out += '\\' + c;
      else if (c === '*' && atStart()) out += '\\*';
      else if (c === '^' && out !== '' && !/\($/.test(out)) out += '\\^';
      else if (c === '$' && i < re.length - 1 && !re.startsWith('\\)', i + 1) && !re.startsWith('\\|', i + 1)) out += '\\$';
      else out += c === '/' ? '\\/' : c;
    }
    i++;
  }
  return out;
}

export const grep = (name: string) => defineCommand(name, async (args, ctx) => {
  let mode = name === 'egrep' ? 'E' : name === 'fgrep' ? 'F' : 'G';
  let icase = false, invert = false, count = false, list = false, listNot = false, number = false, only = false,
    quiet = false, silent = false, word = false, line = false, withName: boolean | null = null, max = Infinity, recursive = false;
  const patterns: string[] = [];
  const { flags, rest } = getopt(args, 'efmABCD');
  for (const [f, v] of flags) {
    switch (f) {
      case 'E': case 'F': case 'G': case 'P': mode = f === 'P' ? 'E' : f; break;
      case 'i': case 'y': case '--ignore-case': icase = true; break;
      case 'v': case '--invert-match': invert = true; break;
      case 'c': case '--count': count = true; break;
      case 'l': case '--files-with-matches': list = true; break;
      case 'L': case '--files-without-match': listNot = true; break;
      case 'n': case '--line-number': number = true; break;
      case 'o': case '--only-matching': only = true; break;
      case 'q': case '--quiet': case '--silent': quiet = true; break;
      case 's': case '--no-messages': silent = true; break;
      case 'w': case '--word-regexp': word = true; break;
      case 'x': case '--line-regexp': line = true; break;
      case 'h': case '--no-filename': withName = false; break;
      case 'H': case '--with-filename': withName = true; break;
      case 'r': case 'R': case '--recursive': recursive = true; break;
      case 'm': case '--max-count': max = parseInt(v as string, 10); break;
      case 'e': case '--regexp': patterns.push(v as string); break;
      case 'f': {
        const p = ctx.fs.resolvePath(ctx.cwd, v as string);
        if (!(await ctx.fs.exists(p))) return ok('', `${name}: ${v}: No such file or directory\n`, 2);
        patterns.push(...linesOf(await ctx.fs.readFile(p)));
        break;
      }
      case 'A': case 'B': case 'C': return ok('', `${name}: -${f} (context lines) is not supported here\n`, 2);
      case '--color': case '--colour': break;
      default: if (f.startsWith('--')) break; return ok('', `${name}: invalid option -- '${f}'\n`, 2);
    }
  }
  if (!patterns.length) {
    if (!rest.length) return ok('', `Usage: ${name} [OPTION]... PATTERNS [FILE]...\n`, 2);
    patterns.push(rest.shift()!);
  }
  let regs: RegExp[];
  try {
    regs = patterns.flatMap((p) => p.split('\n')).map((p) => {
      let src = mode === 'F' ? p.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') : posixToJs(p, mode === 'E', icase);
      if (word) src = `(?<![A-Za-z0-9_])(?:${src})(?![A-Za-z0-9_])`;
      if (line) src = `^(?:${src})$`;
      return new RegExp(src, icase ? 'gi' : 'g');
    });
  } catch (e) {
    return ok('', `${name}: ${(e as Error).message}\n`, 2);
  }

  let files = rest;
  if (recursive) {
    const all: string[] = [];
    for (const f of files.length ? files : ['.']) {
      const p = ctx.fs.resolvePath(ctx.cwd, f);
      if (await ctx.fs.exists(p) && (await ctx.fs.stat(p)).isDirectory) {
        const base = p.endsWith('/') ? p : p + '/';
        for (const q of ctx.fs.getAllPaths().sort()) {
          if (q.startsWith(base) && (await ctx.fs.stat(q)).isFile) all.push((f === '.' ? '' : f.replace(/\/$/, '') + '/') + q.slice(base.length));
        }
      } else all.push(f);
    }
    files = all;
  }
  const ins = await inputs(ctx, files, name);
  const showName = withName ?? (files.length > 1 || recursive);
  let out = '', err = '', matched = false, failed = false;
  for (const inp of ins) {
    if (inp.err) { failed = true; if (!silent) err += inp.err; continue; }
    const label = inp.name === '-' ? '(standard input)' : inp.name;
    let n = 0;
    for (const [idx, l] of linesOf(inp.text!).entries()) {
      if (n >= max) break;
      const hits = regs.some((r) => { r.lastIndex = 0; return r.test(l); });
      if (hits === invert) continue;
      n++;
      matched = true;
      if (quiet) return ok('', err, 0);
      if (count || list || listNot) continue;
      const prefix = (showName ? label + ':' : '') + (number ? `${idx + 1}:` : '');
      if (only && !invert) {
        for (const r of regs) {
          r.lastIndex = 0;
          for (const m of l.matchAll(r)) if (m[0]) out += prefix + m[0] + '\n';
        }
      } else out += prefix + l + '\n';
    }
    if (count) out += (showName ? label + ':' : '') + n + '\n';
    if (list && n) out += label + '\n';
    if (listNot && !n) out += label + '\n';
  }
  return ok(out, err, failed && !(quiet && matched) ? 2 : listNot ? (out ? 0 : 1) : matched ? 0 : 1);
});

// ---------------------------------------------------------------- uniq
// GNU pads counts to 7 (macOS uses 4), which is what CSE prints.
export const uniq = defineCommand('uniq', async (args, ctx) => {
  let count = false, dups = false, allDups = false, uniques = false, icase = false, skipF = 0, skipC = 0, width = Infinity;
  const files: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    let m: RegExpMatchArray | null;
    if (a === '-f' || a === '-s' || a === '-w') { const v = +args[++i]; a === '-f' ? (skipF = v) : a === '-s' ? (skipC = v) : (width = v); }
    else if ((m = a.match(/^-([fsw])(\d+)$/))) { const v = +m[2]; m[1] === 'f' ? (skipF = v) : m[1] === 's' ? (skipC = v) : (width = v); }
    else if (/^-[cdDiu]+$/.test(a)) {
      for (const c of a.slice(1)) {
        if (c === 'c') count = true; else if (c === 'd') dups = true; else if (c === 'D') allDups = true;
        else if (c === 'u') uniques = true; else icase = true;
      }
    } else if (a === '--count') count = true;
    else if (a === '--repeated') dups = true;
    else if (a === '--unique') uniques = true;
    else if (a === '--ignore-case') icase = true;
    else if (a.startsWith('-') && a !== '-') return ok('', `uniq: invalid option -- '${a.slice(1)}'\n`, 1);
    else files.push(a);
  }
  const [inp] = await inputs(ctx, files.slice(0, 1), 'uniq');
  if (inp.err) return ok('', inp.err, 1);
  const key = (l: string) => {
    let s = l;
    for (let k = 0; k < skipF; k++) s = s.replace(/^[ \t]*[^ \t]*/, '');
    s = s.slice(skipC, skipC + width);
    return icase ? s.toLowerCase() : s;
  };
  const lines = linesOf(inp.text!);
  let out = '';
  for (let i = 0; i < lines.length;) {
    let j = i + 1;
    while (j < lines.length && key(lines[j]) === key(lines[i])) j++;
    const n = j - i;
    if (allDups) { if (n > 1) for (let k = i; k < j; k++) out += lines[k] + '\n'; }
    else if (!(dups && n < 2) && !(uniques && n > 1)) out += (count ? String(n).padStart(7) + ' ' : '') + lines[i] + '\n';
    i = j;
  }
  if (files[1]) { await ctx.fs.writeFile(ctx.fs.resolvePath(ctx.cwd, files[1]), out); return ok(); }
  return ok(out);
});

// ---------------------------------------------------------------- wc
export const wc = defineCommand('wc', async (args, ctx) => {
  const { flags, rest } = getopt(args, '');
  let want = flags.map(([f]) => f).filter((f) => 'lwcmL'.includes(f) || f.startsWith('--'));
  const map: Record<string, string> = { '--lines': 'l', '--words': 'w', '--bytes': 'c', '--chars': 'm', '--max-line-length': 'L' };
  want = want.map((f) => map[f] ?? f).filter((f) => 'lwcmL'.includes(f));
  const show = { l: want.includes('l'), w: want.includes('w'), m: want.includes('m'), c: want.includes('c'), L: want.includes('L') };
  if (!want.length) show.l = show.w = show.c = true;
  const ins = await inputs(ctx, rest, 'wc');
  const enc = new TextEncoder();
  const rows: { name: string; n: number[] }[] = [];
  let err = '';
  const tot = [0, 0, 0, 0, 0];
  for (const i of ins) {
    if (i.err) { err += i.err; continue; }
    const t = i.text!;
    const counts = [
      (t.match(/\n/g) || []).length,
      (t.match(/\S+/g) || []).length,
      [...t].length,
      enc.encode(t).length,
      Math.max(0, ...t.split('\n').map((l) => [...l.replace(/\t/g, '        ')].length)),
    ];
    counts.forEach((c, k) => (tot[k] = k === 4 ? Math.max(tot[k], c) : tot[k] + c));
    rows.push({ name: i.name === '-' ? '' : i.name, n: counts });
  }
  if (rows.length > 1) rows.push({ name: 'total', n: tot });
  const order = (['l', 'w', 'm', 'c', 'L'] as const).filter((k) => show[k]);
  const idx = { l: 0, w: 1, m: 2, c: 3, L: 4 };
  // GNU: one count of one input prints bare; otherwise pad to a common width
  // (at least 7 when any input is stdin).
  const single = order.length === 1 && ins.length === 1;
  const fromStdin = ins.some((i) => i.name === '-');
  const width = single ? 1 : Math.max(fromStdin ? 7 : 1, String(Math.max(...ins.map((i) => (i.text ? enc.encode(i.text).length : 0)), tot[3])).length);
  const out = rows.map((r) => order.map((k) => String(r.n[idx[k]]).padStart(width)).join(' ') + (r.name ? ' ' + r.name : '')).join('\n');
  return ok(out ? out + '\n' : '', err, err ? 1 : 0);
});

// ---------------------------------------------------------------- cmp
export const cmp = defineCommand('cmp', async (args, ctx) => {
  const { flags, rest } = getopt(args, '');
  const silent = flags.some(([f]) => f === 's' || f === '--quiet' || f === '--silent');
  if (rest.length < 2) return ok('', 'cmp: missing operand\n', 2);
  const ins = await inputs(ctx, rest.slice(0, 2), 'cmp');
  const bad = ins.find((i) => i.err);
  if (bad) return ok('', silent ? '' : bad.err, 2);
  const [a, b] = ins.map((i) => new TextEncoder().encode(i.text!));
  const n = Math.min(a.length, b.length);
  let line = 1;
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) return ok(silent ? '' : `${rest[0]} ${rest[1]} differ: byte ${i + 1}, line ${line}\n`, '', 1);
    if (a[i] === 10) line++;
  }
  if (a.length === b.length) return ok();
  const short = a.length < b.length ? rest[0] : rest[1];
  return ok('', silent ? '' : `cmp: EOF on ${short} after byte ${n}, line ${line - (n && (a.length < b.length ? a : b)[n - 1] === 10 ? 1 : 0)}\n`, 1);
});
