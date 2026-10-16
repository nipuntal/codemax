# Day 2 · Shell Q3 — Surnames

**Difficulty:** ⭐⭐ · **Target:** 6 min · Format: **single pipeline**

Same enrolment format.

Write a shell pipeline in `q03.sh` that prints the **surname** of every student, one
per line, in sorted order.

Each **student** contributes their surname exactly once, no matter how many courses
they are enrolled in — but if two different students share a surname, it is printed
twice.

```
./q03.sh < enrollments.txt
Carey
Costner
Klum
Klum
Neeson
Steenburgen
Thorpe
Thorpe
Wang
Wang
```

Same rules as Q1.

Read `NOTES.md` — the "once per student" requirement is the whole question.

```sh
./test.sh
```
