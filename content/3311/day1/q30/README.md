# Module 30 &nbsp;·&nbsp; Python + Psycopg2

## The cases where the answer is nothing


## LEARN FIRST

Most marks lost in exam Python questions are lost on the cases where the answer
is *nothing*. The spec always says what to print; your job is to notice **which
kind of nothing** you are in.

### The three empty cases

1. **`fetchone()` gave `None`** — the thing you looked up does not exist.
   Usually a specific message.
2. **The lookup succeeded, but a second query returned no rows** — the thing
   exists but has nothing attached. Usually a *different* message, or silence.
3. **A value inside a row is `None`** — the column was null (module 05).
   Printing it gives the word `None`, which is almost never wanted.

They have different causes and different messages, and **one query cannot tell
them apart**.

### Case 1 — it does not exist

```python
cur.execute("select name from Rooms where id = %s", [rid])
row = cur.fetchone()
if row is None:
    print(f"No such room: {rid}")
    return
name = row[0]
```

Always `is None`, never `if not row` — module 27's warning.

### Case 2 — it exists, but there is nothing to show

```python
cur.execute("select ... from Classes where held_in = %s", [rid])
rows = cur.fetchall()
if not rows:
    print(f"{name}: no classes")
    return
```

**This is why you need two queries.** If you only ran the second one, an unknown
room and an empty room would both give zero rows, and you could not produce the
two different messages the spec asks for.

> Whenever a spec has a "no such X" message **and** a "nothing to show" message,
> that is telling you to write two queries.

### Case 3 — a null inside a row

Three fixes, in order of preference:

```sql
-- 1. exclude them in SQL, if they do not belong in the answer
where secs is not null

-- 2. substitute in SQL
coalesce(x::text, 'unknown')
```

```python
# 3. substitute in Python
print(f"{name}: {x if x is not None else 'unknown'}")
```

Doing it in SQL is usually cleaner. Doing it in Python is fine when the
replacement depends on other Python logic.

### Aggregates never give you case 1

```python
cur.execute("select count(*), max(capacity) from Rooms where rtype::text = %s",
            ['Nonsense'])
(n, biggest) = cur.fetchone()      # (0, None)
```

An aggregate always returns exactly one row. So `row is None` can never fire —
the meaningful test is `n == 0`. Modules 20 and 27 met this; it decides which
branch you write.

### The crash to recognise

```
TypeError: 'NoneType' object is not subscriptable
```

means `cur.fetchone()[0]` with no rows. It always means a missing `is None`.

---

## THE TASK

Report on one room, by id.

```
$ ./q30.py 1003
MECH-G15 (Computer Lab, 30 seats)
  23 classes, 35 hours
  busiest day: Tue with 7 classes
$ ./q30.py 99999
No such room: 99999
```

Rules:

- unknown id → `No such room: ID` and nothing else
- line 1: `NAME (TYPE, N seats)`
- line 2: two spaces, then `C classes, H hours`
- line 3: two spaces, then `busiest day: DAY with N classes`
- if the room has **no classes**, print line 1 and then just
  `  no classes` — and nothing else
- non-numeric or wrong-count arguments → `USAGE`

## Hints

<details><summary>Hint 1</summary>

Three queries: the room (case 1), the totals (an aggregate — case 2 is decided
by whether the count is 0), and the busiest day.
</details>

<details><summary>Hint 2</summary>

The totals query is an aggregate, so `fetchone()` is never `None`. Test the
count.
</details>

<details><summary>Hint 3</summary>

Busiest day: `group by day_of_week order by count(*) desc, day_of_week limit 1`
— the tie-break makes `limit 1` safe (module 27).
</details>
