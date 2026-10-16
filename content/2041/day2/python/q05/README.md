# Day 2 · Python Q5 — Fuzzy Snap

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 9 min

Write a Python program `q05.py` which reads lines from standard input until it reads a
line that has been entered **n** times. It should then print `Snap: ` followed by the
line **exactly as it was most recently entered**, and stop reading input.

`n` is given as a command-line argument.

Lines are compared **ignoring case and ignoring whitespace differences** — leading and
trailing whitespace is irrelevant, and any run of internal whitespace counts as a single
space.

If end-of-input is reached before any line is entered n times, print nothing.

```
./q05.py 2
hi
how
are
you
  HI
Snap:   HI
```
```
./q05.py 2
hi
hi hi
hi hi hi
hi   HI
Snap: hi   HI
```
```
./q05.py 3
Hello World
line 2
hello    world
line 3
HELLO WORLD
Snap: HELLO WORLD
```
```
./q05.py 4
a
b
a
b
```

* Input lines are ASCII; assume nothing else about them.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```
