// Run every question's tests in Node through the same engine the browser
// uses — once with the model solution (must pass) and once with the starter
// (must not). Usage: npx tsx scripts/verify.ts [path-prefix]
import fs from 'node:fs';
import path from 'node:path';
import { loadPyodide } from 'pyodide';
import { PGlite } from '@electric-sql/pglite';
import { configurePy } from '../src/runner/py';
import { configurePg, ensurePg } from '../src/runner/pg';
import { test, type Job } from '../src/runner/engine';

const C = path.resolve('public/c');
configurePg(async () => ({ PGlite, sql: fs.readFileSync(path.join(C, '3311/classes.txt'), 'utf8') }));
configurePy(() => loadPyodide(), ensurePg);

const prefix = process.argv[2] ?? '';
const index = JSON.parse(fs.readFileSync(path.join(C, 'index.json'), 'utf8'));
const paths: string[] = index.courses.flatMap((c: any) => c.sets.flatMap((s: any) => s.groups.flatMap((g: any) => g.items.map((i: any) => i.path))))
  .filter((p: string) => p.startsWith(prefix));

let pass = 0, fail = 0, starterPass = 0;
const t0 = Date.now();
for (const p of paths) {
  const q = JSON.parse(fs.readFileSync(path.join(C, `${p}.json`), 'utf8'));
  const sol = JSON.parse(fs.readFileSync(path.join(C, `${p}.sol.json`), 'utf8'));
  const answer = sol.files.find((f: any) => f.name === q.answer.name);
  const job: Job = { path: p, answer: { name: q.answer.name, text: answer?.text ?? '' }, files: q.files, tests: q.tests };
  const t = Date.now();
  const res = await test(job);
  const ok = res.every((r) => r.pass);
  ok ? pass++ : fail++;
  if (!ok) {
    console.log(`FAIL ${p}  (${Date.now() - t}ms)`);
    for (const r of res.filter((r) => !r.pass)) {
      console.log(`  case ${r.name}${r.note ? ' — ' + r.note : ''}`);
      const g = r.got.split('\n'), w = r.want.split('\n');
      for (let i = 0, shown = 0; i < Math.max(g.length, w.length) && shown < 6; i++) {
        if (g[i] !== w[i]) { console.log(`    got : ${JSON.stringify(g[i])}\n    want: ${JSON.stringify(w[i])}`); shown++; }
      }
    }
  }
  if (process.env.STARTERS) {
    const s = await test({ ...job, answer: q.answer });
    if (s.length && s.every((r) => r.pass)) { starterPass++; console.log(`STARTER PASSES ${p}`); }
  }
}
console.log(`\n${pass} passed, ${fail} failed${process.env.STARTERS ? `, ${starterPass} starters pass` : ''}  (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
process.exit(fail ? 1 : 0);
