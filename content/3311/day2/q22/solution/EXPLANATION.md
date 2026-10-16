# Question 22

### Two different "empty" cases

```python
cur.execute("select count(*) from Classes where course = %s", [course])
if cur.fetchone()[0] == 0:
    print("No such course")
```

A course exists only because a class mentions it, so *no classes* means *no such
course*. But a course **could** have classes and no students, which the spec
treats differently (`no students`). One query cannot distinguish them, so there
are two checks — the second falls out of `n == 0` after the main query.

Note the first query is an aggregate, so `fetchone()` always returns a row and
`is None` would never fire. `== 0` is the right test. That distinction between
aggregate and non-aggregate queries comes up constantly.

### The `with` clause names the awkward bit

```sql
with enrolled as (
    select distinct a.student_id as sid
    from Attends a join Classes c on a.class_id = c.id
    where c.course = %s
)
```

`distinct` because a student may take several classes of the same course — a
lecture *and* a tutorial. Without it, such a student would be counted twice and
the percentage would be wrong.

### `count(*) filter (where exists (...))`

`filter` restricts an aggregate to the rows matching a condition, in the same
pass. The condition here is a correlated `exists` — for each enrolled student,
is there any clashing pair anywhere in their week?

The portable form is `count(case when exists (...) then 1 end)`.

### The division guard

```python
pct = m / n * 100 if n else 0
```

The sample returns early on `n == 0` so the guard is implicit — but **any**
division by a value that came from the data needs one. `ZeroDivisionError`
inside `main()` produces an ugly `Internal Error:` and a traceback.

Round **only** in the format string: `{pct:.1f}`. Rounding earlier and then
multiplying gives a different number.

### Could this be one query?

Yes, and it would be shorter. It would also make the two "empty" branches
impossible to tell apart. **When a spec has several distinct failure messages,
let that drive how many queries you write.**
