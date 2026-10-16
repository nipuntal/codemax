# Day 2 · Python Q4 — Middle N Lines

**Difficulty:** ⭐⭐ · **Target:** 7 min

Write a Python program `q04.py` which is given two arguments: a **filename** and an odd
or even integer **n**. It should print the **n middle lines** of the file.

You may assume `n` and the file's line count have the **same parity** (both odd or both
even), and that `n` is not greater than the number of lines.

```
cat seven.txt
line 0
line 1
line 2
line 3
line 4
line 5
line 6
./q04.py seven.txt 1
line 3
./q04.py seven.txt 3
line 2
line 3
line 4
./q04.py seven.txt 7
line 0
line 1
line 2
line 3
line 4
line 5
line 6
./q04.py six.txt 2
line 2
line 3
./q04.py empty.txt 0

```

* You can assume the file exists and is readable.
* You can read the entire file into memory.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md` — the index arithmetic is the whole question.

```sh
./test.sh
```
