# Module 24

### The shape

```
check the room exists      -> 'No such room'      + return;
check it has any classes   -> '... no classes'    + return;
header line
loop over the days, accumulating totals
total line
```

Two early exits, each with its own `return;`. Then the main body.

### The two `return;` statements are load-bearing

```sql
return next 'No such room';
return;                       -- without this, execution continues
```

`return next` appends a row and **keeps going**. Leave the `return;` out and
`q24(99999)` emits `No such room`, then falls into the `select count(*)` (which
gives 0 for a non-existent room), then emits `: no classes` built from a null
name — two wrong lines instead of one right one.

Module 22 flagged this as the classic bug in `setof` functions. It is worth
checking twice.

### Why the class count is a separate query

`select count(*) into n` is an **aggregate**, so it always returns a row —
`found` would be true even for a room with no classes at all. The meaningful
test is `n = 0`, not `if not found`. Module 20 made this distinction; here it
decides which of two messages you print.

### The totals: added up in the loop

```sql
totc := totc + t.c;
toth := toth + t.h;
```

The per-day query already computed those numbers, so adding them up costs
nothing. A second query over `Classes` would also work and would be equally
correct — this way just avoids asking the database the same thing twice.

Both variables start at `0`, which matters: `null + 1` is null (module 05), so
an uninitialised accumulator would stay null forever and the total line would
come out blank.

### The grouped query

```sql
select day_of_week, count(*), sum(end_time - start_time)
from   Classes where held_in = _room
group  by day_of_week
order  by day_of_week
```

Straight out of modules 08 and 09. `where` filters rows to this room before the
piles are made; `order by` on the enum gives Mon→Fri (module 06).

Days with no classes simply do not appear, which is what the task asked for.

### Building the header once

`head` is used by two different outcomes, so it is built into a variable and
reused (module 20's technique).

### If you ran out of time in an exam

A partial answer earns partial marks. Getting the header and the per-day lines
right and leaving out the totals is worth far more than a blank file. **Load
what you have, make sure it runs, and submit it.**

The one thing that scores nothing is a function that fails to compile — so if
you are stuck on the last line, comment it out and submit something that works.
