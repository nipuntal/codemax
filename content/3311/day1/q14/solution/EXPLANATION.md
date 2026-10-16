# Module 14

```sql
select r.name, c.course, c.ctype, c.day_of_week, c.start_time
from   Classes c join Rooms r on c.held_in = r.id
where  c.start_time = (select min(c2.start_time)
                       from   Classes c2
                       where  c2.held_in = c.held_in)
order  by r.name, c.day_of_week, c.course
```

### Reading the correlation

For each class row the outer query considers, the inner query asks: *what is the
smallest start time among all classes held in **this same room**?* The link is
`c2.held_in = c.held_in` — `c2` is the inner finger, `c` the outer one.

Then `c.start_time = (that minimum)` keeps only the earliest ones.

### Why ties come out right

We are not asking for "the first row when sorted". We are asking "is your start
time equal to the best start time?" If three classes in a room all start at 9,
all three answer yes, and all three appear.

That is the difference between this pattern and `order by ... limit 1`, and it
is why module 13 warned you off `limit`.

### The join does not affect the subquery

`join Rooms r` is there purely so we can show and sort by the room's **name**.
The subquery works entirely on `held_in` — the id — and never touches `Rooms`.

Keeping those two jobs separate in your head makes long queries much easier to
build: *joins are for getting the columns you want to display; the `where` is
for choosing rows.*

### Cost, and the alternative

This subquery is re-run for each of the 514 classes. On this data that is
nothing. On a table of ten million rows it would matter, and you would prefer a
form that lets the database compute each room's minimum once.

There is a tidier way to write "compute a per-group minimum, then match against
it", but it needs a tool we have not met. For now this pattern is correct and
perfectly reasonable.

### Worth trying

```sql
-- rooms whose earliest class starts at 9
select distinct r.name from Classes c join Rooms r on c.held_in=r.id
where c.start_time = (select min(c2.start_time) from Classes c2 where c2.held_in=c.held_in)
  and c.start_time = 9;

-- exists / not exists
select count(*) from Rooms r where exists (select 1 from Classes c where c.held_in=r.id);
select count(*) from Students s where not exists (select 1 from Attends a where a.student_id=s.id);
```
