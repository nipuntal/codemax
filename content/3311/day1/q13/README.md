# Module 13 &nbsp;·&nbsp; SQL

## A query inside another query


## LEARN FIRST

A **subquery** is a `select` written inside another one, in brackets. It runs
first, and its answer is used by the outer query.

### Giving back one value

```sql
select name, capacity
from   Rooms
where  capacity = (select max(capacity) from Rooms);
```

The inner query works out `400`. The outer one then behaves as if you had typed
`where capacity = 400`.

**This is how you answer "which is the biggest?"** — and it matters that you do
it this way. Compare:

```sql
select name from Rooms order by capacity desc limit 1;    -- ONE room
```

Two rooms share the maximum capacity of 400 — `BURROWS-TH` and `CLB-7`. The
`limit 1` version silently picks one and hides the other. The subquery version
returns both, which is what "the biggest" means in English.

Exam questions about "the largest / oldest / busiest X" are usually built with a
deliberate tie, precisely to see whether you noticed.

### Giving back a list — `in`

```sql
select course, ctype
from   Classes
where  held_in in (select id from Rooms where rtype = 'Computer Lab');
```

The inner query produces a list of room ids; `in` checks membership.

`not in` is the negation — with one catch worth knowing now:

> If the inner list contains a **null**, `not in` gives *unknown* for every row
> and you get **no rows at all**. (Module 05: unknown spreads.) Plain `in` is
> fine with nulls; `not in` is not.

Here the ids can never be null, so it is safe. Just remember the rule.

### `any` and `all`

```sql
where capacity > all (select capacity from Rooms where rtype = 'Computer Lab')
where capacity > any (select capacity from Rooms where rtype = 'Computer Lab')
```

- `> all` — bigger than every one of them
- `> any` — bigger than at least one

`= any` is exactly `in`. These read nicely, but you can always rewrite them
with `max`/`min`, which most people find clearer.

### A subquery used as a table

You can put one in the `from` clause. It **must** be given a name:

```sql
select avg(n)
from   (select class_id, count(*) as n from Attends group by class_id) as sizes;
```

That works out the average class size — an average **of counts**, which you
cannot write in one step, because

```sql
select avg(count(*)) from Attends group by class_id;    -- ERROR
```

Aggregates do not nest: the inner one has already squashed the rows the outer
one would need.

**So: when you need to aggregate over the results of an aggregate, compute the
first level into a named intermediate, then work on that.** It is one of the
most useful moves in SQL and it comes up constantly.

The `as sizes` is compulsory — without a name you get a syntax error.

### Where subqueries can appear

| position | must give back |
|---|---|
| `where x = (…)` | exactly one value |
| `where x in (…)` | one column, any number of rows |
| `from (…) as t` | a whole table |
| in the `select` list | exactly one value, per row |

---

## THE TASK

Which classes are held in the **biggest rooms on campus** — that is, rooms whose
capacity equals the largest capacity of any room?

**View** `q13(room, capacity, course, ctype, day, start_time)`.

Sorted by room name, then day, then start time, then course.

Remember there is more than one such room.

## Hints

<details><summary>Hint 1</summary>

A join (module 10) plus a condition using a subquery for the maximum.
</details>

<details><summary>Hint 2</summary>

`where r.capacity = (select max(capacity) from Rooms)`.
</details>

<details><summary>Hint 3</summary>

Do **not** use `order by capacity desc limit 1` — you would lose one of the two
rooms.
</details>
