# Day 3 · Q39 — Compare Two Files  ·  [python]  ·  ⭐⭐⭐⭐ · 12 min

Write a Python program `q39.py` which takes two filenames and reports how they differ.
Print exactly one line:

* identical → `identical`
* same number of lines but some differ →
  `N line(s) differ, first at line L`
* different line counts → `FILE1 has A lines, FILE2 has B lines; C common line(s) differ`
  where C counts differing lines among the first `min(A,B)` only

```
./q39.py a.txt d.txt
identical
./q39.py a.txt b.txt
1 line(s) differ, first at line 3
./q39.py a.txt c.txt
a.txt has 4 lines, c.txt has 2 lines; 0 common line(s) differ
./q39.py c.txt b.txt
c.txt has 2 lines, b.txt has 4 lines; 0 common line(s) differ
```

* Exactly one line of output.
* Assume both files exist and fit in memory.
* Python only. No external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```
