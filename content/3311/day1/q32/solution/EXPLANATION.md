# Module 32

### One query, sections built in Python

```sql
select   count(distinct held_in) as nrooms, course, count(*) as nclasses
from     Classes
group by course
order by count(distinct held_in), course
```

One row per course, already sorted so that all the one-room courses come first,
then the two-room ones, and so on — and within each block, courses in code
order.

Then Python only has to notice when the room count changes:

```python
if nrooms != previous:
    print(...)
    previous = nrooms
```

**Sorting in SQL so that the Python becomes trivial** is the technique here.
Had the rows arrived in arbitrary order you would need a dictionary and a second
sort.

### The alternative with a dictionary

```python
from collections import defaultdict
sections = defaultdict(list)
for (nrooms, course, nclasses) in cur.fetchall():
    sections[nrooms].append(f"- {course}: {nclasses} classes")
for nrooms in sorted(sections):
    print(...)
    for line in sections[nrooms]:
        print(line)
```

Equally correct, and more obviously right if you do not trust the ordering.
Both are accepted.

### `count(distinct held_in)`

A course teaches many classes in the same room, so counting rows would answer a
different question. Modules 08, 11 and 16 all made this point — it keeps coming
back because it keeps being the thing people get wrong.

### What the N+1 version would have looked like

```python
cur1.execute("select distinct course from Classes")
for (course,) in cur1.fetchall():
    cur2.execute("select count(*), count(distinct held_in) from Classes where course=%s",
                 [course])
    ...
```

84 queries instead of one. It gives the right answer, and on this small database
it is just as fast — which is exactly why the habit has to be deliberate rather
than something you discover when it starts hurting.

### Singular and plural, again

`1 room` but `2 rooms`. Module 31 made the same point; specs check it.
