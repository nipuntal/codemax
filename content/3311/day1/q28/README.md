# Module 28 &nbsp;·&nbsp; Python + Psycopg2

## Putting a value into a query, safely


## LEARN FIRST

Almost every real script builds a query around something the user supplied. This
is where programs break — accidentally and deliberately.

### The wrong ways

```python
room = sys.argv[1]

qry = f"select * from Rooms where name = '{room}'"       # NO
qry = "select * from Rooms where name = '" + room + "'"  # NO
qry = "select * from Rooms where name = '%s'" % room     # NO
```

All three glue text straight into SQL. Two things go wrong.

**It breaks on ordinary data.** A value containing an apostrophe — `O'Brien` —
produces

```sql
select * from Rooms where name = 'O'Brien'
```

which is a syntax error, because that apostrophe ends the string early.

**It is a security hole.** If someone passes

```
'; drop table Attends; --
```

your query becomes two statements, the second of which deletes a table. That is
called **SQL injection**, and it is how databases get destroyed by accident.

### The right way

Leave a `%s` placeholder and hand the values to `execute` **separately**:

```python
cur.execute("select * from Rooms where name = %s", [room])
```

psycopg2 quotes and escapes the value properly. The apostrophe is handled, and
the injection attempt just becomes a search for a room with a very odd name —
which finds nothing, which is correct.

### The rules for `%s`

```python
cur.execute("select * from Classes where held_in = %s and start_time > %s",
            [1003, 12])
```

- **Always `%s`**, whatever the type. Not `%d`, not `%f` — even for numbers.
- The second argument is a **list** (or tuple), one entry per placeholder, in
  order.
- **No quotes around `%s` in the SQL.** Writing `'%s'` breaks it — psycopg2 adds
  the quotes itself.

For a single value, a list of one:

```python
cur.execute("select * from Rooms where name = %s", [room])
cur.execute("select * from Rooms where name = %s", (room,))   # tuple also fine
```

That trailing comma matters: `(room)` is just `room` in brackets, not a tuple.

### Patterns for `like` and `ilike`

Build the `%` wildcards **in Python**, then pass the whole thing as a value:

```python
pattern = "%" + word + "%"
cur.execute("select name from Rooms where name ilike %s", [pattern])
```

Do not try to write the wildcards into the SQL around a `%s` — you will end up
fighting psycopg2's own use of `%` and lose ten minutes.

### What `%s` can and cannot do

`%s` stands in for a **value**. It cannot stand in for a table name, a column
name, or a keyword:

```python
cur.execute("select * from %s", [table])                  # WRONG
cur.execute("select * from Rooms order by %s", [col])     # WRONG
```

That is exactly the same restriction module 23 met in PLpgSQL, where varying a
**name** needed `execute` and `quote_ident`. Values are parameters; names are
not.

### Enums need care

Module 00 noted that comparing an invalid string to an enum column **raises an
error** rather than returning nothing:

```python
cur.execute("select * from Rooms where rtype = %s", ['Broom Cupboard'])
# InvalidTextRepresentation: invalid input value for enum roomtype
```

If the value came from the user and might be wrong, compare against the column
cast to text instead:

```python
cur.execute("select * from Classes where day_of_week::text = %s", [day])
```

Then a nonsense day quietly finds nothing, which is usually what you want.

### Seeing what will actually run

```python
print(cur.mogrify("select * from Rooms where name = %s", [room]))
```

`mogrify` returns the finished SQL **without running it**. Excellent for
debugging — paste the result into `psql` and see what happens.

---

## THE TASK

Given a course code, print its timetable.

```
$ ./q28.py COMP1927
COMP1927
Wed 13-15 Lecture in D23-304
...
$ ./q28.py COMP9999
No such course
```

Rules:

- line 1 is the course code exactly as given
- then one line per class: `DAY S-E CTYPE in ROOM`
- ordered by day (week order), then start time, then room name
- a course with no classes at all → `No such course` and nothing else
- wrong number of arguments → `USAGE`

## Hints

<details><summary>Hint 1</summary>

There is no `Courses` table — a course exists only because a class mentions it.
So "no such course" is simply "the query returned no rows" (module 22 met the
same thing).
</details>

<details><summary>Hint 2</summary>

`rows = cur.fetchall()` then `if not rows:` — safe, because `rows` is a list
(module 27).
</details>

<details><summary>Hint 3</summary>

Pass the course code with `%s`. It is a value, so this is exactly what
parameters are for.
</details>
