# Question 13

```sql
select m.name, m.rtype, m.capacity, count(c.id)
from   Rooms m left join Classes c on c.held_in = m.id
where  m.capacity = (select max(capacity) from Rooms)
group  by m.id, m.name, m.rtype, m.capacity
order  by m.name
```

### Two rooms tie at 400

`BURROWS-TH` and `CLB-7`. Both must appear.

```sql
select name from Rooms order by capacity desc limit 1;   -- ONE room: WRONG
```

`limit 1` picks one arbitrarily and hides the other. The subquery pattern —
*"whose capacity equals the maximum capacity"* — returns everything that ties,
which is what "the biggest" means in English.

**Every past-paper question of this shape had ties in the answer.** Assume yours
does too.

### Why `left join` here

Both 400-seat rooms do have classes, so an inner join gives the same answer
today. But the question asks for the biggest room *and* its class count — if the
biggest room happened to be unused, an inner join would return **nothing at
all** and you'd have no idea why.

`left join` + `count(c.id)` (counting a column from the optional side, so nulls
give 0) is correct whatever the data holds.

### `group by m.id, ...`

Grouping by the primary key as well as the displayed columns. Room names happen
to be unique here; grouping by the key is right regardless and costs nothing.

### The other spelling

```sql
select ... from Rooms m ...
where m.capacity >= all (select capacity from Rooms)
```

`>= all` is equivalent and some people find it clearer. Both are fine.
