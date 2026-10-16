# Day 2 · Shell Q17 — File With The Longest Line

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 9 min · Format: **full script**

Write a POSIX-compatible shell script `q17.sh` which, given one or more filenames as
arguments, prints the name of the file containing the **longest line**.

```
./q17.sh short.txt long.txt medium.txt
long.txt
./q17.sh short.txt
short.txt
```

* Your program can assume it is given 1 or more valid filenames.
* It should print exactly one line, containing only one of the filenames it was given.
* If several files tie for the longest line, print any of them.
* Files contain only ASCII, every line terminated by a single `\n`.

### Rules
* First line must be `#!/bin/dash`.
* You may use external programs such as `wc`.
* POSIX only, must run under `/bin/dash`. No bash extensions.
* No Perl/C/Python.
* No error checking necessary.

Read `NOTES.md`.

```sh
./test.sh
```
