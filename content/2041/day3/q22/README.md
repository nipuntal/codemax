# Day 3 · Q22 — Isogram Filter  ·  [python]  ·  ⭐⭐⭐ · 10 min

Write a Python program `q22.py` that reads lines of text from stdin and prints them to
stdout with the words which are **not isograms** removed.

A word is an **isogram** if no character occurs more than once in it.
Case should be **ignored** when deciding.

A word is any sequence of non-whitespace characters, so `tock-tock` is one word.
Print the surviving words separated by a **single space**.

```
cat words.txt
1 duck bulbul Gaga tocktocktock
2 dialogue lumberjacks Deeded ambidextrously
3 Sphinx of black quartz judge my vow
4 aa Bb cDe xyz
./q22.py < words.txt
1 duck
2 dialogue lumberjacks ambidextrously
3 Sphinx of black quartz judge my vow
4 cDe xyz
```

* Assume input is ASCII.
* Python only, no external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```
