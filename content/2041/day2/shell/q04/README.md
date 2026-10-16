# Day 2 · Shell Q4 — Enrolments per Course

**Difficulty:** ⭐⭐ · **Target:** 6 min · Format: **single pipeline**

Same enrolment format.

Write a shell pipeline in `q04.sh` that prints, for each course, how many students are
enrolled in it, formatted as:

```
COUNT COURSE
```
with exactly one space between them, ordered by count **descending**. Courses with the
same count are ordered by course code **ascending**.

```
./q04.sh < enrollments.txt
3 COMP3311
3 COMP3331
2 COMP1917
2 COMP2041
1 COMP1927
1 COMP2920
1 COMP3141
1 COMP3411
1 COMP3891
1 COMP4920
```

Same rules as Q1.

Read `NOTES.md` — the tie-breaking and the `uniq -c` padding are the marks here.

```sh
./test.sh
```
