# Module 27 &nbsp;·&nbsp; Python + Psycopg2

## One row, many rows, or none


## LEARN FIRST

`fetchall()` is not the only way to get results out, and often not the best.

### `fetchone()` — one row, or `None`

```python
cur.execute("select count(*) from Rooms")
row = cur.fetchone()
print(row[0])          # 128
```

**It returns a tuple even when you selected one column.** `row` is `(128,)`, so
you need `row[0]`. Forgetting that prints `(128,)` — brackets, comma and all —
which is a very common way to fail a test.

Two tidy ways to unpack:

```python
n = cur.fetchone()[0]
(n,) = cur.fetchone()      # the trailing comma is what makes it a tuple
```

### When there are no rows, you get `None`

Not an empty tuple. **`None`.**

```python
cur.execute("select name from Rooms where id = %s", [99999])
row = cur.fetchone()
if row is None:
    print("No such room")
    return
name = row[0]
```

Writing `cur.fetchone()[0]` without that check raises

```
TypeError: 'NoneType' object is not subscriptable
```

which is the single most common crash in this course's Python questions. It
always means a missing `is None`.

Use **`is None`**, not `if not row`: a genuine row of `(0,)` is also falsy in
Python, and `is None` says exactly what you mean.

### `fetchone()` advances

```python
cur.execute("select name from Rooms order by id")
print(cur.fetchone())    # ('EE-417',)
print(cur.fetchone())    # ('GOLDST-G01',)   -- the NEXT row
```

Each call moves on. When the rows run out you get `None`.

### An aggregate always gives you a row

This catches people, and it is worth being deliberate about:

```python
cur.execute("select count(*), max(capacity) from Rooms where rtype = %s",
            ['Broom Cupboard'])
(n, biggest) = cur.fetchone()      # (0, None)  -- NOT None
```

An aggregate over **no rows** still returns one row, holding `0` for `count` and
`None` for `max`. So `fetchone()` is never `None` here, and checking for it
would be dead code. The meaningful test is `n == 0`.

That is the same asymmetry modules 12 and 20 met — `count` of nothing is 0,
`sum`/`max`/`min` of nothing is null.

### `fetchall()` — a list

```python
rows = cur.fetchall()
if len(rows) == 0:
    print("nothing found")
```

A list is safe to test with `if not rows:` — an empty list is falsy and a
non-empty one never is. That is different from `fetchone()`, where you must use
`is None`.

### Iterating the cursor directly

```python
cur.execute("select name from Rooms order by name")
for (name,) in cur:
    print(name)
```

You do not have to call `fetchall()` — the cursor is iterable, and this streams
rows instead of building one big list.

Note `for (name,) in cur:` — the trailing comma unpacks a one-element tuple.
Without it, `name` would be the tuple itself.

### `cur.rowcount`

After a `select`, this tells you how many rows matched:

```python
cur.execute("select * from Classes where held_in = %s", [1003])
if cur.rowcount == 0:
    print("nothing in that room")
```

### Which to use when

| situation | use |
|---|---|
| exactly one row expected | `fetchone()`, then check for `None` |
| a handful of rows | `fetchall()` |
| many rows, printed as you go | iterate the cursor |

---

## THE TASK

Print a one-screen summary of the database:

```
$ ./q27.py
7784 students, 128 rooms, 514 classes
18917 enrolments across 83 courses
busiest room: MECH-G15 with 23 classes
```

- line 1: the three counts
- line 2: the number of enrolments and the number of **distinct** courses
- line 3: the name of the room with the most classes, and how many.
  If several rooms tie for the most, name the one that comes **first
  alphabetically**.

Takes no arguments.

## Hints

<details><summary>Hint 1</summary>

Lines 1 and 2 can each be one query with several counts — module 00's task did
exactly this.
</details>

<details><summary>Hint 2</summary>

Line 3 is a `group by` with an `order by count desc`. Since the task tells you
how to break a tie, you can safely take just the first row.
</details>

<details><summary>Hint 3</summary>

`order by count(*) desc, r.name limit 1`, then `fetchone()`.
</details>
