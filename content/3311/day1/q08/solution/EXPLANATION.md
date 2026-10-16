# Module 08

```sql
select day_of_week, count(*), count(distinct course),
       min(start_time), max(end_time)
from   Classes
group  by day_of_week
order  by day_of_week
```

### Why `day_of_week` is allowed in the `select`

Because it is in the `group by`. Every row in a given pile has the same day —
that is what put them in the same pile. The rule from the LEARN FIRST section,
working exactly as described.

### `count(*)` and `count(distinct course)` side by side

Tuesday has 125 classes but far fewer distinct courses, because a course runs
several classes a day — a lecture and half a dozen tutorials.

This is the single most useful thing `group by` teaches: **two different counts
of the same pile answering two different questions.** "How many classes" and
"how many courses" are not the same number, and reading the question carefully
enough to know which is wanted is most of the work.

### The aggregates all describe their own pile

`min(start_time)` is the earliest start **on that day**, not across the week.
Each aggregate is computed within its pile, independently.

### `order by day_of_week` gives week order

Because it is an enum (module 06). If it had been ordinary text you would have
got Fri, Mon, Thu, Tue, Wed, and would have needed something clumsy to fix it.
Worth noticing which columns in this schema are enums — it changes what ordering
means for free.

### Worth trying

```sql
-- one pile per (day, kind of class)
select day_of_week, ctype, count(*) from Classes
group by day_of_week, ctype order by day_of_week, ctype;

-- filter rows first, then pile them
select ctype, count(*) from Classes
where day_of_week = 'Mon' group by ctype order by ctype;

-- and watch the error the rule predicts
select day_of_week, course, count(*) from Classes group by day_of_week;
```
