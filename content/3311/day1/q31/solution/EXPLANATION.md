# Module 31

```python
try:
    cur.execute(query)
    rows = cur.fetchall()
except psycopg2.Error:
    db.rollback()
    print("query failed")
    return
```

### Why catch it ourselves

Without this `try`, a bad query reaches the driver's `except psycopg2.Error`,
which prints

```
DB error:  relation "nosuchtable" does not exist
```

— the wrong text. The spec asked for exactly `query failed`, so we catch it
where we control the message.

**That is the rule: write your own handler only when the spec dictates the
wording.**

### `db.rollback()`

Strictly unnecessary here, because we return immediately and the driver closes
the connection. But it is the habit worth building: in a script that carries on
after an error, forgetting it produces a cascade of baffling
`current transaction is aborted` messages for queries that are perfectly fine.

### Singular and plural

```python
print(f"{n} row" if n == 1 else f"{n} rows")
```

Specs really do check this. A conditional expression keeps it to one line.

### Turning a row into a line

```python
"|".join(str(v) for v in row)
```

`join` needs strings, and a row can hold `int`, `date` and `Decimal` values —
hence `str(v)` on each. A `None` becomes the text `None`, which for a
general-purpose tool is honest; in a question with a specified format you would
substitute something instead (module 30).

### Both statements inside the `try`

`execute` raises for a syntax error or a missing table, but some problems only
appear when you fetch. Covering both is safer.

One consequence worth noticing: an `insert` has no rows to fetch, so
`fetchall()` raises `ProgrammingError` — which is a `psycopg2.Error` — and this
script would report `query failed` for a perfectly good `insert`. That is fine
for the spec as written, but it shows that "failed" and "returned nothing" are
not the same thing.

### Worth trying

```bash
./q31.py 'select 1'
./q31.py 'select * from Rooms where id = 99999'    # 0 rows
./q31.py 'selct 1'                                  # typo -> query failed
./q31.py 'select name, capacity from Rooms limit 3'
```
