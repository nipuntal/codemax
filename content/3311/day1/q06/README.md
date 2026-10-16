# Module 06 &nbsp;·&nbsp; SQL

## Putting the rows in order


## LEARN FIRST

Up to now the rows have come back in whatever order the database felt like.
That is genuinely arbitrary — it can change between runs.

### `order by`

```sql
select name, capacity from Rooms order by capacity;
```

Smallest first. For largest first, add `desc`:

```sql
select name, capacity from Rooms order by capacity desc;
```

`asc` (ascending) is the default and hardly ever written. `desc` is descending.

### Sorting by more than one thing

When the first sort key has repeats, the order among those repeats is
**arbitrary** unless you say more. Our rooms have plenty of repeats — 99 of the
128 are Tutorial Rooms, and lots share a capacity:

```sql
select name, capacity from Rooms order by capacity desc, name;
```

Now: biggest first, and rooms of equal capacity are put in name order.

> **This matters more than it sounds.** The checks in this course compare your
> output as *text*, line by line. If two rows could come out in either order,
> your answer passes today and fails tomorrow. **Whenever your sort key has
> duplicates, add a tie-breaker.** An `id` is always a safe last resort, because
> it is unique (module 00, section 3).

You can mix directions — each key carries its own:

```sql
order by capacity desc, name asc
```

### Sorting by something you computed

```sql
select course, end_time - start_time as hours
from   Classes
order  by end_time - start_time desc, course;
```

You can also sort by an output column's **position**:

```sql
order by 2 desc, 1
```

Handy in a hurry, but fragile — insert a column and the numbers all shift.
Prefer naming things.

### The enum surprise, in your favour

`day_of_week` holds `Mon`…`Fri`, and it is an **enumerated type** (module 00,
section 6). Enums sort by the order they were *declared in*, not alphabetically:

```sql
select distinct day_of_week from Classes order by day_of_week;
-- Mon, Tue, Wed, Thu, Fri
```

Alphabetical order would have given Fri, Mon, Thu, Tue, Wed. So ordering by
`day_of_week` gives you week order for free. The same is true of `rtype` and
`ctype`.

If you ever *want* alphabetical order from an enum, convert it first with
`::text` (module 02).

### `distinct` — one of each

```sql
select course from Classes;             -- 514 rows, lots of repeats
select distinct course from Classes;    -- 83 rows, one per course
```

`distinct` removes duplicate **rows**, judging by all the selected columns
together:

```sql
select distinct course, ctype from Classes;   -- distinct PAIRS
```

It costs work (the database has to sort or hash to find the duplicates), so
don't scatter it about when the result is already unique.

### `limit` — stop after n rows

```sql
select name, capacity from Rooms order by capacity desc limit 3;
```

Useful for exploring. Be careful using it in an answer: if the question asks
"which room is biggest" and two rooms tie, `limit 1` silently throws one away.
Only use it when a question asks for a fixed number of rows.

---

## THE TASK

**View** `q06(day, course, ctype, hours)` over `Classes`, listing only the
classes that run for **3 hours or more**.

Sorted: by day in week order, then longest first, then by course code.

## Hints

<details><summary>Hint 1</summary>

The filter is module 03's territory: a condition on `end_time - start_time`.
</details>

<details><summary>Hint 2</summary>

Three sort keys. The first is the enum, so plain `day_of_week` gives week order.
</details>

<details><summary>Hint 3</summary>

`order by day_of_week, end_time - start_time desc, course`
</details>
