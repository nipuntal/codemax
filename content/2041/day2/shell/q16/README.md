# Day 2 · Shell Q16 — Double Letter Echo

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 9 min · Format: **full script**

Write a POSIX-compatible shell script `q16.sh` that prints its command-line arguments
to standard output, like `echo`, **except** an argument is printed only if it contains
a **doubled letter** — the same letter twice in a row, case-insensitively
(`Aa` counts, `ab` does not).

```
./q16.sh hello world bookkeeper cat
hello bookkeeper 
./q16.sh aBBa xyz Foo bar
aBBa Foo 
./q16.sh

./q16.sh mississippi banana
mississippi 
./q16.sh aA Bb cD ee
aA Bb ee 
```

* Your script should produce exactly **1 line** of output.
* A trailing space at the end of the line is acceptable.

### Rules
* First line must be `#!/bin/dash`.
* You may not create temporary files.
* Permitted external programs: `basename cat chmod cmp cp cut diff dirname echo expr
  false find grep head ls mkdir mktemp mv printf pwd rev rm rmdir sed seq sort stat
  strings tac tail tee test touch tr true uniq wc xargs`
* Permitted built-ins: `case cd exit for if pwd read shift test while [`
* No `awk`. No Perl/C/Python.

Read `NOTES.md`.

```sh
./test.sh
```
