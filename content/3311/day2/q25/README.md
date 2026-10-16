# Question 25 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★★☆

## When is campus busiest?


A class running 9–11 occupies the **9 o'clock hour** and the **10 o'clock
hour**. For each weekday, find the hour with the most students sitting in
classes, and say how many.

```
$ ./q25.py
Mon 13:00  1421 students in 18 classes
Tue ...
```

Rules:

- one line per weekday in week order:
  `DAY HH:00  N students in M classes`
  (two spaces after the time; `N` and `M` are plain numbers)
- if two hours tie for busiest on a day, report the **earlier** one
- takes no arguments

> **Tests:** turning a time *range* into the hours it covers. This is the
> hardest kind of SQL in the course and it is worth knowing the trick.

<details><summary>Hint 1</summary>

`generate_series(start_time, end_time - 1)` produces one row per hour a class
occupies. Join it to `Classes` and you have (class, hour) pairs.
</details>

<details><summary>Hint 2</summary>

Why `end_time - 1`? A 9–11 class occupies hours 9 and 10, not 11 — at 11 it has
finished.
</details>

<details><summary>Hint 3</summary>

Then group by (day, hour), sum the enrolments, and pick the maximum per day —
question 16's "best in each group" pattern, or `rank()`.
</details>
