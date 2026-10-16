# Question 39 — exam simulation

### The de-duplication is the hard part

```sql
join Attends a2 on a1.student_id = a2.student_id and a1.class_id <> a2.class_id
where c1.course = %s
```

`<>` rather than `<`, because the two sides are **not** interchangeable: the
first must be a class of this course. But that creates a problem — when *both*
classes belong to the course, the pair is produced **twice**, once in each
order.

Fixing it in SQL is awkward (you'd need `c2.course <> %s or c1.class_id <
c2.class_id`, which is easy to get wrong). Fixing it in Python is three lines:

```python
key = (sid, min(id1, id2), max(id1, id2))
if key in seen: continue
seen.add(key)
```

Keying on the **unordered** pair of class ids — via `min`/`max` — makes the two
orderings collapse to the same key.

**When a de-duplication rule is easier to state in Python than in SQL, do it in
Python.** The alternative is a `where` clause you cannot convince yourself is
right.

### `M` comes from the rows, not another query

```python
clashing.add(sid)
...
print(f"{course}: {len(clashing)} of {nstu} students have a clash")
```

A set of student ids built during the loop. A separate `count(distinct ...)`
query would work and would be a fifth round trip for a number you are already
holding.

Note the header prints **after** the loop that builds `clashing`, but **before**
the day sections. Build everything, then print — that is often the simplest
control flow when one line depends on all the others.

### The fixed day list, again

```python
for day in ("Mon", "Tue", "Wed", "Thu", "Fri"):
```

Third time in this set (questions 20, 34, 39) and it was in the 23T3 paper too,
as age groups with `- no participants in this age group`. **When a spec
enumerates the groups, iterate the spec's list, not the data's.**

### `.strip()` on the course codes

`char(8)`, so in general blank-padded. Every code here is exactly 8 characters
so it changes nothing — but it costs nothing and removes a class of invisible
formatting bug.

### Where the marks would be

2 for the existence check and the header counts, 3 for the clash join, 2 for the
de-duplication, 2 for the grouped output with its empty-day lines. Note that
**you can score the day-grouping marks without the de-duplication being
perfect** — get the structure printing first, then fix the double-counting.
