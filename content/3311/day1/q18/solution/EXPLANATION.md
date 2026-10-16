# Module 18

```sql
select rtype,
       count(*),
       count(*) filter (where capacity < 30),
       count(*) filter (where capacity between 30 and 99),
       count(*) filter (where capacity >= 100),
       round(avg(capacity), 1)
from   Rooms
group  by rtype
order  by count(*) desc, rtype
```

### Four counts, one pass

`filter` restricts an aggregate to the rows matching its condition, within the
same pile. No second query, no second scan.

The `case` spelling is identical in effect:

```sql
count(case when capacity < 30 then 1 end)
```

A `case` with no `else` yields null for the rows that do not match, and `count`
skips nulls (module 07). Worth knowing both — `case` is the portable one.

### The self-check

The three bands must sum to `nrooms`, because the conditions
`< 30`, `30..99` and `>= 100` partition every possible capacity with no gap and
no overlap. If your three columns do not add up, your bands are wrong.

Notice `between 30 and 99` **includes both ends** (module 03), which is exactly
what "30 to 99" means. Getting the boundaries right is most of the work in a
banding question.

### Why the boundaries were chosen carefully

The task said "under 30", "30 to 99", "100 or more". Three phrasings, three
different comparison operators:

```
under 30      →  < 30
30 to 99      →  between 30 and 99
100 or more   →  >= 100
```

Module 03's English-into-conditions table, still earning its keep.

### `order by count(*) desc, rtype`

Most rooms first. Tutorial Room has 99, so it leads. The `, rtype` tie-break is
there in case two types ever have the same count — and because an ordering
should always be decisive.

### Worth trying

```sql
-- the case version, to compare
select rtype, count(*), count(case when capacity < 30 then 1 end)
from Rooms group by rtype order by rtype;

-- a window: every class, plus how many its course runs
select course, ctype, count(*) over (partition by course) as in_course
from Classes order by course limit 10;

-- top 2 earliest classes per course
select * from (
  select course, ctype, start_time,
         rank() over (partition by course order by start_time) as pos
  from Classes) t
where pos <= 2 order by course, pos limit 10;
```
