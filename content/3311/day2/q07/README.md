# Question 07 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★☆☆☆

## Timetable for a course


Given a course code, print its timetable.

```
$ ./q07.py COMP1927
COMP1927
Mon 16-18  Lab Class  in K17-G12
...
$ ./q07.py COMP9999
No such course
```

Rules:

- line 1 is the course code exactly as given
- then one line per class: `DAY S-E  CTYPE  in ROOM`, with **two** spaces
  before `CTYPE` and before `in`
- ordered by day (week order), then start time, then room name
- a course with no classes → `No such course`
- wrong number of arguments → `USAGE`

> **Tests:** `%s` parameters, ordering in SQL, "no such X".

<details><summary>Hint</summary>

Run the query first; if `fetchall()` gives an empty list, that *is* the
"no such course" case — there is no separate Courses table to check against.
</details>
