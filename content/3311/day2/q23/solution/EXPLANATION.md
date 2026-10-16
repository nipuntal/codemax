# Question 23

```sql
create view q23load(room, hours, nclasses) as
select held_in, sum(end_time - start_time), count(*)
from   Classes group by held_in;

select m.name, m.rtype, m.capacity, l.hours, l.nclasses
from   q23load l join Rooms m on l.room = m.id
where  l.hours = (select max(hours) from q23load)
order  by m.name;
```

### Aggregate, then aggregate again

`sum(end_time - start_time)` gives each room's load. Finding the **largest** load
means aggregating over those sums — and aggregates don't nest:

```sql
having sum(end_time - start_time) = max(sum(end_time - start_time))   -- ERROR
```

The fix is always the same, and it is the single most useful structural move in
SQL: **compute the first level into a named intermediate, then work on that.**
A view, a `with` clause, or a subquery in `from` — all equivalent.

### Ties, again

`where l.hours = (select max(hours) from q23load)` returns every room that ties.
`order by hours desc limit 1` would not. Question 13 made this point; it is worth
making twice because it is the most commonly-lost mark in the exam's question 1.

### `sum` of a difference

`end_time - start_time` are both integers, so the hours are exact. No casting or
rounding needed — but note that this treats a 9–11 class as 2 hours regardless of
whether the room sat empty for part of it. That's the definition the question
gave; a different question might define load as *seat-hours*
(`(end_time - start_time) * capacity`) or *utilisation*
(`hours / hours_available`). **Read which one is being asked for.**

### With `with` instead of a view

```sql
create view q23(...) as
with load as (
    select held_in, sum(end_time - start_time) as hours, count(*) as n
    from Classes group by held_in
)
select m.name, m.rtype, m.capacity, l.hours, l.n
from   load l join Rooms m on l.room = m.id
where  l.hours = (select max(hours) from load)
order  by m.name;
```

Perfectly legal inside a view, and leaves no extra object behind. Use whichever
you find easier to debug — the separate view has the advantage that you can
`select * from q23load` to check it in isolation.
