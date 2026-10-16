# Module 39 &nbsp;·&nbsp; Python + Psycopg2

## Exam-shaped: a room's day, hour by hour


## THIS IS EXAM-SHAPED

Around 9 marks, 30 minutes. Harder than module 38 — it needs you to think about
the data, not just fetch it.

---

## THE TASK

Given **part of a room's name** and a day, show that room's day hour by hour.

```
$ ./q39.py BURROWS Mon
BURROWS-TH (Lecture Theatre, 400 seats) on Mon
09 free
10 free
11 free
...
booked 1 of 12 hours
```

### Rules

Two arguments: part of a room name (matched **ignoring case**) and a day.

- no room matches → `No matching room`
- more than one matches → `Ambiguous: N rooms match TEXT`
- an invalid day → `No such day: DAY`  (check the room first)
- otherwise line 1 is `NAME (TYPE, N seats) on DAY`
- then one line for **every hour from 9 to 20 inclusive**:
  - the hour as **two digits**, a space, then either the course and class type,
    or the word `free`
  - a class running 9–11 occupies hours **9 and 10**, not 11
  - if two classes cover the same hour, show the one whose course code sorts
    first
- a final line: `booked H of 12 hours`
- wrong argument count → `USAGE`

## How to attack it

<details><summary>Step 1 — the room, with three outcomes</summary>

`name ilike %s` with a `'%' + text + '%'` pattern built in Python (module 28),
then branch on `len(rows)` as in module 38.
</details>

<details><summary>Step 2 — the day</summary>

Validate it **after** the room, because the spec says so. Compare against
`day_of_week::text` so a nonsense day cannot raise (modules 29, 35) — or check
it against a list first.
</details>

<details><summary>Step 3 — which hours are busy</summary>

Fetch the day's classes, then mark the hours they cover:

```python
busy = {}
for (st, en, course, ctype) in rows:
    for h in range(st, en):
        busy.setdefault(h, f"{course} {ctype}")
```

`range(st, en)` — **not** `en + 1`. A 9–11 class covers 9 and 10.

`setdefault` writes only if the hour is not already taken, so with the query
ordered by course code the alphabetically-first class wins a contested hour.
</details>

<details><summary>Step 4 — print all twelve hours</summary>

Loop `for h in range(9, 21)` and look each one up. Hours 9 to 20 inclusive is
**12** hours — you are counting gaps between 9 and 21, not the numbers 9…21.
</details>
