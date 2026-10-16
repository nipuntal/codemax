# Day 2 · Shell Q9 — Reformat Enrolment Records

**Difficulty:** ⭐⭐⭐ · **Target:** 8 min · Format: **single pipeline**

Enrolment records look like:
```
COMP1917|3360379|Costner, Kevin Augustus          |3978/1|M
```

Write a shell pipeline in `q09.sh` that rewrites every line as:
```
z3360379 Kevin Costner (COMP1917)
```
That is: `z` + zID, space, **first given name**, space, **surname**, space, the course
code in parentheses. Middle names are dropped. No trailing spaces. Input order is
preserved (do not sort).

```
./q09.sh < enrollments.txt | head -4
z3360379 Kevin Costner (COMP1917)
z3364562 Mary Carey (COMP1917)
z3383025 Ian Thorpe (COMP3311)
z3860448 Mary Steenburgen (COMP2920)
```

### Rules
Single pipeline, stdin, no `if`/`while`/`for`, POSIX, no other languages.

Read `NOTES.md`.

```sh
./test.sh
```
