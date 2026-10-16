# Day 3 · Q12 — Is This File Sorted?  ·  [python]  ·  ⭐⭐ · 8 min

Write a Python program `q12.py` that takes one argument, a filename, and reports whether
the file's lines are in non-decreasing alphabetical order.

Print exactly one line:

* `Sorted` if every line is `<=` the line after it.
* `Not sorted: line N` otherwise, where N is the 1-based number of the **first** line
  that is greater than the line following it.

```
./q12.py sorted1.txt
Sorted
./q12.py unsorted1.txt
Not sorted: line 2
./q12.py single.txt
Sorted
./q12.py empty.txt
Sorted
./q12.py equal.txt
Sorted
```

* Assume the file exists and is readable.
* Lines are terminated with `\n`.
* Python only, no external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```
