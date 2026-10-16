# Module 26

```python
cur.execute("""
    select   rtype, count(*), min(capacity), max(capacity)
    from     Rooms
    group by rtype
    order by rtype
""")
for (rtype, n, lo, hi) in cur.fetchall():
    print(f"{rtype}: {n} rooms, {lo}-{hi} seats")
```

### The SQL is module 08's, unchanged

That is the point. Everything you learned about `group by`, aggregates and
ordering works exactly the same from Python — the query is just a string now.

Which means: **get the query right in `psql` first**, then paste it into the
script. Debugging SQL through a Python traceback is much harder than debugging
it at the `classes=#` prompt.

### Four columns, four names

```python
for (rtype, n, lo, hi) in cur.fetchall():
```

The tuple has four elements because the `select` has four items. Position is
what matters, not the names — `rtype` here would still be the first column even
if you called it `x`.

### The enum arrives as a string

`rtype` is an enumerated type in the database, and psycopg2 hands it to Python
as an ordinary `str`. So `f"{rtype}: ..."` just works.

The ordering, though, is still the **database's** enum order — Lecture Theatre
before Tutorial Room — because `order by rtype` ran in SQL. If you sorted the
same values in Python you would get alphabetical order instead, which is a
different answer.

That is a good reason to sort in SQL: the database knows things about the data
that Python does not.

### `order by` belongs in the query

```python
sorted(rows)                       # three lines and the wrong order
order by rtype                     # one clause and the right one
```

### Worth trying

```python
cur.execute("select * from Rooms limit 1")
row = cur.fetchall()[0]
for v in row:
    print(type(v), v)
```

That prints the Python type of every column — a quick way to check what you are
actually holding.
