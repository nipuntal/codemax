# Day 2 · Python Q11 — Grep With Options

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 10 min

Write a Python program `q11.py` implementing a subset of `grep`.

Usage: `q11.py [-v] [-i] [-n] REGEX FILE`

* `-v` — print lines that do **not** match
* `-i` — case-insensitive matching
* `-n` — prefix each printed line with its line number and a colon (numbering from 1,
  counting **all** lines of the file, not just printed ones)

Options may appear in any order and any combination, but always **before** the regex.

```
cat pets.txt
The cat sat
A DOG barked
the Cat ran
birds fly
Dogs and cats
./q11.py cat pets.txt
The cat sat
Dogs and cats
./q11.py -i cat pets.txt
The cat sat
the Cat ran
Dogs and cats
./q11.py -v -i cat pets.txt
A DOG barked
birds fly
./q11.py -n -i cat pets.txt
1:The cat sat
3:the Cat ran
5:Dogs and cats
./q11.py -n '^[Tt]he' pets.txt
1:The cat sat
3:the Cat ran
```

* You can assume the regex is valid and the file exists and is readable.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```
