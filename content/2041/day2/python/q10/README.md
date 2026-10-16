# Day 2 · Python Q10 — Statistical Analysis of Words

**Difficulty:** ⭐⭐⭐⭐ (test level) · **Target:** 12 min

Write a Python program `q10.py` that takes one or more words as command-line arguments
and prints:

```
count=C
unique=U
shortest=W
longest=W
mean=M
median=M
mode=W
total=T
```

where:
* `count` — how many arguments
* `unique` — how many distinct arguments
* `shortest` / `longest` — the shortest and longest **word**; ties broken
  alphabetically
* `mean` / `median` — of the word **lengths**, unrounded
* `mode` — the most frequently occurring word; ties broken alphabetically
* `total` — the sum of all the word lengths

```
./q10.py apple fig banana
count=3
unique=3
shortest=fig
longest=banana
mean=4.666666666666667
median=5
mode=apple
total=14
```
```
./q10.py cat dog cat bird cat
count=5
unique=3
shortest=cat
longest=bird
mean=3.2
median=3
mode=cat
total=16
```
```
./q10.py a bb a bb
count=4
unique=2
shortest=a
longest=bb
mean=1.5
median=1.5
mode=a
total=6
```

* You can assume at least one argument.
* Leave all numbers unrounded.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```
