# Module 40

### Four tables, and only one of the joins is outer

```sql
from Has h
     join Rooms r on h.room_id = r.id            -- inner: every Has row has a room
     left join Classes c on c.held_in = r.id     -- outer: a room may have no classes
where h.facility_id = %s
```

Choosing the right kind for each is the skill. `Has.room_id` is a foreign key
(module 00), so the room always exists and an inner join loses nothing. But a
room might have no classes, and the spec says such rooms must still appear —
hence `left join`.

Making both outer would give the same answer here and would suggest you did not
know which case was which.

### `count(c.id)` and `coalesce(sum(...), 0)`

Module 12's pair. A room with no classes produces one all-null row:
`count(*)` would say 1, `count(c.id)` says 0. And `sum` over no rows is
**null**, not 0, so it needs the `coalesce`.

Every room in this data has classes, so it makes no difference **today** — which
is exactly why you write it correctly instead of testing it.

### Two different "empty" cases

```python
cur.execute("select id from Facilities where name = %s", [fname])
if cur.fetchone() is None:
    print(f"No such facility: {fname}")
```

A facility that does not exist and a facility that is in no rooms both give zero
rows from the main query. The spec wants different output for each, so the
existence check is a **separate query** (module 30).

### The totals come from the rows

```python
tot_c += n
tot_h += hours
```

No second query. Both accumulators start at `0`, which matters — `None + 1` is
null (module 05), and an uninitialised total would stay null forever.

### The format

```python
f"{name:<20} {rtype:<15} {cap:>4}  {n:>3} classes  {hours:>3} hours"
```

Count the literal spaces against the example in the task: one after the name,
one after the type, two after the capacity, two after `classes`. The line ends
with the word `hours`, so nothing is left padded and there are no trailing
spaces (module 29).

### `order by count(c.id) desc, r.name`

Busiest first, with the name as the tie-breaker — and plenty of rooms tie, so it
is doing real work (module 06).

---

## That is day 1

Forty-one modules: the database itself, every SQL construct this course uses,
PLpgSQL functions, and the whole psycopg2 stack — all on the exam's own
database.

Come back to the checklist at the top of this README before any timed practice.
