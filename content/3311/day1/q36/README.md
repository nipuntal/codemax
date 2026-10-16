# Module 36 &nbsp;·&nbsp; Python + Psycopg2

## Which side should do the work?


## LEARN FIRST

You now have two places to compute things. Choosing well is most of what makes
a script good.

### Do it in SQL

| task | why |
|---|---|
| filtering | less data crosses the connection; the database can use indexes |
| sorting | one clause instead of a comparator, and the database knows about enums |
| counting, summing, averaging | one row comes back instead of thousands |
| joining related data | that is what a database is for |
| picking the largest, per group | modules 13 and 14 |

### Do it in Python

| task | why |
|---|---|
| formatting output | SQL's string handling is clumsy, and this is where the marks are |
| branching on the arguments | building the query itself (module 35) |
| grouping rows into sections | module 32 |
| anything needing state across rows | SQL has no memory between rows |
| talking to the user | obviously |

### The test

> **Would doing this in SQL reduce the number of rows crossing the connection?**
> If yes, do it in SQL.

Counting 18,917 enrolments in Python means sending 18,917 rows. Counting them in
SQL means sending one number.

### Where dicts earn their place

A dict is right when you need to **look something up repeatedly**, and the
alternative is re-querying:

```python
cur.execute("select id, name from Rooms")
room_name = dict(cur.fetchall())        # {52: 'EE-417', 208: 'GOLDST-G01', ...}
```

`dict(list_of_pairs)` builds it in one line — a nice psycopg2 idiom, since
`fetchall()` already gives you pairs when you select two columns.

Now `room_name[1003]` is free, instead of a query per lookup. This is a
legitimate way to avoid module 32's N+1 problem when a join would be awkward.

### Where sets earn their place

Membership and difference:

```python
cur.execute("select id from Rooms where rtype = 'Computer Lab'")
labs = {r[0] for r in cur.fetchall()}

cur.execute("select distinct held_in from Classes where course = %s", ['COMP1927'])
used = {r[0] for r in cur.fetchall()}

print(used - labs)      # rooms this course uses that are not labs
```

Readable, and two queries. The pure-SQL version (module 16) is one query and no
Python.

**Prefer SQL when the question is testing SQL** — but if you cannot get the
`not exists` right under pressure, a working Python answer beats a broken SQL
one.

### `defaultdict` for grouping

```python
from collections import defaultdict
by_type = defaultdict(list)
cur.execute("""select r.rtype, r.name from Rooms r order by r.rtype, r.name""")
for (rtype, name) in cur.fetchall():
    by_type[rtype].append(name)
```

One query, then group in Python. Sensible when you want the members **listed**,
because SQL would have to glue them into one string and you would only have to
split them again.

### The honest summary

For the exam: **push filtering, joining and aggregating into SQL; keep
formatting and control flow in Python.** When you genuinely cannot express
something in SQL in the time you have, do it in Python and move on. A correct
slow answer scores; an elegant broken one does not.

---

## THE TASK

For each room type, list the rooms that are **never used before 12** — that is,
no class in them starts earlier than 12.

```
$ ./q36.py
Lecture Theatre: BIOM-A, BIOM-B, CLB-7, D23-203, D23-304, EE-G25, F13-, ...
Tutorial Room: AGSM-G04, ASB-219, CE-G1, CHEMSC-M10, CHEMSC-M17, CHEMS, ...
```

Rules:

- one line per room type **that has at least one such room**, in the enum's
  order
- `TYPE: ` then the room names, comma-space separated, in name order
- use **exactly one `execute`**, and do the grouping into lines in Python
- takes no arguments

## Hints

<details><summary>Hint 1</summary>

"No class starts before 12" is `not exists (...)` — module 14.
</details>

<details><summary>Hint 2</summary>

Order the query by `rtype, name` so the rows arrive ready to group.
</details>

<details><summary>Hint 3</summary>

`defaultdict(list)`, then `", ".join(names)`.
</details>
