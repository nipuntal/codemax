# Day 2 · Python Q16 — cut in Python

**Difficulty:** ⭐⭐⭐⭐ · **Target:** 12 min

Write a Python program `q16.py` implementing a subset of `cut`.

Usage: `q16.py -d DELIM -f LIST [FILE...]`

* `-d DELIM` — the single-character field delimiter (required)
* `-f LIST` — a comma-separated list of field specifiers, each of which is
  `N` (one field), `N-M` (a range), `N-` (N to the end) or `-M` (start to M)
* Fields are numbered from 1.
* Output the selected fields **in increasing field order, each field once**, joined by
  the delimiter — exactly as real `cut` does, regardless of the order written in LIST.
* Lines that do not contain the delimiter are printed unchanged.
* If no file is given, read stdin.

```
cat data.txt
a:b:c:d:e
1:2:3:4:5
nodelimiter
x:y
./q16.py -d: -f2 data.txt
b
2
nodelimiter
y
./q16.py -d: -f1,3 data.txt
a:c
1:3
nodelimiter
x
./q16.py -d: -f3-  data.txt
c:d:e
3:4:5
nodelimiter

./q16.py -d: -f-2  data.txt
a:b
1:2
nodelimiter
x:y
./q16.py -d: -f5,1,2 data.txt
a:b:e
1:2:5
nodelimiter
x:y
```

* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```
