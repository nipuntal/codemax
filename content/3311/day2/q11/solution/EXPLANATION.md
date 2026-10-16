# Question 11

### The enum trap

```python
cur.execute("select * from Rooms where rtype = %s", ['Broom Cupboard'])
```

does **not** return zero rows — it raises:

```
InvalidTextRepresentation: invalid input value for enum roomtype: "Broom Cupboard"
```

and leaves the connection in an aborted transaction. Any later query then fails
with `current transaction is aborted`.

Two safe answers. **Validate first**, as the sample does:

```python
cur.execute("select unnest(enum_range(null::RoomType))::text")
valid = [r[0] for r in cur.fetchall()]
```

`enum_range(null::TypeName)` returns the enum's values as an array; `unnest`
turns it into rows. Handy, and it means the list is never out of date.

Or **catch it**:

```python
try:
    cur.execute(...)
    rows = cur.fetchall()
except psycopg2.Error:
    db.rollback()
    print("No such room type")
    return
```

The `rollback()` is essential — without it the connection stays unusable.

Both are accepted. The first is better because it distinguishes "you typed a
type that doesn't exist" from "the query broke for some other reason".

### `left join` and `count(c.id)`

Every room in *this* data has classes, so an inner join happens to give the same
answer. But the question asks for rooms and their class count, and a room with
no classes should report **0**, not vanish. `left join` plus `count(c.id)` —
counting a column from the optional side so nulls give 0 — is the correct shape
regardless of what today's data contains.

### The format

```python
f"{name:<20} {cap:>3}  {n:>4}"
```

Left-align the name to 20, one space, right-align capacity to 3, two spaces,
right-align the count to 4. Count them against the example in the question. The
count is last and right-aligned, so no line ends in trailing spaces.
