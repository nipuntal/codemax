# Question 20

### Iterate the fixed list, not the dict

```python
for day in ("Mon", "Tue", "Wed", "Thu", "Fri"):
```

**Not** `for day in byday:`. A day with no classes never becomes a key, so
iterating the dict silently skips it — and the whole point of the question is
that empty days must still print.

This is exactly what the 23T3 paper's question 5 tested with its age groups and
`- no participants in this age group`. Whenever a spec lists the groups
explicitly, iterate **the spec's list**.

`defaultdict(list)` means `byday[day]` returns `[]` for a missing day instead of
raising `KeyError`, so the `if` reads cleanly.

### One query, grouped in Python

Five queries (one per day) would work and would be five round trips. Fetch once,
group in memory. Grouping rows into sections is precisely the kind of reshaping
Python is good at and SQL is clumsy at.

### `count(a.student_id)` with a `left join`

A class with no students still needs to appear with `0`. `count(*)` would say 1
for such a class, because the outer join produces one all-null row. Counting a
column from the optional side gives 0.

Every class in this data has students, so it makes no difference **today** —
which is exactly why you should write it correctly rather than testing it.

### `day_of_week::text`

Cast in the query so Python gets a plain `str` to use as a dict key. Without the
cast psycopg2 still hands you a string for an enum, so it would work either
way — but being explicit costs nothing and documents the intent.

### The ordering

`order by c.start_time, m.name` — no day in the sort, because Python is doing
the day grouping. Within each day, the append order is the query order, so the
classes come out in start-time order automatically.
