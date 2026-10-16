# Day 3 · Q10 — The Missing Integer  ·  [shell script]  ·  ⭐⭐⭐ · 12 min · **8 marks**

> **This is Question 4 of the COMP2041 practice exam, verbatim.**

Write a POSIX-compatible shell script `q10.sh` that takes a single command-line
argument, a filename.

The file will contain an unordered list of positive integers, one per line, from n to m,
with possibly one integer missing. Your shell script should print the missing integer,
if there is a missing integer. If there is no missing integer your script should print
nothing.

* No integer will occur twice.
* At most one integer will be missing.
* The missing integer will not be n or m.

```
cat numbers_1.txt
39
45
40
44
41
43
./q10.sh numbers_1.txt
42
./q10.sh numbers_2.txt
4
./q10.sh numbers_3.txt
1005
./q10.sh numbers_4.txt

```

* Exactly one command-line argument, a valid filename.
* The file contains only positive integers, one per line.
* At least two integers in the file.
* You **cannot** assume there will always be a missing integer.
* Your script should produce **at most 1 line** of output.
* You are permitted to create temporary files.
* Permitted external programs: `basename cat chmod cmp cp cut diff dirname echo expr
  false find grep head ls mkdir mktemp mv printf pwd rev rm rmdir sed seq sort stat
  strings tac tail tee test touch tr true uniq wc xargs`
* Built-ins: `case cd exit for if read shift while`
* `#!/bin/dash`, POSIX only. No Perl/C/Python/awk.

```sh
./test.sh          # then read WALKTHROUGH.md
```
