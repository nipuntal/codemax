# Question 34 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★★★

## Print a room's week as a grid


Print a room's weekly timetable as a **grid**: hours 9–20 down the side, days
across the top.

```
$ ./q34.py MECH-G15
MECH-G15 (Computer Lab, capacity 30)
     Mon      Tue      Wed      Thu      Fri
 9   .        COMP1000 .        COMP1000 COMP1000
10   .        COMP1000 .        COMP1000 COMP1000
...
```

Rules, exactly:

- the room is found by **exact** name; no match → `No such room: NAME`;
  more than one is impossible (names are unique) so no ambiguity branch
- line 1: `NAME (TYPE, capacity N)`
- line 2: five spaces, then each day left-aligned in **width 9**
- then one line per hour from **9 to 20** inclusive:
  the hour right-aligned in **width 2**, then three spaces, then for each day
  the course code left-aligned in width 9, or `.` padded to width 9 if the room
  is free that hour
- **trailing spaces must be stripped** from every grid line
- an hour is occupied by a class if `start_time <= hour < end_time`
- if two classes occupy the same room-hour (this data has such cases), show the
  one whose course code sorts first
- wrong argument count → `USAGE`

> **Tests:** building a 2-D layout in Python from flat rows. Formatting is
> most of the marks here — exactly like the real thing.

<details><summary>Hint 1</summary>

Fetch `(day, hour, course)` triples using
`generate_series(start_time, end_time - 1)` as in question 25, ordered so that
the first course code per cell wins.
</details>

<details><summary>Hint 2</summary>

`grid = {}` keyed by `(day, hour)`; use `setdefault` so the first value wins.
</details>

<details><summary>Hint 3</summary>

`"".join(f"{cell:<9}" for day in DAYS).rstrip()`
</details>
