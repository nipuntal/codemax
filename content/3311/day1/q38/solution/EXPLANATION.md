# Module 38

### Three outcomes, not two

```python
found = cur.fetchall()
if len(found) == 0: ...      # No such student
if len(found) > 1:  ...      # Ambiguous
(sid, sname) = found[0]      # exactly one
```

`fetchone()` cannot distinguish "one" from "several", and the spec treats them
differently. Fetch them all and count.

This matters in **this** database: 65 names are shared. `Benjamin Zhang` is three
different people. A solution that silently reports the first one is wrong, and
the test catches it.

The exam's own past papers used exactly this three-way branch.

### `order by id` in the lookup

So that `found[0]` is deterministic in the one-match case, and any debugging
output is stable. Costs nothing.

### The padded fields are built first

```python
span = f"{st}-{en}"
what = f"{course} {ctype}"
print(f"{day} {span:<6} {what:<20} in {room}")
```

Build the combined strings, **then** pad the whole thing. Padding `st` and `en`
separately would misalign because the numbers vary in width, and padding
`course` and `ctype` separately would misalign because `Lecture` and `Tute-Lab`
differ in length (module 29).

The line ends with the room name, unpadded, so there are no trailing spaces.

### The summary needs no query

```python
hours += en - st
...
print(f"{len(rows)} classes, {hours} hours")
```

Both numbers come free from the rows you already fetched (modules 29, 37). A
second query for `count(*), sum(...)` would be an extra round trip for something
you are holding.

### The student with no classes

The loop simply does not run, and the summary prints `0 classes, 0 hours` — no
special case needed, and exactly what the spec asks for. `hours` starts at `0`,
which matters: starting it at `None` would make the total null.

**Always check what your code does when the second query returns nothing.**

### Where the marks would be

Roughly: 1 for the arguments, 3 for the lookup and its two failure branches, 3
for the class listing and its format, 1 for the summary. **The lookup is worth
more than the formatting** — but the formatting is what the automatic test
compares, so do both.

### Test the awkward cases first

```bash
./q38.py 'Benjamin Zhang'    # ambiguous
./q38.py 'Fred Flintstone'   # no such student
./q38.py 'Amy Benesh'        # exists, attends nothing
./q38.py 'Wang Baird'        # the full case
```
