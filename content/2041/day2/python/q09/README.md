# Day 2 · Python Q9 — Smallest Numbered Line

**Difficulty:** ⭐⭐⭐⭐ (test level) · **Target:** 11 min

Write a Python program `q09.py` that reads lines from standard input until end-of-input.
It should then print the line(s) which contained the **smallest** number.

Lines may contain multiple numbers, and any characters between them.
If the smallest number occurs on multiple lines, print all of them, in the order they
occurred. If no line contains a number, print nothing.

```
./q09.py
I spent $ 15.50 for
3.3 kg apples yesterday.
2000 is a leap year.

3.3 kg apples yesterday.
```
```
./q09.py
a 0.01
b .5
c -0.9

c -0.9
```
```
./q09.py
a -.5
b -5
c --90--

c --90--
```
```
./q09.py
the quick brown f42ox
4 9 42 2 4
1 2 3 4 42.0
no forty two
last 42

1 2 3 4 42.0
```
```
./q09.py
I love programming in Shell.
but I like Python better.

```

* Numbers contain no whitespace, commas or other extra characters.
* Numbers are decimal only, never scientific/exponential notation.
* Input is ASCII.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md` — **the number regex is the entire question.** Work out what should
match in `--90--`, `.5`, `-.5` and `f42ox` before you write anything.

```sh
./test.sh
```
