# Day 2 · Python Q3 — Once Echo

**Difficulty:** ⭐⭐ · **Target:** 6 min

Write a Python program `q03.py` that prints its command-line arguments to standard
output, like `echo`, **except** only arguments that occur **exactly once** in the whole
argument list should be printed. Arguments appearing two or more times are printed not
at all.

Order of the printed arguments must match their order on the command line.

```
./q03.py d c b d c a a d
b
./q03.py bird cow bird cow fish
fish
./q03.py how much wood would a woodchuck chuck
how much wood would a woodchuck chuck
./q03.py echo echo echo

./q03.py

```

* Print one line, arguments separated by single spaces, no trailing space.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md` — note this is **not** the same as "print the first occurrence".

```sh
./test.sh
```
