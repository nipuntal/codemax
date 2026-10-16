# Module 36

### The split of labour

**SQL does**: the `not exists` test and both levels of sorting.

**Python does**: turn `(type, name)` pairs into one line per type.

That is the right division. Gluing a list of names into a delimited line is
exactly what SQL is clumsy at and Python is good at.

### Preserving the enum's order

```python
order = []
for (rtype, name) in cur.fetchall():
    if rtype not in by_type:
        order.append(rtype)
```

The task asked for the **enum's** order — Lecture Theatre, Tutorial Room,
Computer Lab, Meeting Room — which is what `order by r.rtype` produced in SQL
(module 06).

If we had iterated `sorted(by_type)` in Python we would have got **alphabetical**
order instead, which is a different answer. So we record the types in the order
they first arrive and iterate that.

**When the database has ordered things for you, do not re-sort in Python.** You
will usually get a different — and wrong — order.

### Only types with results appear

`by_type` only gains a key when a row arrives for it, so a room type with no
qualifying rooms simply never appears. That is what the spec asked for.

### The `not exists`

```sql
where not exists (select 1 from Classes c
                  where c.held_in = r.id and c.start_time < 12)
```

*There is no class in this room starting before 12.* Module 14's tool, and
module 16's "turn 'every' inside out" idea — "every class starts at 12 or later"
becomes "no class starts earlier".

### Doing it all in SQL

PostgreSQL can glue the names together itself:

```sql
select rtype, string_agg(name, ', ' order by name)
from   Rooms r
where  not exists (...)
group  by rtype order by rtype;
```

Shorter, and a perfectly good answer. The task asked for the Python version
because reshaping query results is a skill the Python questions test — and
because a dict works everywhere, while `string_agg` is PostgreSQL-specific.

### The import inside the function

`from collections import defaultdict` sits inside `main()` only to keep the
template tidy. Putting it at the top with the other imports is more conventional
and equally fine.
