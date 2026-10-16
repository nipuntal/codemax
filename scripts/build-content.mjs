// content/ -> public/c/
//
//   index.json            every course, set and question (meta + preview)
//   <path>.json           one question: rendered docs, starter, data files, tests
//   <path>.sol.json       its solution files and post-attempt docs (fetched on demand)
//
// Markdown is rendered here, at build time, so the browser never ships a parser.
import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';
import { createHighlighter } from 'shiki';

const SRC = path.resolve('content');
const OUT = path.resolve('public/c');

// Sidebar structure. `dir` is relative to content/, `slug` is the URL.
const COURSES = [
  {
    id: '2041', title: 'COMP2041', sub: 'Shell & Python',
    sets: [
      { id: 'day1', title: 'Day 1', blurb: 'Learn first', groups: [['shell', 'Shell'], ['python', 'Python']] },
      { id: 'day2', title: 'Day 2', blurb: 'Weekly-test level', groups: [['shell', 'Shell'], ['python', 'Python']] },
      { id: 'day3', title: 'Day 3', blurb: 'Exam level' },
    ],
  },
  {
    id: '3311', title: 'COMP3311', sub: 'Databases',
    sets: [
      { id: 'day1', title: 'Day 1', blurb: 'Learn first' },
      { id: 'day2', title: 'Day 2', blurb: 'Exam level' },
    ],
  },
];

const LANG = { sh: 'shell', py: 'python', sql: 'sql', txt: 'text' };

const hl = await createHighlighter({ themes: ['github-light', 'github-dark'], langs: ['sh', 'bash', 'python', 'sql', 'c'] });
const marked = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const l = (lang || '').trim();
      if (!hl.getLoadedLanguages().includes(l)) return `<pre class="plain"><code>${esc(text)}</code></pre>`;
      return hl.codeToHtml(text, { lang: l, themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false });
    },
  },
});
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&amp;/g, '&');
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);

