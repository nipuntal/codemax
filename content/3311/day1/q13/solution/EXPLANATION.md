# Module 13

```sql
select r.name, r.capacity, c.course, c.ctype, c.day_of_week, c.start_time
from   Classes c join Rooms r on c.held_in = r.id
where  r.capacity = (select max(capacity) from Rooms)
order  by r.name, c.day_of_week, c.start_time, c.course
```

### The subquery runs once

`(select max(capacity) from Rooms)` mentions nothing from the outer query. It is
worked out once, to a single number — 400 — and every row is compared against
it. Cheap, and easy to reason about.

### Both rooms appear

`BURROWS-TH` and `CLB-7` both seat 400, and both are in the answer. That is the
whole point of the question.

```sql
select name from Rooms order by capacity desc limit 1;
```

would give you one of them, chosen arbitrarily, with no warning. **Whenever a
question says "the biggest", ask yourself whether ties are possible.** In this
database they usually are.

### The other spelling

```sql
where r.capacity >= all (select capacity from Rooms)
```

*At least as big as every room* — the same thing, and some people find it
clearer. Both are accepted.

### Sorting by four keys

Room, day, start, course. `day_of_week` is an enum so it gives week order for
free (module 06), and the last key makes the ordering decisive.

### Worth trying

```sql
select max(capacity) from Rooms;                              -- 400
select name from Rooms where capacity = (select max(capacity) from Rooms);

-- an average of counts, needing a subquery in FROM
select round(avg(n),1) from (select count(*) as n from Attends group by class_id) t;

-- and the error if you try to nest aggregates directly
select avg(count(*)) from Attends group by class_id;
```
