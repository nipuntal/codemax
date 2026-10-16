# Question 37

### One counter, reused

```sql
n := 0;
for r in ... loop n := n + 1; return next ...; end loop;
if n = 0 then return next '  - none'; end if;
```

Twice, for two different sections. **Reset it before each loop.** Forgetting the
reset means the second section never prints its `- none`, because `n` is still
carrying the first section's count. That is the most likely bug in a
multi-section function and it only shows up on the rooms where the second
section is empty — which is why you test room 208 as well as 1003.

### Section headings print unconditionally

`Facilities:`, `Usage:` and `Clashes:` go **before** their loops, so they appear
whether or not anything follows. Only the *content* has an empty case. Re-read
any spec that lists sections to see which parts are unconditional.

### `select ... into` with two targets

```sql
select count(*), coalesce(sum(end_time - start_time), 0) into nc, hrs
from Classes where held_in = _room;
```

Two values, two variables, matched by position. And `coalesce(sum(...), 0)`
because `sum` over **no rows** is null, not zero — a room with no classes would
otherwise print `0 classes,  hours` with a blank where the number should be.

`count(*)` needs no coalesce: count of nothing is genuinely 0.

### The busiest day, with its tie-break

```sql
order by count(*) desc, day_of_week limit 1
```

The spec says the earliest day wins a tie, and `day_of_week` is an enum ordered
Mon→Fri, so ascending gives exactly that. Wrapping it in a subquery lets
`select ... into` take the single row.

### Build it in four passes

Write the header line. Load it, run it. Add `Facilities:`. Load, run. Then
`Usage:`, then `Clashes:`. Each block is independently checkable, and if you run
out of time you have a function that runs and produces three of the four
sections.

**A function that loads and produces most of the output scores most of the
marks. One that fails to compile scores nothing.**
