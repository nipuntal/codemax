# Question 20 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★☆☆

## A course, day by day


Print a course's week, **every weekday listed**, whether or not anything is on.

```
$ ./q20.py COMP1927
COMP1927
Mon
- nothing on
Tue
- nothing on
Wed
- 13-15 Lecture, D23-304, 30 students
...
```

Rules:

- line 1: the course code
- then, for each of `Mon Tue Wed Thu Fri` **in that order**, the day name on its
  own line, followed by either
  - one line per class: `- S-E CTYPE, ROOM, N students`, in start-time order,
    then room name
  - or the single line `- nothing on`
- unknown course → `No such course` and nothing else
- wrong argument count → `USAGE`

> **This is the shape of exam question 5's grouped output**, which required
> `- no participants in this age group` for empty groups.

<details><summary>Hint 1</summary>

Don't run five queries. Fetch all the classes once, then group them in Python
with a dict keyed by day.
</details>

<details><summary>Hint 2</summary>

`from collections import defaultdict` — and iterate the **fixed** day list, not
the dict's keys, or empty days disappear.
</details>
