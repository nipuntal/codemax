# Question 19

### The overlap condition

```sql
c1.start_time < c2.end_time and c2.start_time < c1.end_time
```

Two intervals overlap **iff each starts before the other ends**. That single
line handles every case: one inside the other, partial overlap at either end,
identical times.

Common wrong attempts:

```sql
c1.start_time = c2.start_time              -- only exact same start
c1.start_time between c2.start_time and c2.end_time   -- misses c2 inside c1
```

The second is closer but asymmetric — it catches c1 starting during c2 but not
c2 starting during c1. You'd need it twice, `or`-ed. The two-inequality version
is the standard and is worth memorising.

Note the strict `<`. A class ending at 11 and another starting at 11 do **not**
clash — they're back-to-back, which is question 12's pattern. Using `<=` would
report all 144 of those as clashes.

### `a1.class_id < a2.class_id`

Here the two sides genuinely are interchangeable — "these two classes clash" is
symmetric. Without the `<` you would get:

- every class paired with **itself** (same day, trivially overlapping)
- and every real pair **twice**, once in each order

`<` removes both in one stroke. Contrast question 12, where the sides meant
different things and the `<` would have been wrong.

### Why join `Attends` twice rather than `Classes` twice

Because the clash must be between two classes **this student attends**. Joining
`Classes` to itself would find every clashing pair in the university.

### The two edge cases both matter

`5348827` (Amy Benesh) attends nothing → the loop never runs → `No clashes`.
That's correct and needs no special case. `1` is not a student id at all →
`No such student`. Test both.
