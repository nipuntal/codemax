# Module 32 &nbsp;·&nbsp; Python + Psycopg2

## One good query beats a hundred small ones


## LEARN FIRST

The most common way to write a **slow** database program is to run one query per
row of another query's results.

### The pattern to avoid

```python
cur1.execute("select id, name from Rooms")
for (rid, name) in cur1.fetchall():
    cur2.execute("select count(*) from Classes where held_in = %s", [rid])
    n = cur2.fetchone()[0]
    print(f"{name}: {n}")
```

129 queries for 128 rooms. With ten thousand rooms it is ten thousand and one,
each one a separate round trip to the database.

This is common enough to have a name — the **N+1 problem** — and it is the
single biggest performance mistake in database programming.

### The fix

```python
cur.execute("""
    select   r.name, count(c.id)
    from     Rooms r left join Classes c on c.held_in = r.id
    group by r.id, r.name
    order by r.name
""")
for (name, n) in cur.fetchall():
    print(f"{name}: {n}")
```

**One** query. The database does the grouping, using whatever indexes it has,
and sends back 128 rows instead of answering 128 separate questions.

Note the `left join` and `count(c.id)` so a room with no classes reports 0 —
module 12, still applying.

### The rule

> If your loop body contains an `execute`, ask whether a join or a `group by`
> would remove it.

Usually it would. The cases where it genuinely cannot:

- the second query's **shape** depends on the first's result — a different table
  name, say (module 23's territory)
- you need to do something non-SQL between the two
- you are inserting rows derived from a query, one at a time

### Two cursors, when you really do need a loop

If you must run a query inside a loop over another query, use **two cursors** —
otherwise the second `execute` destroys the results you are still walking:

```python
cur1 = db.cursor()
cur2 = db.cursor()
cur1.execute("select id, name from Rooms")
for (rid, name) in cur1.fetchall():
    cur2.execute("...", [rid])
```

Calling `fetchall()` first, as above, also sidesteps it — the list is a snapshot
and no longer depends on the cursor.

### Counting in Python instead

Sometimes it is easier to fetch raw rows and total them up:

```python
from collections import defaultdict
counts = defaultdict(int)
cur.execute("select held_in from Classes")
for (rid,) in cur.fetchall():
    counts[rid] += 1
```

This is **one** query, so it has no N+1 problem — but it drags 514 rows across
the connection to work out 128 numbers. `group by` would send 128.

Rules of thumb:

- **counting, summing, averaging, sorting, filtering, joining → SQL**
- **formatting, branching, string building → Python**

The dict version earns its place when you need the raw rows for something else
anyway.

---

## THE TASK

Print how many classes each **course** runs, grouped by how many rooms it uses.

```
$ ./q32.py
1 room
- COMP3121: 1 classes
- COMP9020: 1 classes
...
```

Rules:

- work out, for each course, how many classes it runs and how many **distinct**
  rooms it uses
- group the courses by that room count, ascending
- for each room count, print `N room` (singular for 1) or `N rooms`, then one
  line per course: `- COURSE: C classes`, in course-code order
- **use exactly one `execute`** — do the grouping into sections in Python
- takes no arguments

## Hints

<details><summary>Hint 1</summary>

The query gives you `(nrooms, course, nclasses)` — one row per course. Modules
08 and 09 built exactly this.
</details>

<details><summary>Hint 2</summary>

Order the query by `nrooms, course` so the rows arrive already in the right
order, then just watch for the room count changing.
</details>

<details><summary>Hint 3</summary>

Either track the previous value and print a header when it changes, or build a
`defaultdict(list)` keyed by room count.
</details>
