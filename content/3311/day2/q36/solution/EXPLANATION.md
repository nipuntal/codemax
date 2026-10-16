# Question 36

### Five queries, not one

Each line of the report answers a different question at a different grain — per
class, per student, per class-with-room. Forcing them into one query would need
several CTEs and a cross join, and would be far harder to debug than five
straightforward statements.

**In an exam, write the query for line 1, run it, print it. Then line 2.** If
you run out of time you have a partial report that works, rather than one
enormous query that doesn't.

### The `no such course` check rides on the first query

```python
(nclasses, ndays, nrooms) = cur.fetchone()
if nclasses == 0:
    print("No such course")
    return
```

An aggregate query always returns a row, so `fetchone()` is never `None` — the
test is `nclasses == 0`, not `row is None`. Getting a free existence check out of
a query you needed anyway is worth doing.

### `limit 1` is correct here

Question 13 warned against `order by ... limit 1` for "the largest". The
difference is that **this spec resolves the tie for you**: "earliest day/start
wins". Once the ordering is total, `limit 1` selects a well-defined row.

```sql
order by 6 desc, c.day_of_week, c.start_time
```

Ratio descending, then day, then time. Without those tie-breaks the answer would
vary between runs.

**`limit 1` is wrong when ties should all appear, right when the spec names a
winner.** Read which one you have.

### `count(distinct a.student_id)` versus `count(*)`

`nstu` is how many people; `nenrol` is how many enrolment rows. A student taking
a lecture *and* a tutorial of the same course contributes 1 to the first and 2
to the second — which is exactly what makes "2.3 classes each" meaningful.

Mixing these up is the most likely error in this question.

### The label formatting

```python
f"  {'classes:':<12}{nclasses} across ..."
```

Two spaces, then the label padded to 12 so the values line up in a column. The
label includes its own colon — padding `'classes'` and adding `:` separately
would put the colon at column 14 and misalign everything.
