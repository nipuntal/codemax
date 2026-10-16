# Module 30

### Three queries, three different behaviours

**Query 1 — the room.** A plain `select` on a key. If the id does not exist,
`fetchone()` returns `None`, and that is the `No such room` case.

**Query 2 — the totals.** An **aggregate**, so it always returns exactly one row
— `(0, 0)` for a room with no classes. `fetchone()` here is never `None`, so
checking for it would be dead code. The meaningful test is `n == 0`.

**Query 3 — the busiest day.** Only reached when we know there are classes, so
`fetchone()` is guaranteed to give a row.

Being able to say *which* of your queries can return nothing, and which always
returns one row, is the whole skill of this module.

### `coalesce(sum(...), 0)`

`sum` over no rows is **null**, not 0 (modules 12 and 20). Without the
`coalesce`, a room with no classes would give `hours = None` — and although we
return before printing it, relying on that is fragile. Make the query give
sensible values and the Python gets simpler.

### `limit 1` is safe here

Because the ordering is total: `order by count(*) desc, day_of_week`. The
enum's week order breaks any tie deterministically, so exactly one row is
well-defined.

Module 13 warned against `limit 1` for "the biggest" — that warning is about
**ties**, and it applies when the spec wants all of them. Here we want one, and
we have said which one.

### The `int()` guard

```python
try:
    rid = int(sys.argv[1])
except ValueError:
    print(USAGE)
    return
```

Without it, `./q30.py abc` raises `ValueError`, the driver catches it as
`Internal Error:` and re-raises, and you get a traceback. Three lines to avoid
that.

### Test the awkward cases first

```bash
./q30.py 99999      # no such room
./q30.py 1003       # the full case
./q30.py 52         # a quieter room
./q30.py abc        # bad argument
```

Write the code so the awkward ones work, and the normal case tends to follow.
