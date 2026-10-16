# Day 2 · Python Q18 — cat -n -v

**Difficulty:** ⭐⭐⭐⭐⭐ · **Target:** 13 min

Write a Python program `q18.py` implementing `cat` with two options.

Usage: `q18.py [-n] [-v] [FILE...]`

* `-n` — print a line number at the start of each line, in a field of width 6,
  followed by two spaces, then the line. Numbering is **continuous across files**.
* `-v` — display non-printing characters visibly:
  * a control character with code `X` (0–31, except newline) prints as `^` followed by
    `chr(X + 64)` — so a tab (9) prints as `^I`
  * DEL (127) prints as `^?`
* With no file arguments, read stdin.

```
./q18.py -n a.txt
     1  first
     2  second
     3  third
./q18.py -n a.txt b.txt
     1  first
     2  second
     3  third
     4  fourth
     5  fifth
./q18.py -v ctrl.txt
a^Ib
^Gbell
plain
./q18.py -n -v ctrl.txt
     1  a^Ib
     2  ^Gbell
     3  plain
```

* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```
