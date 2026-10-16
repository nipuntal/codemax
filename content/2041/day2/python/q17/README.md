# Day 2 · Python Q17 — head in Python

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 10 min

Write a Python program `q17.py` implementing `head`.

Usage: `q17.py [-n NUM] [FILE...]`

* Print the first NUM lines of each file (default 10).
* With **no** file arguments, read stdin.
* With **more than one** file, print a header before each file's lines:
  ```
  ==> FILENAME <==
  ```
  and a **blank line between** files (but not before the first, and not after the last).
* With exactly one file, print no header.
* If a file cannot be opened, print `q17.py: cannot open FILENAME` to **stderr** and
  continue with the next file.

```
./q17.py -n 2 a.txt
alpha 1
alpha 2
./q17.py -n 2 a.txt b.txt
==> a.txt <==
alpha 1
alpha 2

==> b.txt <==
beta 1
beta 2
./q17.py -n 3 a.txt nosuch.txt b.txt
==> a.txt <==
alpha 1
alpha 2
alpha 3

==> b.txt <==
beta 1
beta 2
beta 3
```

* Your answer must be Python only. You may not run external programs.

Read `NOTES.md` — the blank-line placement is the fiddly part.

```sh
./test.sh
```

**Note on `./test.sh`:** the first three cases compare **stdout only** (stderr is
discarded), because stdout/stderr interleaving into one stream is not deterministic.
The fourth case does the reverse — it discards stdout and checks only your stderr
message.
