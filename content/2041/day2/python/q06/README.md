# Day 2 · Python Q6 — Sort Lines by Word Count

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 8 min

Write a Python program `q06.py` which is given one argument, a filename.

It should print the lines of the file ordered by **number of words**, fewest first.
Lines with the same number of words must be ordered **alphabetically**.

```
cat file.txt
gamma beta alpha
one
zebra apple
b b b b
apple zebra
two
a a a a
short line here
./q06.py file.txt
one
two
apple zebra
zebra apple
gamma beta alpha
short line here
a a a a
b b b b
```

* You can assume the file exists and is readable.
* Lines are terminated with `\n`; the file contains no unterminated line.
* You can read the entire file into memory.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```
