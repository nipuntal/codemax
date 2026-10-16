# Question 15

### The three-branch skeleton, in full

```sql
select * into m from Rooms where id = _room;
if not found then
    return next 'No such room';
    return;                      -- <-- do not forget this
end if;
... loop, counting ...
if n = 0 then return next 'Nothing in ' || m.name || ' on ' || _day; end if;
return;
```

**The bare `return;` after the error line is essential.** In a `setof`-returning
function, `return next` does *not* stop execution — it appends a row and carries
on. Without the `return;` you would emit `No such room` and then fall into the
loop and the `n = 0` test, producing two lines.

That is the single most common bug in this question shape.

### Why look the room up even though you don't display it

Two reasons: to detect "no such room", and because the *second* message needs
the room's **name**, which you only have because you fetched the row. Fetching
into `m Rooms` gets you both from one query.

### Comparing text against an enum

`_day` is declared `text`, and `c.day_of_week` is `Weekday`. Three options:

```sql
c.day_of_week::text = _day      -- cast the column to text   (used here)
c.day_of_week = _day::Weekday   -- cast the parameter to the enum
```

The second is faster (it can use an index and compares enums directly) but
**raises an error** if `_day` isn't a valid weekday — `'Sunday'` would abort the
function rather than reporting nothing. The first quietly returns no rows, which
here produces the friendly `Nothing in ...` message.

Which you want depends on the spec. When it doesn't say, the forgiving one is
the safer choice.

### The student count

```sql
(select count(*) from Attends a where a.class_id = c.id) as nstu
```

A correlated subquery in the select list — one value per row. The alternative is
`join Attends ... group by ...`, which works but forces you to group by every
displayed column. For a single scalar the subquery is shorter and clearer.
