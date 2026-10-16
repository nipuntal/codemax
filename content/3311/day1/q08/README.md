# Module 08 &nbsp;·&nbsp; SQL

## One answer per group


## LEARN FIRST

Module 07 ended with an error:

```sql
select name, count(*) from Rooms;    -- ERROR
```

`group by` is how you say *what the count should be counted per*.

```sql
select rtype, count(*)
from   Rooms
group  by rtype;
```

Picture it as sorting the rows into piles, then reporting one line per pile:

```
   Rooms                              piles                     result
 ┌──────────────────┐
 │ ... Tutorial ... │ ─┐
 │ ... Lecture  ... │  │   Tutorial Room  ──▶ 99 rows  ──▶  Tutorial Room  | 99
 │ ... Tutorial ... │  ├─▶ Lecture Theatre──▶ 18 rows  ──▶  Lecture Theatre| 18
 │ ... Computer ... │  │   Computer Lab   ──▶ 10 rows  ──▶  Computer Lab   | 10
 │ ... Meeting  ... │ ─┘   Meeting Room   ──▶  1 row   ──▶  Meeting Room   |  1
 └──────────────────┘
```

### The rule

> Everything in your `select` must either be **named in the `group by`**, or be
> **inside an aggregate**.

That is forced by what a pile is. Once you have piled 99 rooms together, `rtype`
is safe — all 99 share it, that is why they are in the same pile. But `name` is
not: there are 99 different ones.

```sql
select rtype, name, count(*) from Rooms group by rtype;          -- ERROR
select rtype, count(*), max(name) from Rooms group by rtype;     -- fine
```

### Grouping on several columns

```sql
select rtype, capacity, count(*)
from   Rooms
group  by rtype, capacity;
```

One pile per **combination** — per (type, capacity) pair.

### Where `where` fits

`where` runs **before** the grouping, so it removes individual rows before the
piles are made:

```sql
select ctype, count(*)
from   Classes
where  day_of_week = 'Mon'
group  by ctype;
```

*Of the Monday classes, how many of each kind?*

The full running order is worth memorising:

```
from  →  where  →  group by  →  select  →  order by
```

It explains a lot. It is why `where` cannot use an output name from `select`
(that has not run yet), and why `order by` can.

### Sorting the groups

`order by` goes at the end, as always, and can use a grouped column or an
aggregate:

```sql
select ctype, count(*)
from   Classes
group  by ctype
order  by count(*) desc, ctype;
```

### Grouping by something computed

Anything you can write, you can group by:

```sql
select end_time - start_time, count(*)
from   Classes
group  by end_time - start_time
order  by 1;
```

---

## THE TASK

How is teaching spread across the week?

**View** `q08(day, nclasses, ncourses, first_start, last_end)` over `Classes`:

| column | meaning |
|---|---|
| `day` | the day of the week |
| `nclasses` | how many classes run that day |
| `ncourses` | how many **different** courses have a class that day |
| `first_start` | the earliest start hour that day |
| `last_end` | the latest end hour that day |

In week order.

## Hints

<details><summary>Hint 1</summary>

One row per day means `group by day_of_week`. Everything else is an aggregate.
</details>

<details><summary>Hint 2</summary>

`ncourses` needs `count(distinct ...)` — a course runs many classes in a day.
</details>

<details><summary>Hint 3</summary>

Week order comes free from the enum (module 06), so `order by day_of_week`.
</details>
