# Day 2 · Python Q15 — uniq in Python

**Difficulty:** ⭐⭐⭐ · **Target:** 10 min

Write a Python program `q15.py` implementing a subset of `uniq`, reading stdin.

Usage: `q15.py [-c] [-d] [-i]`

Like `uniq`, it collapses **adjacent** identical lines. Options:

* (none) — print one copy of each run
* `-c` — prefix each printed line with the size of its run, right-aligned in a field of
  width 4, then a space
* `-d` — print only lines that were repeated (run length > 1)
* `-i` — compare lines ignoring case

`-c` and `-d` may be combined. When printing, output the **first** line of the run as it
originally appeared.

```
cat animals.txt
cat
cat
Dog
dog
bird
cat
cat
cat
./q15.py < animals.txt
cat
Dog
dog
bird
cat
./q15.py -c < animals.txt
   2 cat
   1 Dog
   1 dog
   1 bird
   3 cat
./q15.py -i -c < animals.txt
   2 cat
   2 Dog
   1 bird
   3 cat
./q15.py -d -i < animals.txt
cat
Dog
cat
```

* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```
