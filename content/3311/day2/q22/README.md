# Question 22 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★★☆

## How clash-prone is a course?


For a given course, how many of its students have a timetable clash **anywhere**
in their week (not necessarily involving this course)?

```
$ ./q22.py COMP1917
COMP1917: 743 students, 96 with a clash (12.9%)
```

Rules:

- one line exactly: `COURSE: N students, M with a clash (P%)`
- `P` is `M/N` as a percentage to **one** decimal place
- if the course has no students at all → `COURSE: no students`
- unknown course → `No such course`
- wrong argument count → `USAGE`

> **Tests:** putting the clash logic inside a bigger query, and guarding a
> division.

<details><summary>Hint 1</summary>

Two numbers from one query: the distinct students in the course, and how many
of those have a clash.
</details>

<details><summary>Hint 2</summary>

`count(distinct ...) filter (where ...)` works, but it is easier to write the
clash test as an `exists` subquery in the select list of a helper, or to fetch
the student ids and test them in one grouped query.
</details>

<details><summary>Hint 3</summary>

Guard the division: `pct = m / n * 100 if n else 0`.
</details>
