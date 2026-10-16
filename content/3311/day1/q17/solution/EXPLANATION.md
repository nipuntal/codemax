# Module 17

```sql
with sizes as (
    select c.id as class, c.course as course, count(*) as n
    from   Classes c join Attends a on a.class_id = c.id
    group  by c.id, c.course
)
select course, count(*), round(avg(n), 1)
from   sizes
group  by course
having avg(n) > (select avg(n) from sizes)
order  by avg(n) desc, course
```

### Why a helper was unavoidable

You cannot write

```sql
having avg(count(*)) > (select avg(count(*)) ...)
```

Aggregates do not nest — the inner one has already squashed the rows the outer
one needs. The fix is always the same: **name the first level, then aggregate
that.**

`sizes` is one row per class, holding its course and how many students it has.
Everything after that is ordinary grouping over an ordinary table.

### The CTE is used twice

Once in the `from`, and again inside `(select avg(n) from sizes)`. That is
exactly why naming it pays: writing the whole `group by` query out twice would
be longer and easy to get subtly inconsistent.

### Compare unrounded, display rounded

```sql
having avg(n) > (select avg(n) from sizes)     -- full precision
select ... round(avg(n), 1)                     -- one decimal place for display
order  by avg(n) desc                           -- full precision again
```

Rounding first and then comparing would put courses on the wrong side of the
line, and sorting on the rounded value would make ties arbitrary.

**Round at the last possible moment — for display only.**

### The same thing with views

```sql
create view sizes(class, course, n) as
    select c.id, c.course, count(*) from Classes c
    join Attends a on a.class_id = c.id group by c.id, c.course;

create view q17(course, nclasses, avg_size) as
    select course, count(*), round(avg(n),1) from sizes group by course
    having avg(n) > (select avg(n) from sizes)
    order by avg(n) desc, course;
```

Equally correct, and in a long exam answer a separate helper view can be
clearer, because you can inspect it on its own. The only cost is the extra object
left in the database — which is fine, and is what the exam expects.

### Worth trying

```sql
with sizes as (select class_id, count(*) as n from Attends group by class_id)
select round(avg(n),1) as overall_avg, min(n), max(n) from sizes;

-- inspect a helper before using it
create or replace view sizes(class, course, n) as
  select c.id, c.course, count(*) from Classes c
  join Attends a on a.class_id=c.id group by c.id, c.course;
select * from sizes order by n desc limit 5;
```
