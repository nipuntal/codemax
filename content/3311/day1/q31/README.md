# Module 31 &nbsp;·&nbsp; Python + Psycopg2

## When something goes wrong


## LEARN FIRST

### What the driver actually does

You have been given this since module 25. Now read it properly:

```python
try:
    db = psycopg2.connect(dbname="classes")
    main()
except psycopg2.Error as err:
    print("DB error: ", err)
except Exception as err:
    print("Internal Error: ", err)
    raise err
finally:
    if db is not None:
        db.close()
```

- **`except psycopg2.Error`** catches anything the *database* complains about —
  a bad query, a broken constraint, a lost connection. It prints a message and
  stops quietly.
- **`except Exception`** catches *your* bugs — a `TypeError`, a `ValueError`. It
  prints, then **re-raises**, so you get the traceback and can fix it.
- **`finally`** runs whatever happened, so the connection is always closed.

**Order matters.** `psycopg2.Error` is a kind of `Exception`, so it must be
caught **first**. Swap the two and every database problem is reported as an
internal one.

### The errors you will actually hit

| message | cause |
|---|---|
| `column "x" does not exist` | a typo, or a missing table alias |
| `relation "room" does not exist` | table name wrong — it is `Rooms` |
| `syntax error at or near "..."` | look just **before** the quoted text |
| `'NoneType' object is not subscriptable` | `fetchone()[0]` with no rows (module 27) |
| `not all arguments converted` | wrong number of `%s` for your list (module 28) |
| `invalid input value for enum ...` | a bad value compared to an enum (modules 00, 29) |

### Catching a database error yourself

Sometimes the spec dictates the exact wording, so you must catch it rather than
let the driver print `DB error: …`:

```python
try:
    cur.execute(query)
    rows = cur.fetchall()
except psycopg2.Error:
    db.rollback()
    print("query failed")
    return
```

**Add your own handler only when the spec tells you what to print.** Otherwise
the driver's is fine, and time spent on error handling nobody tests is time not
spent on the query.

### `rollback()` — the one you must not forget

After **any** database error, the connection is left in a broken state. Every
later query fails with:

```
current transaction is aborted, commands ignored until end of transaction block
```

That message means *"something failed earlier and you did not roll back"* — and
it is confusing the first time, because the query it complains about is
perfectly good.

`db.rollback()` puts the connection back in a usable state.

> **Theory pointer.** A **transaction** is a unit of work that either happens
> completely or not at all. `rollback` abandons it; `commit` makes it permanent.
> Theory modules 38–40 cover this. The short version: the database groups your
> statements so that a failure halfway through cannot leave things half-done —
> which is also why module 23's `raise exception` undid everything.

### The debugging technique that beats all others

```python
print(cur.mogrify(query, args))
```

Then paste that SQL into `psql` and run it there. Nine times out of ten the bug
is in the SQL, and `psql` gives a far better error message — with a `^` pointing
at the problem — than a Python traceback does.

---

## THE TASK

Write a tiny version of `psql`: run whatever SQL you are given, and report on
it.

```
$ ./q31.py 'select count(*) from Rooms'
1 row
128
$ ./q31.py 'select name from Facilities order by name limit 2'
2 rows
Blackboard
Document camera
$ ./q31.py 'select * from nosuchtable'
query failed
$ ./q31.py
Usage: ./q31.py 'SQL query'
```

Rules:

- run the SQL, then print `N row` or `N rows` — **singular** for exactly 1
- then one line per row, with the values joined by `|`
- if the query fails for any database reason, print exactly `query failed` and
  nothing else
- wrong argument count → `USAGE`

## Hints

<details><summary>Hint 1</summary>

Wrap `execute` **and** `fetchall` in your own
`try: ... except psycopg2.Error:`. Some problems only surface on the fetch.
</details>

<details><summary>Hint 2</summary>

`"|".join(str(v) for v in row)` turns a tuple into a line — `join` needs
strings, and a row holds numbers and dates too.
</details>

<details><summary>Hint 3</summary>

Do not forget `db.rollback()` in the except branch — it is the habit that saves
you in longer scripts.
</details>
