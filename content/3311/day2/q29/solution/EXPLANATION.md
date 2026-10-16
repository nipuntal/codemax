# Question 29

### The overlap condition, inverted

A room is busy if some class overlaps the slot:

```sql
c.start_time < %s   -- class starts before our slot ends
and %s < c.end_time -- our slot starts before the class ends
```

with the parameters bound `[..., end, start, ...]` — note the **order**: `end`
fills the first placeholder, `start` the second. Getting those the wrong way
round produces a query that runs, returns plausible-looking rooms, and is
completely wrong.

Wrapping the whole thing in `not exists` turns "is busy" into "is free". That is
easier to get right than trying to write "doesn't overlap" directly, which needs
`c.end_time <= start or c.start_time >= end` and is a common source of
sign errors.

**Express the positive condition, then negate it.**

### Three validation branches, in spec order

```
wrong count / non-numeric  -> USAGE
invalid day                -> No such day: X
start >= end               -> Bad time range
```

`int()` inside a `try` catches `./q29.py Mon nine 10 30`. Validating the day
against `enum_range` avoids the database error that comparing an arbitrary
string to the `Weekday` enum would raise — question 11's trap.

Order matters and the spec dictates it: `./q29.py Funday 16 14 30` reports the
day, not the time range.

### The zero case still prints line 1

```
0 rooms free Mon 9-21 with capacity >= 30
```

The header goes **before** the loop, so it prints whether or not anything
follows. Test it with `./q29.py Mon 9 21 500` — no room on campus seats 500, so the
answer is a single line reading `0 rooms free ...`.

### The format

```python
f"{name:<20} {rtype:<20} {capacity:>5}"
```

Two padded left-aligned fields and a right-aligned number. Because the number is
last and right-aligned, no line ends in trailing whitespace — which matters,
since the check compares text exactly.

### Realism

This is the most plausible "real" exam question in the set: it is the query a
timetabling office actually runs. If you can write this one cold, questions 1–5
of the paper hold no surprises.
