# Question 40 — capstone

### The mapping belongs in Python

```python
WANTED = {"Lecture": "Lecture Theatre", ..., "Tute-Lab": "Computer Lab"}
```

A five-way lookup with no data behind it. Writing it as a SQL `case` would work
and would be longer; a dict says exactly what it is.

Note that `Tute-Lab → Computer Lab` is a **judgement call** — the schema comment
says a Tute-Lab is a tutorial *followed by* a lab, "generally in a computer lab".
The question resolves it for you. In the real exam, if a mapping like this is
under-specified, **pick one, state it in a comment, and move on**. A stated
assumption scores; a silent guess and a long pause do not.

### `exists (...)` as a selected column

```sql
exists (select 1 from Classes c2
        where c2.held_in = m.id and c2.day_of_week = %s
          and c2.start_time < %s and %s < c2.end_time) as busy
```

A correlated `exists` in the **select list** yields a boolean per row. That gives
you the free/busy flag *and* something to sort on, in one query, instead of a
second round trip per candidate — which would be the N+1 pattern.

Parameter order again: `en` then `st`. Same trap as questions 29 and 31, and it
is the single most likely place to lose marks here because the query still runs.

### `order by busy`

`false` sorts before `true` in PostgreSQL, so ascending order puts **free rooms
first** — exactly what the spec wants, with no `case` needed.

Sorting on a boolean flag to push one group to one end is a genuinely useful
trick. Then `m.capacity` ascending gives the *smallest sufficient* room, which is
the sensible allocation, and `m.name` breaks the remaining ties.

### `m.rtype::text = %s`

`want` is an ordinary Python string. Comparing it to the enum column directly
would raise if it were ever wrong; casting the column to text makes it a plain
string comparison. Since `want` comes from our own dict it can't be invalid —
but the cast costs nothing and matches the habit from questions 11 and 17.

### The verdict uses data you already have

```python
ok = (rtype == want) and (cap >= nstu)
```

No query. `rtype`, `cap` and `nstu` all came back with line 1. **Before writing a
query, check whether you are already holding the answer.**

### Test 02 versus test 01

One class is correctly roomed and one is not. Find both cases in the data before
you trust your verdict logic — a bug that always prints `Needs moving` passes
half the tests and looks fine.

---

## That's day 2

Forty questions on the real exam database, in the shapes the last two papers
actually used. If you can do 30–40 unaided, the practical half of the paper
holds nothing you have not already seen.
