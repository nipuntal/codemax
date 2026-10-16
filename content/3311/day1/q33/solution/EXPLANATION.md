# Module 33

### The view is created by the script

```python
cur.execute("""
    create or replace view q33helper(course, nrooms, nclasses) as
    select course, count(distinct held_in), count(*)
    from   Classes group by course
""")
```

`create or replace` is not optional. Without it the second run of the script
fails with `relation "q33helper" already exists` — and you *will* run it more
than once while testing.

**Anything a script creates should be safe to create again.**

### The header prints before the query

```python
print(f"courses using at least {least} rooms:")
```

The spec says to print it even when nothing qualifies, so it goes before the
loop. Try `./q33.py 99` — header, then `0 courses qualify, out of 83`. Specs are
often explicit about this and it is an easy mark to drop.

### `%s` against a view

```sql
where nrooms >= %s
```

A view is queried exactly like a table, parameters included (module 28). Nothing
special is needed.

### `len(rows)` and a separate total

The qualifying count comes from the list we already have. The **total** needs
another query — but a cheap one against the view, not a re-derivation from
`Classes`.

That is the payoff of naming the intermediate result: both questions are now
one-line queries against `q33helper`.

### Should you use a helper at all?

Here you could equally write one query with a `having` clause. The helper earns
its place when **several queries** need the same intermediate — which is exactly
the case here, since we query it twice.

For the exam: if the question gives you only a `.py` file, prefer `with` or a
plain query. If it gives you a `.sql` file too, helpers are expected.

### Tidying up

```sql
drop view if exists q33helper;
```

Worth running in `psql` if you want a clean database. Leaving it is harmless.
