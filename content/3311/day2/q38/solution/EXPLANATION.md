# Question 38 — exam simulation

### Label the hours, then merge

The instinct is to compute blocks directly from the class list. Don't — overlaps
and gaps make that fiddly. Instead:

```python
label = {}
for (st, en, course, ctype) in classes:
    for h in range(st, en):
        label.setdefault(h, f"{course.strip()} {ctype}")
```

One entry per occupied hour, `setdefault` so the first (alphabetically-first,
thanks to `order by course`) wins a contested hour. Free hours are simply absent
from the dict.

Then merge runs of equal labels:

```python
h = 9
while h < 21:
    what = label.get(h)
    j = h
    while j < 21 and label.get(j) == what:
        j += 1
    ...
    h = j
```

The inner loop extends `j` while the label is unchanged — `None` compares equal
to `None`, so free stretches merge exactly like booked ones and need no special
case. **Expanding to a fine grain and re-merging is almost always easier than
reasoning about intervals directly**, and it's the same trick as question 25's
`generate_series`.

### `range(st, en)`

Not `range(st, en + 1)`. A 9–11 class occupies hours 9 and 10. The same
off-by-one as question 25, and it would show up here as blocks one hour too
long and a booked total that doesn't match.

### Two-digit hours

`f"{h:02}"` gives `09` for 9 and `12` for 12. The spec asked for zero-padding,
and `09-12` versus `9-12` is a failed test.

### 12 hours, not 13

The window 9 to 21 contains **12** hour-slots (9,10,…,20). `21 - 9 = 12`, and
`free = 12 - booked`. Writing 13 because "9 through 21 inclusive is 13 numbers"
is the trap; you are counting **intervals**, not endpoints.

### Validate both arguments before doing any work

Room first, then day — the order the spec lists them, so
`./q38.py Nowhere Funday` reports the room. Both checks happen before line 1
prints, because the spec says an error produces *only* the error line.

### Where the marks would be

Roughly: 1 for arguments, 2 for the two "no such" branches, 3 for the block
merging, 1 for the two-digit format, 1 for the summary line. **The merging is
the bulk — get it working before polishing the format.**