// "# Day 3 · Q24 — Award Lifespan  ·  [shell script]  ·  ⭐⭐⭐ · 10 min"
// "# Module 01 · SQL" + "## Real title"
function parseHead(md) {
  const lines = md.split('\n');
  const h1 = decode((lines.find((l) => l.startsWith('# ')) || '# ?').slice(2)).trim();
  const head = decode(lines.slice(0, 8).join('\n'));
  let title = h1, kind = null;
  const dash = h1.match(/—\s*(.+)$/);
  if (dash) title = dash[1].split(/\s{2,}·\s{2,}|\s{2,}(?=\()/)[0].trim();
  else {
    // 3311: the h1 is a label ("Module 01 · SQL"), the h2 is the title
    const h2 = lines.find((l) => l.startsWith('## '));
    title = h2 ? decode(h2.slice(3)).trim() : h1;
    kind = h1.split('·')[1]?.trim() || null; // SQL, PLpgSQL, Python + Psycopg2 (3311 gives no times)
  }
  // sources rate out of five (☆ pads 3311's); shown out of three: 1 | 2–3 | 4–5
  const rated = (head.match(/[⭐★]/gu) || []).length;
  const stars = rated ? Math.ceil((Math.min(rated, 5) * 3) / 5) : null;
  const mins = +(head.match(/(\d+)\s*min/) || [])[1] || null;
  return { title, stars, mins, kind };
}

// Drop the heading block that the UI shows itself (h1, 3311's h2, the meta line).
function body(md, isModule) {
  let s = md.replace(/^# .*\n/, '');
  if (isModule) s = s.replace(/^\s*## .*\n/, '');
  s = s.replace(/^\s*\*\*Difficulty:\*\*.*\n/, '');
  return s.replace(/^\s*---\s*\n/, '');
}

function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else out.push(path.relative(base, p));
  }
  return out;
}

function fileEntry(abs, name) {
  const buf = fs.readFileSync(abs);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(buf);
  const entry = text.includes('�') ? { name, b64: buf.toString('base64') } : { name, text };
  return fs.statSync(abs).mode & 0o100 ? { ...entry, x: true } : entry;
}

// ---- tests -> a uniform spec the browser runner executes
//
// 2041: test.sh computes $got (running the answer) and $want (from
// expected_output.txt), then compares. We keep everything up to the comparison
// and have the shell hand both strings back, so the comparison and the diff
// happen in the UI. 3311: each tests/NN.sh is one command whose output must
// equal NN.expected byte for byte, after loading qNN.sql.
const GOT = '/tmp/.codemax-got', WANT = '/tmp/.codemax-want';

function spec2041(testSh, answer) {
  const lines = testSh.split('\n');
  const end = lines.findIndex((l) => /^if \[ "\$got" = "\$want" \]/.test(l));
  if (end < 0) throw new Error('test.sh without the standard comparison');
  const body = lines.slice(0, end).filter((l) =>
    !/^#/.test(l) &&
    !/^cd "\$\(dirname "\$0"\)"/.test(l) &&
    !/^cp \.\S+ \S+$/.test(l) &&                // restore-from-snapshot: every run starts pristine anyway
    !/^\[ "\$1" = (reset|solution) \]/.test(l) &&
    !/^chmod \+x "\$A"/.test(l));
  // just-bash's ls -l doesn't show permissions; stat prints the same 10 characters
  for (let i = 0; i < body.length; i++) body[i] = body[i].replace(/ls -l ([^|;)]+?) \| cut -c1-10/g, 'stat -c %A $1');
  const script = [...body, `printf '%s' "$got" > ${GOT}`, `printf '%s' "$want" > ${WANT}`].join('\n').replace(/^\n+/, '');
  // what to show the student: the commands that produce $got, with $A spelled out
  const src = body.join('\n');
  const got = src.match(/^got=\$\(\s*([\s\S]*?)\s*\)\s*$/m)?.[1] ?? '';
  const fn = got.match(/^(\w+)\b/)?.[1];
  const fnBody = fn && src.match(new RegExp(`^${fn}\\(\\)\\s*\\{\\n([\\s\\S]*?)\\n\\}`, 'm'))?.[1];
  const show = (fnBody ? fnBody.replace(/^ {4}/gm, '') : got)
    .replace(/"?\$A"?/g, `./${answer}`).replace(/\$PWD\//g, './').replace(/\s*;\s*/g, '\n').trim();
  return { kind: 'compare', cases: [{ name: 'test', show, script }] };
}

function spec3311(dir, answer) {
  const tests = fs.readdirSync(path.join(dir, 'tests')).filter((f) => /^\d+\.sh$/.test(f)).sort();
  return {
    kind: 'exact',
    setup: answer.endsWith('.sql') ? `psql -q -v ON_ERROR_STOP=1 -f ${answer}` : null,
    cases: tests.map((f) => {
      // "cd .. && ./reload-db && cd qNN &&" becomes a flag: the runner rewinds the database
      const raw = read(path.join(dir, 'tests', f)).trim();
      const script = raw.replace(/^cd \.\. && \.\/reload-db[^&]*&& cd q\d+ && /, '');
      return {
        name: f.replace('.sh', ''), show: script, script, ...(script !== raw && { reload: true }),
        expected: read(path.join(dir, 'tests', f.replace('.sh', '.expected'))),
      };
    }),
  };
}

// The command the Run box starts with: the README's first example, or the first test.
function runHint(readme, answer, tests) {
  if (tests.kind === 'exact') return tests.cases[0]?.script ?? '';
  const q = answer.replace(/\.\w+$/, '');
  const ex = readme.match(new RegExp('^\\s*(?:\\$ )?((?:\\./|python3 (?:\\./)?)' + q + '\\.\\w+\\b[^\\n`]*)$', 'm'));
  if (ex) return ex[1].trim();
  return answer.endsWith('.txt') ? '' : `./${answer}`;
}

// pg_dump's COPY blocks -> INSERTs, so the database loads with one exec().
function dumpToSql(dump) {
  const unescape = (v) => v === '\\N' ? 'NULL' : "'" + v.replace(/\\(.)/g, (_, c) => ({ t: '\t', n: '\n', r: '\r', '\\': '\\' })[c] ?? c).replace(/'/g, "''") + "'";
  return dump.replace(/^COPY (\S+) \(([^)]*)\) FROM stdin;\n([\s\S]*?)^\\\.\n/gm, (_, table, cols, data) => {
    const rows = data.split('\n').filter(Boolean).map((l) => `(${l.split('\t').map(unescape).join(',')})`);
    const out = [];
    for (let i = 0; i < rows.length; i += 1000) out.push(`INSERT INTO ${table} (${cols}) VALUES\n${rows.slice(i, i + 1000).join(',\n')};\n`);
    return out.join('');
  });
}

function buildQuestion(dir, qid, urlPath) {
  const readme = read(path.join(dir, 'README.md'));
  const isModule = /^# (Module|Question) /.test(readme);
  const meta = parseHead(readme);
  const all = walk(dir);
  const answer = all.find((f) => new RegExp(`^${qid}\\.(sh|py|sql|txt)$`).test(f));
  const ext = answer.split('.').pop();

  const docs = [{ id: 'readme', title: 'Question', html: marked.parse(body(readme, isModule)) }];
  const notes = read(path.join(dir, 'NOTES.md'));
  if (notes) docs.push({ id: 'notes', title: 'Notes', html: marked.parse(notes) });

  const isTest = (f) => f === 'test.sh' || f === 'expected_output.txt' || f.startsWith('tests/');
  const isDoc = (f) => /^(README|NOTES|WALKTHROUGH)\.md$/.test(f);
  const files = all.filter((f) => f !== answer && !isTest(f) && !isDoc(f) && !f.startsWith('solution/'))
    .map((f) => fileEntry(path.join(dir, f), f));
  // the files a test needs beside the answer (expected_output.txt is read by test.sh)
  const testFiles = all.filter((f) => f === 'expected_output.txt').map((f) => fileEntry(path.join(dir, f), f));
  const tests = fs.existsSync(path.join(dir, 'test.sh'))
    ? { ...spec2041(read(path.join(dir, 'test.sh')), answer), files: testFiles }
    : spec3311(dir, answer);

  const solDocs = [];
  const walkthrough = read(path.join(dir, 'WALKTHROUGH.md'));
  if (walkthrough) solDocs.push({ id: 'walkthrough', title: 'Walkthrough', html: marked.parse(walkthrough) });
  const expl = read(path.join(dir, 'solution/EXPLANATION.md'));
  if (expl) solDocs.push({ id: 'explanation', title: 'Explanation', html: marked.parse(expl) });
  const solution = {
    files: all.filter((f) => f.startsWith('solution/') && !f.endsWith('.md')).map((f) => fileEntry(path.join(dir, f), f.slice(9))),
    docs: solDocs,
  };

  const q = {
    path: urlPath, title: meta.title, stars: meta.stars, mins: meta.mins, kind: meta.kind, lang: LANG[ext],
    answer: { name: answer, text: read(path.join(dir, answer)) },
    docs, files, tests,
    run: runHint(readme, answer, tests),
  };
  const summary = { path: urlPath, n: +qid.slice(1), title: meta.title, stars: meta.stars, mins: meta.mins, kind: meta.kind };
  return { q, solution, summary };
}

fs.rmSync(OUT, { recursive: true, force: true });
const index = { courses: [] };
let count = 0, bytes = 0;
const emit = (rel, obj) => {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const s = JSON.stringify(obj);
  fs.writeFileSync(p, s);
  bytes += s.length;
};

for (const c of COURSES) {
  const course = { id: c.id, title: c.title, sub: c.sub, sets: [] };
  for (const s of c.sets) {
    const groups = s.groups || [[null, null]];
    const set = { id: s.id, title: s.title, blurb: s.blurb, groups: [] };
    for (const [gid, gtitle] of groups) {
      const dir = path.join(SRC, c.id, s.id, gid || '');
      const qs = fs.readdirSync(dir).filter((f) => /^q\d\d$/.test(f)).sort();
      const items = [];
      for (const qid of qs) {
        const urlPath = [c.id, s.id, gid, String(+qid.slice(1))].filter(Boolean).join('/');
        const { q, solution, summary } = buildQuestion(path.join(dir, qid), qid, urlPath);
        emit(`${urlPath}.json`, q);
        emit(`${urlPath}.sol.json`, solution);
        items.push(summary);
        count++;
      }
      set.groups.push({ id: gid, title: gtitle, items });
    }
    course.sets.push(set);
  }
  index.courses.push(course);
}
emit('index.json', index);
// .txt so the host compresses it (it skips .sql)
fs.writeFileSync(path.join(OUT, '3311/classes.txt'), dumpToSql(read(path.join(SRC, '3311/db/classes.dump'))));
console.log(`content: ${count} questions, ${(bytes / 1024 / 1024).toFixed(1)} MB written to public/c`);

// Pyodide's runtime files, served from a versioned path so they can be cached forever.
const pyVersion = JSON.parse(read(path.resolve('node_modules/pyodide/package.json'))).version;
const pyOut = path.resolve('public/pyodide', pyVersion);
if (!fs.existsSync(pyOut)) {
  fs.rmSync(path.resolve('public/pyodide'), { recursive: true, force: true });
  fs.mkdirSync(pyOut, { recursive: true });
  for (const f of ['pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json']) {
    fs.copyFileSync(path.resolve('node_modules/pyodide', f), path.join(pyOut, f));
  }
}
