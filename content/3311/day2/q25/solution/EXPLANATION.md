# Question 25

### `generate_series` turns a range into rows

```sql
from sizes s, generate_series(s.start_time, s.end_time - 1) as h
```

This is a **lateral** join: for each class, `generate_series` produces one row
per hour it occupies. A 9–11 class yields two rows, `h = 9` and `h = 10`.

`end_time - 1` because a class ending at 11 is not using the 11 o'clock hour.
Off-by-one here is the single easiest way to get this question wrong, and it
inflates every number by roughly the average class length.

Once you have (class, hour) pairs the rest is ordinary grouping. **Any question
about "at any given moment" or "simultaneously" needs this expansion.**

### Three CTEs, one per idea

- `sizes` — how many students each class has (computed **once**, before the
  expansion, so the count isn't multiplied by the number of hours)
- `hourly` — totals per (day, hour)
- `best` — rank within each day

Stacking `with` clauses like this keeps each step testable. Paste any one of
them into `psql` on its own and look at it.

### Getting `sizes` first matters

If you expanded the hours *before* counting students, each student would be
counted once per hour and the totals would be wrong. **Aggregate at the right
grain, then expand.**

### The tie-break lives in the window

```sql
rank() over (partition by d order by nstu desc, hour)
```

The spec says report the **earlier** hour on a tie, so `hour` ascending is the
second sort key. With `rank()` alone on `nstu desc`, a tie would produce two
rows with `k = 1` and you would print two lines for that day.

Adding `hour` to the `order by` makes the ranking total, so exactly one row per
day gets `k = 1`. `row_number()` would also give one row, but arbitrarily — the
explicit tie-break says *which* one you meant.

### The ordering trap that bit this answer

```sql
select d::text, hour, ... from best where k = 1 order by d      -- WRONG
select d::text as dayname, hour, ... from best where k = 1 order by d   -- right
```

In the first, the output column is *also* called `d`, and **`order by` prefers an
output column name over an input one**. So it sorts the **text**, giving
Fri, Mon, Thu, Tue, Wed.

Aliasing the output to `dayname` leaves `d` referring to the underlying enum, and
the days come out in week order.

Whenever you cast a column and then order by it, check you are ordering the
thing you think you are.

### Note this is the opposite of question 13

There, ties all had to be shown. Here the spec says pick one. **Read which
behaviour is wanted** — the two look similar and are marked differently.
