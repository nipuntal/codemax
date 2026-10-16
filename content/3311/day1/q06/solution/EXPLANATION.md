# Module 06

```sql
select day_of_week, course, ctype, end_time - start_time
from   Classes
where  end_time - start_time >= 3
order  by day_of_week, end_time - start_time desc, course
```

### Three sort keys, and why each is needed

- `day_of_week` — the enum, giving Mon→Fri without any effort
- `end_time - start_time desc` — longest first *within* each day
- `course` — the tie-breaker, because plenty of classes on the same day have the
  same length

Drop that last key and the rows with equal day and equal length come out in
arbitrary order. The check compares text exactly, so that is a test which passes
or fails at random. **Always finish an `order by` with something that makes it
decisive.**

### The same expression twice

`end_time - start_time` appears in the `where`, in the `select`, and in the
`order by`. That is normal and fine — SQL has no way to write it once and reuse
it inside the same query.

You might hope to write `order by hours` using the output name. PostgreSQL does
allow that in `order by` (though not in `where`), so this also works:

```sql
select day_of_week, course, ctype, end_time - start_time as hours
from   Classes
where  end_time - start_time >= 3
order  by day_of_week, hours desc, course;
```

Both are accepted. Note the `where` still has to spell the expression out,
because — as module 03 explained — `where` runs **before** `select`, so the
output name does not exist yet.

### "3 hours or more"

`>= 3`. Not `> 3`. Module 03's table of English-into-conditions applies every
time.

### Worth trying

```sql
select distinct day_of_week from Classes order by day_of_week;          -- week order
select distinct day_of_week::text from Classes order by 1;              -- alphabetical
select distinct end_time - start_time from Classes order by 1;          -- 1,2,3,4
select name, capacity from Rooms order by capacity desc limit 5;
```
