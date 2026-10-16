# Question 28

### Keeping a "best so far" across the loop

```sql
if pct > bestpct then
    bestpct := pct;
    bestroom := r.room;
end if;
```

Strictly greater, so the **first** class to reach a percentage keeps the title
and later ties don't displace it. The spec said "the earliest such class", and
because the loop is already in day/time order, `>` gives exactly that.

Using `>=` would keep the **last** tie instead — a one-character difference that
changes the answer.

`bestpct` starts at `-1` rather than `0`, so a course where every class is 0%
full still sets `bestroom`. Initialising an accumulator to a value the data can
actually produce is a classic source of silent wrongness.

### Why this needs a loop at all

Questions 10, 15, 19 and 24 could all have been `return query`. This one cannot:
the final `Fullest:` line depends on **state accumulated while walking the
rows**. That's the genuine reason to write a loop rather than a query — and
worth saying in a comment if you're asked to justify it.

You *could* do it with a second query using question 16's max-with-ties pattern.
Both are fine; the loop is fewer moving parts once you're already looping.

### `100.0` not `100`

```sql
round(r.nstu * 100.0 / r.cap, 1)
```

`nstu` and `cap` are integers. `nstu * 100 / cap` is integer arithmetic and
throws the fraction away — 29/30 would come out as **96**, then `round(96, 1)`
gives `96.0`, which looks plausible and is wrong.

Making one operand `100.0` forces numeric division. Same trap as `secs / 60`.

### `n = 0` means no such course

There is no `Courses` table, so an empty result *is* the missing-course case —
the same reasoning as question 07. Note the `return;` immediately after, so the
`Fullest:` line is not also emitted with a null room.
