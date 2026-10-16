# Question 19 &nbsp;·&nbsp; PLpgSQL &nbsp;·&nbsp; ★★★☆☆

## Does this student have a timetable clash?


Two classes clash if they are on the **same day** and their times **overlap** —
that is, each starts before the other ends.

```
create or replace function q19(_student integer) returns setof text
```

- no such student → `No such student`
- no clashes → `No clashes`
- otherwise one line per clashing pair:
  `DAY: COURSE1 CTYPE1 S1-E1 clashes with COURSE2 CTYPE2 S2-E2`

Order by day, then the first class's start time, then the second's.
List each pair **once**.

> **Tests:** the overlap condition, a self-join, and listing pairs once.

<details><summary>Hint 1</summary>

Overlap is `c1.start_time < c2.end_time and c2.start_time < c1.end_time`. Think
about why *that* and not `c1.start_time = c2.start_time`.
</details>

<details><summary>Hint 2</summary>

To list each pair once, join `Attends` to itself with `a1.class_id <
a2.class_id`. Here the two sides **are** interchangeable, so you do need the `<`.
</details>
