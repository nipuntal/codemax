# Day 2 · Shell Q13 — Count Down

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 8 min · Format: **full script**

Write a POSIX-compatible shell script `q13.sh` which takes 3 arguments:
a **start** integer, a **stop** integer, and a **filename**.

It should create a file of that name containing the integers from start **down to**
stop inclusive, one per line. You may assume start ≥ stop.

```
./q13.sh 5 1 five.txt
cat five.txt
5
4
3
2
1
./q13.sh 42 40 fortytwo.txt
cat fortytwo.txt
42
41
40
./q13.sh 7 7 one.txt
cat one.txt
7
./q13.sh 1000 1 big.txt
wc -l big.txt
    1000 big.txt
```

### Rules
* First line of your script must be `#!/bin/dash`.
* You are **not** permitted to use external programs — no `seq`, `grep`, `sort`,
  `awk`, `printf(1)`, `bc`.
* You **are** permitted built-in shell arithmetic and built-ins:
  `case cd echo exit for if pwd read shift test while [`
* No bash/zsh extensions. Must run under `/bin/dash`.
* No Perl/C/Python.
* No error checking necessary.

Read `NOTES.md`.

```sh
./test.sh
```
