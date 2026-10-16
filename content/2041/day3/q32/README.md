# Day 3 · Q32 — Transpose A Table  ·  [shell script]  ·  ⭐⭐⭐⭐ · 12 min

Write a POSIX-compatible shell script `q32.sh` that reads a pipe-separated table on
stdin and prints its **transpose** — row *i* becomes column *i*.

```
cat table.psv
name|age|city
alice|30|sydney
bob|25|perth
carol|41|hobart
./q32.sh < table.psv
name|alice|bob|carol
age|30|25|41
city|sydney|perth|hobart
```

* Every row has the same number of fields.
* `#!/bin/dash`, POSIX only. No `awk`. You may create temporary files.
* Permitted: `cat cut echo head paste printf sed seq sort tail test tr wc mktemp rm`

```sh
./test.sh          # then read WALKTHROUGH.md
```
