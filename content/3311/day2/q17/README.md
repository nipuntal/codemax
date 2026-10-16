# Question 17 &nbsp;·&nbsp; Python + Psycopg2 &nbsp;·&nbsp; ★★★☆☆

## Find a room, then show its day


Two arguments: **part of a room name** (case-insensitive) and a **day**.

```
$ ./q17.py BURROWS Mon
BURROWS-TH (Lecture Theatre, capacity 400)
...
$ ./q17.py G12 Tue
Room is ambiguous
$ ./q17.py ZZZZ Mon
No matching room
```

Rules:

- match rooms whose name **contains** the given text, case-insensitively
- no match → `No matching room`; more than one → `Room is ambiguous`
- otherwise line 1 is `NAME (TYPE, capacity N)`, then one line per class that
  day: `  S-E COURSE CTYPE`, in start-time order
- if the room has nothing on that day, print line 1 then `  nothing scheduled`
- wrong argument count → `USAGE`

> **This is the shape of exam question 5** — partial match, then a three-way
> branch, then formatted detail.

<details><summary>Hint 1</summary>

Build the `%pattern%` **in Python** and pass it as a value: `'%' + s + '%'`.
</details>

<details><summary>Hint 2</summary>

Don't compare an arbitrary string against the enum column — cast it:
`c.day_of_week::text = %s`.
</details>
