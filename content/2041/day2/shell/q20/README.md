# Day 2 · Shell Q20 — Files That Differ Between Two Directories

**Difficulty:** ⭐⭐⭐⭐ (test level) · **Target:** 12 min · Format: **full script**

Write a POSIX-compatible shell script `q20.sh` which takes the pathnames of **two
directories** as arguments.

It should print, in alphabetical order, the name of every file that exists in **both**
directories but whose **contents differ**.

```
./q20.sh dir1 dir2
changed.txt
config.ini
```

* You can assume you are given 2 valid directory names.
* You can assume filenames do not start with `.`.
* Files contain only ASCII.
* Print only the filename, not a path.

### Rules
* First line must be `#!/bin/dash`.
* You may use external programs such as `cmp` and `diff`.
* POSIX only, must run under `/bin/dash`. No bash extensions.
* No Perl/C/Python.

Read `NOTES.md`.

```sh
./test.sh
```
