# Day 2 · Shell Q7 — Students Taking Three or More Courses

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 10 min · Format: **single pipeline**

Same enrolment format.

Write a shell pipeline in `q07.sh` that outputs the **ID number** of every student
enrolled in **three or more** courses.

* Only the ID numbers.
* Each ID printed once.
* One per line.
* Numerical order.

```
./q07.sh < enrollments.txt
3383025
```
```
./q07.sh < more_enrollments.txt | head -5
5206182
5217811
5224709
5226371
5226837
./q07.sh < more_enrollments.txt | wc -l
      32
```

### Rules
Single pipeline, stdin, no `if`/`while`/`for`, POSIX, no other languages.

Read `NOTES.md`.

```sh
./test.sh
```
