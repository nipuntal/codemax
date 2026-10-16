# Module 27

### Three queries, three `fetchone()`s

Each produces exactly one row, so `fetchone()` is the right tool and unpacking
into named variables keeps it readable.

```python
(ns, nr, nc) = cur.fetchone()
```

Three columns, three names. Had we selected one column we would need
`cur.fetchone()[0]` or `(n,) = cur.fetchone()` — the tuple does not disappear
just because it has one element.

### `limit 1` is safe *here*

Module 13 warned against `order by … limit 1` for "the biggest", because it
silently drops ties.

The difference is that this task **tells you how to break the tie**: name the
one that comes first alphabetically. Once the ordering is total —
`order by count(*) desc, r.name` — exactly one row is well-defined, and taking
it is correct.

> **`limit 1` is wrong when ties should all appear, and right when the question
> names a winner.** Read which one you have been given.

### Could it be one query?

Yes — all three lines could come from a single query with more subselects. Three
is clearer, and for three round trips the cost is nothing. Write what you can
debug.

### `count(distinct course)`

Module 07's distinction. There are 514 classes but only 83 courses, because a
course runs many classes.

### `group by r.id, r.name`

Grouping by the primary key as well as the name (module 12). Room names happen
to be unique here, but grouping by the key is always right and costs nothing.

### Worth trying

```python
cur.execute("select count(*) from Rooms")
print(cur.fetchone())        # (128,)  -- the tuple
print(cur.fetchone())        # None    -- already consumed!
```

That second line is instructive: `fetchone()` advances, and there is no second
row.
