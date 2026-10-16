# Question 26

### The bug to avoid, first

The version most people write first looks like this, and is **wrong**:

```sql
select b.building, count(distinct b.id), sum(b.capacity),
       count(c.id), coalesce(sum(c.end_time - c.start_time), 0)
from   q26rooms b left join Classes c on c.held_in = b.id
group  by b.building;
```

Joining rooms to classes gives **one row per class**. A room with 20 classes
appears 20 times, so `sum(capacity)` counts its seats 20 times — while
`count(c.id)` over the same rows is correct. The two columns need different
grains, and one query at one grain cannot give you both.

**Whenever you aggregate two different things across a one-to-many join, one of
them will be multiplied.**

### The fix: aggregate each grain separately, then join

That is what the sample answer does:

```sql
create view q26(building, nrooms, seats, nclasses, hours) as
with per_building as (
    select building, count(*) as nrooms, sum(capacity) as seats
    from   q26rooms group by building
),
per_use as (
    select b.building,
           count(c.id) as nclasses,
           coalesce(sum(c.end_time - c.start_time), 0) as hours
    from   q26rooms b left join Classes c on c.held_in = b.id
    group  by b.building
)
select p.building, p.nrooms, p.seats, u.nclasses, u.hours
from   per_building p join per_use u on p.building = u.building
where  p.nrooms >= 5
order  by u.hours desc, p.building;
```

Two aggregations at two different grains — one over rooms, one over
(room, class) pairs — joined at the end. Each is obviously correct on its own.

### `split_part` and the rooms with no dash

`split_part('EE-417', '-', 1)` → `EE`. But `split_part('K17', '-', 1)` → `K17`,
the whole name, because there is no delimiter. That would create three
one-room "buildings" instead of the `(none)` bucket the question asked for —
hence the `case`.

**Always ask what your string function does to the rows that don't match the
pattern.** Three rows out of 128 is exactly the kind of detail an exam question
is built around.

### `count(c.id)` not `count(*)`

With the `left join`, an unused room contributes one all-null row. `count(*)`
would say 1 class; `count(c.id)` says 0. And `coalesce(sum(...), 0)` because
`sum` of no rows is **null**, not zero.
