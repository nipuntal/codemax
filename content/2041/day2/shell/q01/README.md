# Day 2 · Shell Q1 — Course Codes

**Difficulty:** ⭐ · **Target:** 4 min · Format: **single pipeline**

Student enrolment data has this format:
```
COMP1917|3360379|Costner, Kevin Augustus          |3978/1|M
COURSE  |  ZID  | Surname, Given names            |PROG/YR|SEX
```
The input is **unordered**.

Write a shell pipeline in `q01.sh` that prints every **distinct course code**, one per
line, in sorted order.

```
./q01.sh < enrollments.txt
COMP1917
COMP1927
COMP2041
COMP2920
COMP3141
COMP3311
COMP3331
COMP3411
COMP3891
COMP4920
```

### Rules (these apply to every pipeline question in this set)
* Your answer must be a **single shell pipeline**.
* Input comes from **stdin**.
* You may use any UNIX filter covered in lectures.
* You may **not** use `if`, `while`, `for`, or other shell constructs.
* POSIX shell only — no bash/zsh extensions.
* No Perl, C, Python, awk-as-a-program.
* No error checking needed.

Read `NOTES.md` for the patterns and edge cases this question is testing.

```sh
./test.sh
```
