# Module 26 &nbsp;·&nbsp; Python + Psycopg2

## Running a query from Python


## LEARN FIRST

### The four steps

```python
db  = psycopg2.connect(dbname="classes")   # 1. open a connection
cur = db.cursor()                          # 2. make a cursor
cur.execute("select name from Rooms")      # 3. run some SQL
rows = cur.fetchall()                      # 4. collect the results
```

- A **connection** is your session with the database — the same thing `psql`
  opens when you start it.
- A **cursor** is what you actually run queries through. Think of it as a place
  for one query and its results to live. You can have several.

In the exam the driver already does step 1. Your `main()` does the rest, using
the global `db`.

### What comes back

`fetchall()` gives you a **list of tuples**: one tuple per row, one element per
selected column, in the order you selected them.

```python
cur.execute("select id, name from Rooms order by id")
for row in cur.fetchall():
    print(row)
```

```
(52, 'EE-417')
(208, 'GOLDST-G01')
```

Unpack them the way you would unpack any tuple:

```python
for (rid, name) in cur.fetchall():
    print(f"{rid}: {name}")
```

The names you choose have nothing to do with the column names — **position** is
what matters. Change the order of the columns in the `select` and you must
change the unpacking to match.

### The types are already right

psycopg2 converts as it goes:

| SQL type | arrives as |
|---|---|
| `integer` | `int` |
| `text`, `char(n)` | `str` |
| `date` | `datetime.date` |
| `numeric` | `Decimal` |
| an enum (`rtype`, `ctype`, `day_of_week`) | `str` |

You do **not** need to convert anything yourself. A `date` prints as
`2005-02-11` with no effort.

### Multi-line SQL

Use a triple-quoted string. Newlines and indentation mean nothing to SQL, so lay
the query out to be readable — which matters once it is twelve lines long:

```python
query = """
    select   c.course, c.day_of_week, r.name
    from     Classes c join Rooms r on c.held_in = r.id
    where    r.rtype = 'Computer Lab'
    order by c.day_of_week, c.start_time
"""
cur.execute(query)
```

Everything you learned in modules 01–18 goes in there unchanged.

### The whole thing

```python
def main():
    cur = db.cursor()
    cur.execute("select name, capacity from Rooms order by name")
    for (name, cap) in cur.fetchall():
        print(f"{name} seats {cap}")
```

Note `db` is the global the driver created — you use it inside `main()` without
passing it in.

### Sort in SQL, not in Python

You could fetch everything and `sorted()` it. Don't. The database sorts far more
efficiently, and `order by` is one clause against three lines of Python.

**If SQL can do it, let SQL do it.**

---

## THE TASK

Print every room type with a count, one per line:

```
$ ./q26.py
Lecture Theatre: 18 rooms, 30-400 seats
Tutorial Room: 99 rooms, 20-185 seats
...
```

For each room type, in the order the enum defines (module 06): the type, how
many rooms, and the smallest and largest capacity, written `MIN-MAX`.

Takes no arguments; if any are given, print `USAGE` and stop.

## Hints

<details><summary>Hint 1</summary>

This is module 07's aggregate query with module 08's `group by` — you have
written it before. The Python part is one loop.
</details>

<details><summary>Hint 2</summary>

Put the `order by` in the SQL. Ordering by the enum gives the declaration order
the task asks for.
</details>
