# Day 2 · Shell Q14 — Make Numbered Note Files

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 9 min · Format: **full script**

Write a POSIX-compatible shell script `q14.sh` which takes 2 arguments:
a positive integer **n**, and a **prefix** string.

It should create n files named `PREFIX1.txt` .. `PREFIXn.txt`. File *k* must contain
exactly one line:
```
note k of n
```

```
./q14.sh 3 draft
ls draft*.txt
draft1.txt  draft2.txt  draft3.txt
cat draft1.txt
note 1 of 3
cat draft3.txt
note 3 of 3
./q14.sh 100 memo
ls memo*.txt | wc -l
     100
cat memo42.txt
note 42 of 100
```

### Rules
* First line must be `#!/bin/dash`.
* **No external programs** — no `seq`, `grep`, `printf(1)`, `touch`.
* Built-ins permitted: `cd echo exit for if pwd read shift test while [`
* POSIX only, must run under `/bin/dash`.
* You may assume the files do not already exist.
* No error checking necessary.

Read `NOTES.md`.

```sh
./test.sh
```
