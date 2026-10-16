# Day 2 · Shell Q8 — Program Enrolment Summary

**Difficulty:** ⭐⭐⭐⭐ · **Target:** 12 min · Format: **single pipeline**

Same enrolment format. Field 4 is `PROGRAM/YEAR`, e.g. `3978/3`.

Write a shell pipeline in `q08.sh` that prints, for each **program code** (the part
before the `/`), how many **distinct students** are in it:

```
PROGRAM COUNT
```
one space between them, ordered by count descending, ties by program code ascending.

```
./q08.sh < enrollments.txt
3978 6
3711 3
3648 1
```
```
./q08.sh < more_enrollments.txt
3778 27
3707 23
3648 16
3789 7
```

### Rules
Single pipeline, stdin, no `if`/`while`/`for`, POSIX, no other languages.

Read `NOTES.md`.

```sh
./test.sh
```
