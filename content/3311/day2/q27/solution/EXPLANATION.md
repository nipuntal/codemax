# Question 27

### Check the arguments in the order the spec lists them

```python
for code in (c1, c2):
    cur.execute("select count(*) from Classes where course = %s", [code])
    if cur.fetchone()[0] == 0:
        print(f"No such course: {code}")
        return
```

The spec says check the first argument first, so a call with **both** bogus
reports the first. Specs are explicit about this precisely because it is
observable, and the test checks it.

The `Same course` check comes before both — again, because that is the order the
spec sets out.

### No `a.id < b.id` in this clash join

```sql
from Classes x join Classes y on x.day_of_week = y.day_of_week and <overlap>
where x.course = %s and y.course = %s
```

`x` is always a class of the first course and `y` of the second, so each pair is
generated exactly once and a class can never pair with itself. Adding
`x.id < y.id` would wrongly drop about half the pairs.

Compare questions 19 and 24, where both sides were drawn from the same set and
the `<` was essential. **The test is: could this join produce the same pair
twice, in two orders?** Here, no.

### `intersect` for "takes both"

```sql
(students of c1) intersect (students of c2)
```

`intersect` removes duplicates automatically, so a student taking a lecture and
a tutorial of each is counted once. Doing it with a join instead would need
`count(distinct a.student_id)` and two joins — the set operation says what it
means.

In Python you could equally fetch both id lists and do `set(a) & set(b)`. One
query is better, but the Python version is a perfectly good fallback if the SQL
isn't coming.

### The counts come from the rows you already have

`len(rows)` for the clashing-pair count — no second query. And the count line
prints **after** the loop, so it appears at the bottom as the spec requires,
even when there are zero pairs.
