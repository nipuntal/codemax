# Question 16

### The "best in each group" pattern

```sql
where z.nstudents = (select max(z2.nstudents) from q16sizes z2
                     where z2.course = z.course)
```

Read it as: *for each class, is your size equal to the biggest size among
classes of **your own** course?* The link `z2.course = z.course` is what makes it
per-course rather than global — that's a **correlated** subquery.

Ties are handled correctly for free: if two classes share the biggest size, both
answer "yes".

**Memorise this shape.** It answers "the fastest finisher in each event", "the
most expensive product in each category", "the biggest class in each course".

### Why the helper view

You cannot write `where count(*) = max(count(*))`. Aggregates don't nest,
because the inner one has already collapsed the rows the outer one needs.

The fix is always: **compute the first level of aggregation into a named
intermediate, then filter that.** A view, a `with` clause, or a subquery in
`from` all work. The exam explicitly allows helper views —
*"place any additional views used by q16 in this file"* — so use one.

### The window-function alternative

```sql
select course, ctype, day, starts, room, nstudents from (
    select c.course, c.ctype, c.day_of_week as day, c.start_time as starts,
           m.name as room, count(*) as nstudents,
           rank() over (partition by c.course order by count(*) desc) as k
    from   Classes c join Attends a on a.class_id = c.id
                     join Rooms m on c.held_in = m.id
    group  by c.id, c.course, c.ctype, c.day_of_week, c.start_time, m.name
) t where k = 1 order by course, day, starts;
```

Equally correct. Note `rank()` and **not** `row_number()` — `row_number()` gives
tied rows different numbers and would drop one of them, which is precisely the
mistake the question is testing for.

### `drop view` order

`q16` depends on `q16sizes`, so `q16` must be dropped first — or use
`drop view if exists q16sizes cascade`, which takes dependants with it. The
template's `cascade` handles it either way.
