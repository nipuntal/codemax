# Day 3 · Q23 — Balanced Words  ·  [python]  ·  ⭐⭐⭐⭐ · 13 min · **8 marks**

> **This is Question 10 of the COMP2041 practice exam, verbatim.**

Write a Python program `q23.py` that reads lines of text from its standard input and
prints them to its standard output **with the words which are not balanced removed**.

A word is **balanced** if every character in the word occurs exactly *n* times (for some
value of *n*). Case should be ignored when considering whether a word is balanced.

* `Gaga` is balanced — `g` occurs twice and `a` occurs twice.
* `gauge` is not balanced — `g` occurs twice but `u`, `a` and `e` occur once.

Assume that a word is any sequence of non-whitespace characters, so `tock-tock` is a
single word. Print the words separated by a **single space** character.

```
./q23.py < frost.txt
I be this with a sigh
ages and ages
Two roads in a and I --
I the one by,
And has made the
```
```
cat interesting_words.txt
1 duck   bulbul  Gaga    tocktocktock  wwwwweeeee
2 goose baboon bonobo   Guage tock-tock  wwwwweee
3 xerophytic   Deeded sestettes     zZz teammate horseshoer happenchance
4   elephant decorator    agaga  teammates            horseshoe
./q23.py < interesting_words.txt
1 duck bulbul Gaga tocktocktock wwwwweeeee
2
3 xerophytic Deeded sestettes zZz teammate horseshoer happenchance
4
```

* Your program may read all lines before producing any output.
* Assume input contains only ASCII bytes.
* Python only. No external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```
