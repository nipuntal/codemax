# Question 31

### Gather the facts, then judge

```python
full = nstu >= cap
clashes = cur.fetchall()
...
print("Can add" if (not full and not clashes) else "Cannot add")
```

The verdict depends on **two independent conditions**, and both of their
messages must print regardless of the answer. So you cannot `return` early once
you know it's a no — you compute both, report both, then decide.

The `already enrolled` case is different: the spec says print that and stop, so
it *does* return early. **Follow the spec's control flow exactly**; it is not
arbitrary, it determines what the output looks like.

### `>= cap`, not `> cap`

"Full" means at capacity. 30 enrolled in a 30-seat room is full. In this
database 162 classes sit exactly at capacity, so `>` versus `>=` changes the
answer for a lot of inputs — including test 02.

### The clash query is the overlap test with the *new* class's times

```sql
where a.student_id = %s and c.day_of_week = %s
  and c.start_time < %s   -- existing starts before the new one ends
  and %s < c.end_time     -- new one starts before the existing ends
```

with parameters `[sid, day, en, st]`. Note `en` (the new class's **end**) fills
the first placeholder and `st` the second — the same ordering trap as question
29. Getting them swapped gives a query that runs and quietly reports the wrong
classes.

Here we are comparing *one candidate class* against the student's existing
timetable, so there is no self-join and no `<` on ids — the two sides are
different kinds of thing.

### `day` comes back from the database

`day` was fetched from `Classes`, so it is already a valid `Weekday` value and
comparing it against `c.day_of_week` is safe with no cast. Contrast question 17,
where the day came from the command line and had to be cast to text.

**Values that came out of the database can be trusted; values that came from the
user cannot.**

### Test 03

`5348827` is Amy Benesh, who attends nothing. She has no clashes — but the room
is full, so the answer is still `Cannot add`. Two conditions, and only one of
them fails: exactly the case a careless implementation gets wrong.
