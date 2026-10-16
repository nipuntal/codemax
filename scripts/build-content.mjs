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
  let title = h1, tag = null;
  const dash = h1.match(/—\s*(.+)$/);
  if (dash) {
    const parts = dash[1].split(/\s{2,}·\s{2,}|\s{2,}(?=\()/);
    title = parts[0].trim();
    const t = (parts.slice(1).find((p) => /^[\[(]/.test(p.trim())) || '').replace(/[\[\]()]/g, '').trim();
    tag = t || null;
  } else {
    // 3311: the h1 is a label, the h2 is the title
    const h2 = lines.find((l) => l.startsWith('## '));
    title = h2 ? decode(h2.slice(3)).trim() : h1;
    const kind = h1.split('·')[1];
    tag = kind ? kind.trim() : null;
  }
  const stars = (head.match(/[⭐★]/gu) || []).length || null;
  const mins = +(head.match(/(\d+)\s*min/) || [])[1] || null;
  const format = (head.match(/Format:\s*\*\*([^*]+)\*\*/) || [])[1];
  return { title, tag: format || tag, stars, mins };
}

// The first real sentence of the task, as plain text, for the list preview.
function preview(md) {
  const task = md.split(/^## +THE TASK\s*$/m)[1] ?? md;
  const paras = task.replace(/```[\s\S]*?```/g, '').split(/\n\s*\n/);
  for (const p of paras) {
    const t = p.trim();
    if (!t || /^(#|>|\||---|<|\*\*Difficulty|\*\*Target|-|\*\s|\d+\.)/.test(t)) continue;
    return decode(t).replace(/<[^>]+>/g, '').replace(/[*_`]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').slice(0, 220);
  }
  return '';
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
  return text.includes('�') ? { name, b64: buf.toString('base64') } : { name, text };
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
  const tests = all.filter(isTest).map((f) => fileEntry(path.join(dir, f), f));

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
    path: urlPath, ...meta, lang: LANG[ext],
    answer: { name: answer, text: read(path.join(dir, answer)) },
    docs, files, tests,
  };
  const summary = { path: urlPath, n: +qid.slice(1), title: meta.title, tag: meta.tag, stars: meta.stars, mins: meta.mins, lang: LANG[ext], preview: preview(readme) };
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
console.log(`content: ${count} questions, ${(bytes / 1024 / 1024).toFixed(1)} MB written to public/c`);
