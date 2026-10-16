# Day 2 · Shell Q6 — Most Common Surname

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 10 min · Format: **single pipeline**

Same enrolment format.

Write a shell pipeline in `q06.sh` that outputs the **most common surname** among
students enrolled in `COMP3311`, `COMP3331` or `COMP3411`.

* Print a single line containing a single word.
* Each student counts once per surname regardless of how many of those courses they
  are enrolled in.
* If several surnames are equally most common, print the one that is **alphabetically
  first**.

```
./q06.sh < enrollments.txt
Klum
```
```
./q06.sh < more_enrollments.txt
Yilmaz
```

### Rules
Single pipeline, stdin, no `if`/`while`/`for`, POSIX, no other languages.

Read `NOTES.md` — the tie-break is where this question is won or lost.

```sh
./test.sh
```
