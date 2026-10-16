# Question 14 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★☆☆

## One student's week


Given a student's **exact** name, print their weekly timetable.

```
$ ./q14.py 'Vikas Karamitos'
Vikas Karamitos (5345720)
Mon 13-14  COMP1917 Tutorial     in RC-3082
...
```

Rules:

- if no student has that name → `No such student`
- if **more than one** student has that name → `Ambiguous: N students named NAME`
  and nothing else
- otherwise line 1 is `NAME (ID)`, then one line per class:
  `DAY S-E  COURSE CTYPE  in ROOM` with the course-and-type field left-aligned
  in **width 22**
- ordered by day, then start time, then course
- a student enrolled in nothing prints just the `NAME (ID)` line
- wrong argument count → `USAGE`

> **This is the shape of exam questions 4 and 5.** Note that 65 names in this
> database are shared by two or three students.

<details><summary>Hint 1</summary>

Fetch **all** matching students, then branch on `len(rows)`: 0, 1, or more.
</details>

<details><summary>Hint 2</summary>

`f"{course + ' ' + ctype:<22}"` — build the combined field, then pad it.
</details>
