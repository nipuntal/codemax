# Q1 explanation

```sh
grep cat | wc -l
```

* `grep cat` — no filename, so it reads **stdin** (which the shell connected to
  `animals.txt` via `< animals.txt`). It prints every line containing the substring `cat`.
* `| wc -l` — counts those lines.

Matches: `cat`, `catfish`, `bobcat`, `cat`, `scatter` → **5**.

Note `scatter` matched! `grep cat` matches the *substring* `cat` anywhere.
If you wanted only the whole word you'd use `grep -w cat` (→ 2).

## Shorter alternative
```sh
grep -c cat
```
`-c` makes grep count matching lines itself. Both are correct; know both.

## Common mistakes
* `cat animals.txt | grep cat | wc -l` — works, but the file was already on stdin.
  Harmless here, but in the exam the file may only exist on stdin.
* `wc -l < animals.txt` — counts *all* lines, not just matching ones.
