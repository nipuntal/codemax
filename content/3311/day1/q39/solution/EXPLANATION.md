# Module 39

### Mark the hours, then print them

The instinct is to work out blocks directly from the class list. Don't — that
gets fiddly as soon as classes overlap or leave gaps. Instead expand to the
finest grain:

```python
busy = {}
for (st, en, course, ctype) in cur.fetchall():
    for h in range(st, en):
        busy.setdefault(h, f"{course.strip()} {ctype}")
```

One entry per occupied hour. Free hours are simply **absent** from the dict, so
`busy.get(h)` returns `None` for them and the printing loop needs no special
case.

**Expanding to a fine grain and then reading it back is almost always easier
than reasoning about intervals directly.**

### `range(st, en)`, not `en + 1`

A 9–11 class occupies hours 9 and 10. At 11 it has finished. This off-by-one
would make every block one hour too long and would break the final count — and
it is the single easiest way to get this question wrong.

### `setdefault` and the ordering

`setdefault` writes only when the key is absent. Combined with `order by course`
in the query, the alphabetically-first course wins a contested hour, which is
what the spec asked for. This room genuinely has contested hours, so it is
tested.

### Two digits

`f"{h:02}"` gives `09` for 9 and `12` for 12. The spec said two digits, and
`9 free` versus `09 free` is a failed test.

### 12 hours, not 13

Hours 9 through 20 inclusive is **12** slots — `21 - 9 = 12`. Writing 13 because
"9 to 21 is thirteen numbers" is the trap: you are counting **intervals**, not
endpoints.

`len(busy)` is the number of occupied hours, which is why no separate counter is
needed.

### Validation order

Room first, then day — the order the spec lists them, so
`./q39.py Nowhere Funday` reports the room. Both checks happen **before** line 1
prints, because an error produces only the error line.

`enum_range(null::Weekday)` asks the database for the valid weekday values, which
means the list can never go out of date. Comparing an arbitrary string directly
against the enum would raise (module 00).

### `.strip()` on the course code

`course` is `char(8)` (module 02). Every code here is exactly 8 characters so
there is nothing to strip — but a stray trailing space is invisible on screen and
fatal to an exact comparison. It costs nothing.

### Where the marks would be

2 for the three-way room lookup, 1 for the day check, 4 for the hour marking and
the twelve lines, 1 for the two-digit format, 1 for the summary. **Get the hour
marking working before polishing the format** — it is the bulk.
