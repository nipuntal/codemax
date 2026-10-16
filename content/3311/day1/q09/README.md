# Module 09 &nbsp;·&nbsp; SQL

## Keeping only the groups you want


## LEARN FIRST

Module 08 made piles. Sometimes you only want *some* of them.

- **`where`** throws away **rows**, before the piles are made.
- **`having`** throws away **whole piles**, after.

```sql
select course, count(*)
from   Classes
group  by course
having count(*) > 20;
```

Only courses running more than 20 classes survive — four of the 83.

### Why `where` cannot do this

```sql
select course, count(*) from Classes where count(*) > 20 group by course;
```

```
ERROR:  aggregate functions are not allowed in WHERE
```

Recall the running order from module 08:

```
from  →  where  →  group by  →  having  →  select  →  order by
```

When `where` runs, the piles do not exist yet, so `count(*)` is meaningless.
`having` runs after the piles are made and can see their sizes.

### Both, in one query

They do different jobs and often appear together:

```sql
select course, count(*)
from   Classes
where  ctype = 'Lecture'          -- per row: keep only lectures
group  by course
having count(*) >= 3;             -- per pile: keep only courses with 3+ of them
```

Read it as: *of the lectures, which courses run at least three?*

**Deciding which clause a condition belongs in is the skill here.** Ask: is this
a fact about one row, or about a whole pile?

| the words | where it goes |
|---|---|
| "classes that start after 5pm" | `where` — a fact about one class |
| "courses with more than 20 classes" | `having` — a fact about a pile |
| "Monday classes" | `where` |
| "days with more than 100 classes" | `having` |

### `having` can test something you don't display

```sql
select course
from   Classes
group  by course
having max(end_time) > 19;
```

Perfectly legal — you filtered on the latest finish without showing it.

### And it can use several conditions

```sql
having count(*) >= 3 and max(end_time) <= 17
```

---

## THE TASK

Which courses have a **heavy teaching load**?

**View** `q09(course, nclasses, nhours, ndays)` over `Classes`, keeping only
courses that both

- run **more than 15** classes, **and**
- total **more than 30** hours of teaching

| column | meaning |
|---|---|
| `course` | the course code |
| `nclasses` | how many classes it runs |
| `nhours` | its total hours (sum of each class's length) |
| `ndays` | how many different days of the week it uses |

Most hours first, then by course code.

## Hints

<details><summary>Hint 1</summary>

Both conditions describe a whole pile, so both go in `having`, joined by `and`.
</details>

<details><summary>Hint 2</summary>

A class's length is `end_time - start_time` (module 02). Total hours is the
`sum` of that.
</details>

<details><summary>Hint 3</summary>

You can order by an aggregate: `order by sum(end_time - start_time) desc, course`.
</details>
