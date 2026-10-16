# Question 33 &nbsp;·&nbsp; PLpgSQL &nbsp;·&nbsp; ★★★★★

## Fix this student's timetable


For a student with clashes, suggest a way out: for each clashing class, is there
**another offering** of the same course and class type that would not clash with
anything else in their timetable?

```
create or replace function q33(_student integer) returns setof text
```

- no such student → `No such student`
- no clashes → `No clashes`
- otherwise, for each class involved in a clash, in day/start order:
  - `COURSE CTYPE DAY S-E clashes` then
  - one indented line per usable alternative:
    `  -> move to DAY S-E in ROOM`, in day/start/room order
  - or `  -> no alternative offering` if none exists

An alternative is usable when it is a different class, of the **same course and
class type**, and it overlaps **none** of the student's other classes (all of
them except the one being moved).

> **Tests:** everything at once — a self-join, a nested `not exists` with an
> exclusion, and a two-level `setof text` report.

<details><summary>Hint 1</summary>

First collect the distinct classes that are involved in **any** clash. A class
is involved if it clashes with at least one other class of this student.
</details>

<details><summary>Hint 2</summary>

For each such class `k`, an alternative `alt` is usable when
`not exists (a class j the student attends, j <> k, that overlaps alt)`.
</details>
