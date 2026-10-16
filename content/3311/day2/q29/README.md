# Question 29 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★★☆

## Find me a free room


Find rooms free for a booking.

```
$ ./q29.py Mon 14 16 100
3 rooms free Mon 14-16 with capacity >= 100
CLB-7                Lecture Theatre       400
...
```

Arguments: **day**, **start hour**, **end hour**, **minimum capacity**.

Rules:

- a room is free if **no** class in it that day overlaps `start`–`end`
- line 1: `N rooms free DAY S-E with capacity >= C`
- then one line per free room: name left-aligned **width 20**, one space, type
  left-aligned **width 20**, one space, capacity right-aligned **width 5**
- ordered by capacity descending, then name
- if none are free: line 1 only (with `0`)
- an invalid day → `No such day: X`
- if `start >= end` → `Bad time range`
- non-numeric or wrong-count arguments → `USAGE`

> **Tests:** `not exists` with the overlap condition, argument validation, exact
> formatting. This is a full exam-question workload.

<details><summary>Hint 1</summary>

The core is `where m.capacity >= %s and not exists (select 1 from Classes c
where c.held_in = m.id and c.day_of_week::text = %s and <overlap>)`.
</details>

<details><summary>Hint 2</summary>

Validate the day against `enum_range(null::Weekday)` before querying, so a bad
day gives your message rather than a database error.
</details>
