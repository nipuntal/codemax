# Day 3 · Q13 — Mirrored Files  ·  [python]  ·  ⭐⭐⭐ · 12 min · **8 marks**

> **This is Question 6 of the COMP2041 practice exam, verbatim.**

Two files are **mirrored** if they contain the same lines but in the reverse order to
each other.

Write a Python program `q13.py` that, given two filenames, checks if the two files are
mirrored. `q13.py` should always produce **one line of output**.

If the two files contain a different number of lines, print a single line indicating
this, including the number of lines in each file:
```
./q13.py file1 file2
Not mirrored: different number of lines: 2 versus 1
./q13.py file2 file1
Not mirrored: different number of lines: 1 versus 2
```

If the files contain the same number of lines but a line in the first file is not the
same as the corresponding line in the second file in reverse order, print a single line
indicating this. The message should indicate the line number **in the first file only**,
and only for the **first** line which is different:
```
./q13.py file1 file2
Not mirrored: line 2 different
```

If several lines differ, only the first is reported (`file1b` is `file1` with
`hello` changed to `hi`):
```
./q13.py file1b file2
Not mirrored: line 1 different
```

If they are mirrored:
```
./q13.py file2 file3
Mirrored
./q13.py a b
Mirrored
```

* Always exactly one line of output.
* Exactly two command-line arguments, the names of two files.
* All lines are terminated with a single `\n`.
* Files contain only ASCII bytes and fit in memory.
* Python only. No external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```
