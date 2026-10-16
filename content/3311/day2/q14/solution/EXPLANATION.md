# Question 14

### Three outcomes, not two

```python
rows = cur.fetchall()
if len(rows) == 0: ...          # No such student
if len(rows) > 1:  ...          # Ambiguous
(sid, sname) = rows[0]          # exactly one
```

`fetchone()` would tell you whether there was *at least* one match, but not
whether there were **two** — and the spec treats those differently.

This matters in *this* database: 65 names are shared. `Benjamin Zhang` is three
different students. A solution that silently reports the first one is wrong, and
the test catches it.

The 23T3 paper's question 5 used exactly this three-way branch on a partial
event name. Expect it.

### Why `order by id` in the lookup

So that `rows[0]` is deterministic in the one-match case, and so that any
debugging output is stable. Costs nothing.

### Name matching is exact and case-sensitive

The spec says exact. `where name = %s` does that. Be aware this data contains
`christabel Ludbrook` with a lower-case c — real UNSW data is messy, and a
question that says "exactly as stored" means exactly.

If a question asks for case-insensitive matching, that's `ilike` (and then the
ambiguity branch matters even more).

### The padded field

```python
what = f"{course} {ct}"
print(f"{day} {st}-{en}  {what:<22} in {room}")
```

Build the combined string **first**, then pad the whole thing to 22. Padding
`course` and `ctype` separately would misalign, because class types vary in
length from `Lecture` to `Tute-Lab`.

### The student with no classes

`Amy Benesh` attends nothing. The loop simply doesn't run and only the header
line prints — no special case needed, and the spec asks for exactly that.
Always check what your code does when the second query returns nothing.
