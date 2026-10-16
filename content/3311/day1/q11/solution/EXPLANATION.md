# Module 11

```sql
from Classes a
     join Classes b on a.held_in     = b.held_in
                   and a.day_of_week = b.day_of_week
                   and a.start_time  = b.start_time
                   and a.id          < b.id
     join Rooms   r on a.held_in     = r.id
```

### Two fingers on one table

`a` and `b` both range over `Classes`. Without the two aliases PostgreSQL could
not tell which `held_in` you meant, and would refuse the query.

The third join brings in `Rooms` so we can show the room's **name** rather than
its id. Note it matches on `a.held_in` — and since the `on` already forces
`a.held_in = b.held_in`, joining on `b.held_in` would work identically.

### Why `a.id < b.id` is inside the `on`

It could equally sit in a `where`; for an inner join the two are the same. Keeping
it in the `on` groups all the pairing rules together, which reads better.

Without it you would get 152 rows instead of 76 — every pair twice — plus 514
rows of each class matched against itself. Try deleting it and counting.

### The result

76 pairs. Nothing in the schema prevents this: there is no rule saying "no two
classes may share a room at the same time".

> **Theory pointer.** That kind of rule — one about *other rows in the same
> table* — cannot be written as an ordinary column or table constraint. The SQL
> standard has `create assertion` for it, but PostgreSQL does not implement it,
> so in practice you would need a **trigger**. Theory modules 33 and 34 cover
> this; the short version is that constraints can only see one row at a time,
> which is exactly why gaps like this exist in real databases.

### Sorting by five things

Room, day, start, then both course codes. Each key narrows the possibilities;
by the fifth there is nothing left to be arbitrary. The check compares text
exactly, so an ordering that could vary is an answer that fails at random.

### Worth trying

```sql
-- see the duplication the trick removes
select count(*) from Classes a join Classes b
  on a.held_in=b.held_in and a.day_of_week=b.day_of_week and a.start_time=b.start_time;
-- 666 -- pairs twice over, plus every class against itself

-- and with the trick
select count(*) from Classes a join Classes b
  on a.held_in=b.held_in and a.day_of_week=b.day_of_week
 and a.start_time=b.start_time and a.id<b.id;      -- 76
```
