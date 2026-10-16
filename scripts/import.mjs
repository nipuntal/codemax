// One-off, local-only: copy the chosen question sets from ~/COMP2041 and
// ~/COMP3311 into ./content, which is the committed source of truth.
//
//   STARTERS=/path/to/recovered/starters node scripts/import.mjs
//
// The answer files in the source folders hold attempts, not blank starters,
// so each one is replaced by the original template (recovered separately and
// laid out as STARTERS/<course>/<set>/<qid>.<ext>). Data that a question edits
// in place is restored from its hidden .orig snapshot.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HOME = os.homedir();
const OUT = path.resolve('content');
const STARTERS = process.env.STARTERS;
if (!STARTERS) throw new Error('set STARTERS to the recovered starter folder');

// [source dir, content dir, starter dir]
const SETS = [
  ['COMP2041/day1/shell', '2041/day1/shell', '2041/day1/shell'],
  ['COMP2041/day1/python', '2041/day1/python', '2041/day1/python'],
  ['COMP2041/day2/shell', '2041/day2/shell', '2041/day2/shell'],
  ['COMP2041/day2/python', '2041/day2/python', '2041/day2/python'],
  ['COMP2041/day3', '2041/day3', '2041/day3'],
  ['COMP3311/day1_II', '3311/day1', '3311/day1'],
  ['COMP3311/day2', '3311/day2', null], // untouched: answer files are the starters
];

const SKIP = new Set(['.DS_Store', '.vscode', 'check', '.load.log']);
const skip = (name) => SKIP.has(name) || name.endsWith('.mine');

function copyTree(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip(e.name) || (e.name.startsWith('.') && !e.name.endsWith('.orig'))) continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d);
    else fs.copyFileSync(s, d);
  }
}

// .frost.txt.orig -> frost.txt ; .hello.orig -> hello.txt (the extension was dropped)
function restoreSnapshots(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (!(name.startsWith('.') && name.endsWith('.orig'))) continue;
    const stem = name.slice(1, -'.orig'.length);
    const target = fs.existsSync(path.join(dir, stem))
      ? stem
      : fs.readdirSync(dir).find((f) => !f.startsWith('.') && f.replace(/\.[^.]+$/, '') === stem);
    if (!target) throw new Error(`no data file for snapshot ${dir}/${name}`);
    fs.copyFileSync(path.join(dir, name), path.join(dir, target));
    fs.rmSync(path.join(dir, name));
  }
}

// Practice leaves scratch files behind (outputs, notes to self). Keep a
// top-level entry only if the question's own text mentions it by name.
const STRUCTURAL = new Set(['README.md', 'NOTES.md', 'WALKTHROUGH.md', 'test.sh', 'expected_output.txt', 'tests', 'solution']);
const removed = [];
function dropStrays(dir, q) {
  const texts = [];
  const collect = (p) => {
    for (const e of fs.readdirSync(p, { withFileTypes: true })) {
      const f = path.join(p, e.name);
      if (e.isDirectory()) collect(f);
      else if (/\.(md|sh|py|sql|txt|expected)$/.test(e.name) || e.name === 'test.sh') texts.push(fs.readFileSync(f, 'utf8'));
    }
  };
  for (const s of STRUCTURAL) if (fs.existsSync(path.join(dir, s))) {
    const p = path.join(dir, s);
    fs.statSync(p).isDirectory() ? collect(p) : texts.push(fs.readFileSync(p, 'utf8'));
  }
  const corpus = texts.join('\n');
  for (const name of fs.readdirSync(dir)) {
    if (STRUCTURAL.has(name) || new RegExp(`^${q}\\.`).test(name)) continue;
    const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`(^|[^\\w.-])${esc}($|[^\\w-])`, 'm').test(corpus)) {
      fs.rmSync(path.join(dir, name), { recursive: true });
      removed.push(path.relative(OUT, path.join(dir, name)));
    }
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
let n = 0;
for (const [src, dst, starters] of SETS) {
  const from = path.join(HOME, src);
  for (const q of fs.readdirSync(from).filter((f) => /^q\d\d$/.test(f)).sort()) {
    const to = path.join(OUT, dst, q);
    copyTree(path.join(from, q), to);
    restoreSnapshots(to);
    dropStrays(to, q);
    if (starters) {
      const answers = fs.readdirSync(to).filter((f) => new RegExp(`^${q}\\.(sh|py|sql|txt)$`).test(f));
      if (answers.length !== 1) throw new Error(`${dst}/${q}: expected one answer file, got ${answers}`);
      const starter = path.join(STARTERS, starters, answers[0]);
      if (!fs.existsSync(starter)) throw new Error(`missing starter ${starter}`);
      fs.copyFileSync(starter, path.join(to, answers[0]));
    }
    n++;
  }
}
fs.mkdirSync(path.join(OUT, '3311/db'), { recursive: true });
fs.copyFileSync(path.join(HOME, 'COMP3311/day2/db/classes.dump'), path.join(OUT, '3311/db/classes.dump'));
console.log(`imported ${n} questions into ${OUT}`);
console.log(`dropped ${removed.length} unreferenced files:\n  ${removed.join('\n  ')}`);
