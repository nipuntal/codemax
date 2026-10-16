# Module 18 &nbsp;·&nbsp; SQL

## Choosing a value per row, and looking sideways


## LEARN FIRST

Two last SQL tools. Both let you say things that are awkward otherwise.

### `case` — an if/else inside a query

```sql
select name, capacity,
       case when capacity < 30  then 'small'
            when capacity < 100 then 'medium'
            else                     'large'
       end as size
from   Rooms;
```

The conditions are tested **in order**; the first true one wins. `else` catches
whatever is left — leave it out and non-matching rows get `null`.

There is a shorter form when you are comparing one thing against values:

```sql
select case ctype when 'Lecture' then 'big group'
                  when 'Seminar' then 'big group'
                  else 'small group' end
from Classes;
```

### `case` inside a count — several counts of one pile

This is the useful one, and it builds directly on module 08.

```sql
select r.rtype,
       count(*) as total,
       count(case when r.capacity >= 100 then 1 end) as big,
       count(case when r.capacity <  100 then 1 end) as small
from   Rooms r
group  by r.rtype;
```

Why it works: `count` skips nulls (module 07), and a `case` with no matching
branch produces null. So each `count(case …)` counts only the rows that matched
— giving you **several different counts of the same pile in one pass**.

PostgreSQL has a tidier spelling of the same idea:

```sql
count(*) filter (where r.capacity >= 100) as big
```

Both are fine. `filter` is easier to read; `case` works on more databases.

### Window functions — a group figure beside every row

A `group by` gives you **one row per pile**. Sometimes you want to keep every
row *and* show a pile-level figure next to it.

```sql
select course, ctype, start_time,
       count(*) over (partition by course) as classes_in_course
from   Classes;
```

Every class keeps its own row, but each also carries how many classes its course
runs. The marker is `over (partition by …)`: *work this out within each group,
but do not merge the rows.*

```
without a window (group by)          with a window (partition by)
 course   | n                         course | ctype    | n
 ---------+---                        -------+----------+---
 COMP1000 | 7                         COMP1000|Lab Class| 7
 COMP1911 | 49                        COMP1000|Lab Class| 7
                                      COMP1000|Lecture  | 7
   2 rows                                 ... 7 rows ...
```

### Numbering and ranking

```sql
select course, start_time,
       rank()       over (partition by course order by start_time) as pos,
       row_number() over (partition by course order by start_time) as n
from   Classes;
```

| function | on a tie |
|---|---|
| `row_number()` | numbers them arbitrarily: 1, 2, 3, 4 |
| `rank()` | same number, then a gap: 1, 2, 2, 4 |
| `dense_rank()` | same number, no gap: 1, 2, 2, 3 |

For "which came first", **use `rank()`** — `row_number()` would invent a winner
out of a genuine tie, which is the mistake modules 13 and 14 kept warning about.

### The catch

You cannot filter on a window function in `where` or `having` — they are worked
out **after** both. Wrap the query and filter outside:

```sql
select * from (
    select course, ctype, start_time,
           rank() over (partition by course order by start_time) as pos
    from   Classes
) t
where pos <= 2;
```

That gives the two earliest classes in every course — genuinely awkward without
windows, and now three lines.

---

## THE TASK

**View** `q18(rtype, nrooms, small, medium, large, avg_seats)` — a size profile
of each kind of room.

| column | meaning |
|---|---|
| `nrooms` | how many rooms of that type |
| `small` | how many have capacity **under 30** |
| `medium` | how many have capacity **30 to 99** |
| `large` | how many have capacity **100 or more** |
| `avg_seats` | average capacity, to one decimal place |

Sorted with the most rooms first, then by type name.

The three counts must add up to `nrooms` — use that as your own check.

## Hints

<details><summary>Hint 1</summary>

One `group by rtype`, then three conditional counts over the same pile.
</details>

<details><summary>Hint 2</summary>

`count(*) filter (where capacity < 30)`, or
`count(case when capacity < 30 then 1 end)`.
</details>

<details><summary>Hint 3</summary>

`rtype` is an enum, so sorting by it gives declaration order. The task asks for
most-rooms-first, so the count is the first sort key anyway.
</details>
