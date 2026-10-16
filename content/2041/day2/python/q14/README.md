# Day 2 · Python Q14 — Repeated References

**Difficulty:** ⭐⭐⭐⭐ (test level) · **Target:** 11 min

Write a Python program `q14.py` that reads lines of text from standard input and prints
them to standard output, **except** for lines of the form:

```
#n
#n*k
```
where `n` and `k` are positive integers and nothing else appears on the line.

* `#n` is replaced by the n'th line of input (1-based).
* `#n*k` is replaced by k copies of the n'th line of input, each on its own line.

All `n` values are valid input line numbers, and no `n` refers to another `#` line.

```
cat input.txt
line A
line B
line C
#7
line D
#2*3
line E
#1
./q14.py < input.txt
line A
line B
line C
line E
line D
line B
line B
line B
line E
line A
```

* Assume no more than 1024 lines, each no more than 256 characters.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md` — note that `#7` refers to a line that hasn't been read yet.

```sh
./test.sh
```
