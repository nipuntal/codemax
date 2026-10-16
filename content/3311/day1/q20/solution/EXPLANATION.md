# Module 20

### Stage 1 — does the room exist?

```sql
select * into r from Rooms where id = _room;
if not found then
    return 'No such room';
end if;
```

`select … into` does not fail when nothing matches — it leaves `r` null and
carries on. Without this check, `q20(99999)` would build a string out of nulls,
and module 05's spreading rule makes the whole thing **null** — which prints as
an empty line, not as the words `No such room`.

Declaring `r Rooms` gets the name, type and capacity from a single query.

### Stage 2 — two aggregates in one query

```sql
select count(*), coalesce(sum(end_time - start_time), 0) into n, hours
from   Classes where held_in = _room;
```

Two values, two variables, matched by position. One query rather than two.

`coalesce(sum(...), 0)` because **`sum` over no rows is null**, not zero — module
12's lesson, and here it would put a blank where the number should be. `count`
needs no such protection: counting nothing genuinely is 0.

### Why `found` is not checked after the second query

Because it is an aggregate, and an aggregate **always** returns exactly one row,
even for a room with no classes. `found` would be true regardless, so it tells
you nothing. The meaningful test is `n = 0`.

Knowing which of your queries can return no rows, and which always return one,
is the skill this module is really about.

### Building the shared part once

```sql
head := r.name || ' (' || r.rtype || ', ' || r.capacity || ' seats)';
```

Both of the remaining outcomes start with the same text, so it is built once
into a variable and reused. That is what `:=` is for — plain assignment of a
computed value.

Note `r.rtype` is an enum and `r.capacity` a number; `||` converts both to text
automatically (module 02).

### Using it

```sql
select q20(1003), q20(99999);
select id, q20(id) from Rooms order by id limit 5;
```
