# Day 3 · Q27 — Compare Two Directory Trees  ·  [shell script]  ·  ⭐⭐⭐⭐⭐ · 18 min · **8 marks**

> **This is Question 11 of the COMP2041 practice exam, verbatim.**

We need a program to check if the same files are present in two directory trees.

Write a POSIX-compatible shell script `q27.sh`, which is given 2 arguments which are
the pathnames of directories. It should print a **single line** containing 4 integers:

* number of files present at the same position in both trees and the **same size**
* number of files present at the same position in both trees but **different sizes**
* number of files present **only in the first** tree
* number of files present **only in the second** tree

A file must be at the same **relative pathname** to count as present in both. If
`dir1/2041/lab09/answer.py` exists, it is present in the second tree only if
`dir2/2041/lab09/answer.py` exists — a file of the same name elsewhere does not count.

You do not need to compare contents, only sizes.

```
mkdir -p d1/b/c && echo hello andrew > d1/file1 && echo bye andrew > d1/b/file2 && echo 1 > d1/b/c/one
mkdir -p d2/b/c && echo HELLO andrew > d2/file1 && echo Bye Andrew > d2/b/file2 && echo 2 > d2/b/c/one
./q27.sh d1 d2
3 0 0 0
echo hello everyone > d1/file1
./q27.sh d1 d2
2 1 0 0
echo 3 > d2/b/c/three
./q27.sh d1 d2
2 1 0 1
echo 3 > d1/b/three
./q27.sh d1 d2
2 1 1 1
```
Note `d1/b/three` and `d2/b/c/three` are at different relative pathnames, so neither
counts as present in both.

* Trees contain only directories and regular files.
* Permitted external programs: `basename cat chmod cmp cp cut diff dirname echo expr
  false find grep head ls mkdir mktemp mv printf pwd rev rm rmdir sed seq sort stat
  strings tac tail tee test touch tr true uniq wc xargs`
* Built-ins: `case cd exit for if read shift while`
* `#!/bin/dash`, POSIX only. No Perl/C/Python/awk.
* You **may** create temporary files.

> Autotest will be of limited help debugging this one. Expect to debug it yourself.

```sh
./test.sh          # then read WALKTHROUGH.md
```
