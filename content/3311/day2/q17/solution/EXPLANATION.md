# Question 17

### The three-way branch again

Zero / one / many. This is the third time it has appeared and it will appear in
the exam. The pattern is always:

```python
rows = cur.fetchall()
if len(rows) == 0: print("No matching X"); return
if len(rows) > 1:  print("X is ambiguous"); return
(...) = rows[0]
```

`G12` matches both `EE-G12B` and `K17-G12` in this data, so the ambiguous branch
is genuinely reachable — test it.

### Build the pattern in Python

```python
['%' + pat + '%']
```

The `%` wildcards are part of the **value**. Trying to write them into the SQL
around a `%s` fights psycopg2's own use of `%` and wastes ten minutes.

`ilike` gives the case-insensitivity the spec asked for.

### Casting the day

```sql
where held_in = %s and day_of_week::text = %s
```

`day` comes from the command line and could be anything. Comparing it directly
against the `Weekday` enum would **raise** on `./q17.py BURROWS Funday` and
abort the script. Casting the *column* to text makes an unknown day return no
rows, which then prints `nothing scheduled` — harmless.

The spec doesn't mention bad days, so the forgiving behaviour is right.

### Two "nothing" cases, again

- no room matched → `No matching room`
- a room matched but has nothing that day → `nothing scheduled`

Different messages, different causes, and you cannot tell them apart from a
single query. **Two questions, two queries.**
