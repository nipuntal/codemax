# Module 38 &nbsp;·&nbsp; Python + Psycopg2

## Exam-shaped: one student's week


## THIS IS EXAM-SHAPED

Around 8 marks, 25 minutes. No new material — everything is in modules 00–37.

Work it the way you would in the exam: read it all, plan the queries, build the
scaffolding, then fill it in.

---

## THE TASK

Given a student's **exact** name, print their weekly timetable.

```
$ ./q38.py 'Wang Baird'
Wang Baird (5349453)
Mon 11-13  COMP2121 Lab Class   in EE-233C
Mon 13-14  COMP9332 Lab Class   in ME-G01A
...
9 classes, 16 hours
```

### Rules

- if **no** student has that name → `No such student`
- if **more than one** student has that name → `Ambiguous: N students named NAME`
  and nothing else
- otherwise line 1 is `NAME (ID)`, then one line per class:
  - the day, a space, the span as `S-E` left-aligned in **width 6**
  - then the course and class type together, left-aligned in **width 20**
  - then `in ROOM`
- ordered by day (week order), then start time, then course
- a final line: `C classes, H hours`
- a student enrolled in **nothing** prints line 1 and then `0 classes, 0 hours`
- wrong argument count → `USAGE`

> **This is the shape of the exam's Python questions.** Note that 65 names in
> this database are shared by two or three students — the ambiguous branch is
> genuinely reachable, and the marking will test it.

## How to attack it

<details><summary>Step 1 — the lookup and its three outcomes</summary>

Fetch **all** matching students, then branch on `len(rows)`: 0, 1, or more
(module 27). `fetchone()` would tell you whether there was at least one, but not
whether there were two — and the spec treats those differently.
</details>

<details><summary>Step 2 — the header</summary>

Straight from the row you just fetched. Do not query again.
</details>

<details><summary>Step 3 — the classes</summary>

Join `Attends` to `Classes` to `Rooms` (module 11), filter on the student's id,
order by day then start time then course.
</details>

<details><summary>Step 4 — the summary</summary>

You already have the rows. `len(rows)` for the count, and sum the hours in the
loop (modules 29, 37).
</details>

<details><summary>Step 5 — the format</summary>

Build the span and the course-and-type as separate strings first, then pad them
(module 29). Padding the parts separately would misalign, because class types
vary from `Lecture` to `Tute-Lab`.
</details>
