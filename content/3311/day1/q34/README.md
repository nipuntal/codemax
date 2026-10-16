# Module 34 &nbsp;·&nbsp; Python + Psycopg2

## Changing the data, and saving the change


## LEARN FIRST

Everything so far has only **read**. Writing needs one extra step that people
forget constantly.

### The step people forget

```python
cur.execute("insert into Facilities (id, name) values (%s, %s)", [99, 'Kettle'])
db.commit()          # <-- WITHOUT THIS, NOTHING IS SAVED
```

psycopg2 starts a **transaction** for you automatically. Your changes are real
inside your own connection, but invisible to everyone else and **thrown away
when you disconnect** — until you `commit()`.

The symptom: your script prints all the right messages, then you look in `psql`
and nothing has changed.

> **Theory pointer.** Module 31 introduced transactions. The behaviour here is
> the "A" and "D" of ACID — **atomicity** (all of it happens or none of it) and
> **durability** (once committed, it survives). Theory module 38 covers the full
> set. `commit` is you saying "this unit of work is complete".

### `rollback()`

```python
db.rollback()        # throw away everything since the last commit
```

Use it when something went wrong and you want the database left alone. And
remember module 31: **after any database error you must roll back**, or every
later query fails.

### The three statements

```python
cur.execute("insert into Facilities (id, name) values (%s, %s)", [99, 'Kettle'])
cur.execute("update Facilities set name = %s where id = %s", ['Urn', 99])
cur.execute("delete from Facilities where id = %s", [99])
```

All take `%s` the same way (module 28). **Never build these by gluing text** —
an apostrophe in a name breaks an `insert` just as surely as it breaks a
`select`, and the consequences are worse.

### `cur.rowcount` — did anything actually change?

```python
cur.execute("update Rooms set capacity = %s where id = %s", [40, rid])
if cur.rowcount == 0:
    print("no such room")
    db.rollback()
    return
db.commit()
```

After an `update` or `delete`, `rowcount` is how many rows changed. Zero means
the `where` matched nothing — usually worth reporting rather than silently
claiming success.

### The shape of a safe change

```python
try:
    cur.execute(...)
    if cur.rowcount == 0:
        print("nothing to change")
        db.rollback()
        return
    db.commit()
    print("done")
except psycopg2.Error:
    db.rollback()
    print("update failed")
```

- **`commit()` only on success**
- **`rollback()` on any error**

### The database will refuse bad data — let it

```python
cur.execute("insert into Classes (id, course, ctype, held_in, day_of_week,"
            " start_time, end_time) values (%s,%s,%s,%s,%s,%s,%s)",
            [999999, 'COMP9999', 'Lecture', 99999, 'Mon', 9, 11])
```

That fails, because `held_in` must be a real room — the **foreign key** from
module 00. You get a `ForeignKeyViolation`, which is a `psycopg2.Error`.

Similarly, inserting a duplicate `id` gives a `UniqueViolation`, and a
`start_time` of 25 breaks a `check` constraint.

**This is the constraints doing their job.** Catch the error and report
sensibly rather than trying to re-check everything in Python first:

```python
except psycopg2.errors.UniqueViolation:
    print("already exists")
    db.rollback()
```

---

## THE TASK

Record a new facility in a room.

```
$ ./q34.py 1003 'Whiteboard' 2
added Whiteboard x2 to MECH-G15
$ ./q34.py 1003 'Whiteboard' 2
MECH-G15 already has Whiteboard
$ ./q34.py 99999 'Whiteboard' 1
no such room: 99999
$ ./q34.py 1003 'Teleporter' 1
no such facility: Teleporter
```

Given a room id, a facility name and a count:

- unknown room id → `no such room: ID`
- unknown facility name (exact match) → `no such facility: NAME`
- the room already has that facility → `ROOM already has FACILITY`
- otherwise insert the row and print `added FACILITY xN to ROOM`
- **commit only when the insert succeeded**
- non-numeric or wrong-count arguments → `USAGE`

*(The check reloads the database first, so you can run this repeatedly.)*

## Hints

<details><summary>Hint 1</summary>

Three lookups before the insert: the room, the facility, and whether the pairing
already exists. Each has its own message.
</details>

<details><summary>Hint 2</summary>

`Has` has primary key `(room_id, facility_id)` — module 00 — so a duplicate
would be refused by the database anyway. Checking first lets you print the
message the spec asked for.
</details>

<details><summary>Hint 3</summary>

Do not forget `db.commit()`. Without it the second test will not see the first
insert, and the check will fail.
</details>
