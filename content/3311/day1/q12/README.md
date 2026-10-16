# Module 12 &nbsp;·&nbsp; SQL

## Keeping rows that have no partner


## LEARN FIRST

Module 10 mentioned it in passing: a join keeps only rows that find a match. If
a student attends no classes, then

```sql
select s.name, a.class_id
from   Students s join Attends a on a.student_id = s.id;
```

simply leaves them out. Eleven students in our database are like that.

If the question is *"how many classes is each student in?"*, silently dropping
those eleven is wrong — they should show **0**.

### `left join`

```sql
select s.name, a.class_id
from   Students s left join Attends a on a.student_id = s.id;
```

**Every row of the left table survives**, matched or not. Where there is no
match, the right table's columns come back as **null** — module 05's value that
isn't.

```
        Students                Attends            left join result
 ┌─────────┬─────────────┐   ┌────────┬───────┐
 │ 5345678 │ Andrew      │──▶│5345678 │153307 │──▶ Andrew   | 153307
 │ 5348827 │ Amy Benesh  │   │        │       │──▶ Amy      |  (null)   ← kept!
 └─────────┴─────────────┘   └────────┴───────┘
                              no row for Amy
```

- `left join` — keep everything from the left
- `right join` — keep everything from the right
- `full join` — keep everything from both

In practice you will write `left join` nearly every time, because you can always
put the table you care about on the left.

### The trap

```sql
select s.name, count(*)
from   Students s left join Attends a on a.student_id = s.id
group  by s.id, s.name;
```

Amy reports **1**. There is no class — but there *is* a row, one row full of
nulls, and `count(*)` counts rows.

The fix is to count a column from the **right-hand** table:

```sql
select s.name, count(a.class_id)
from   Students s left join Attends a on a.student_id = s.id
group  by s.id, s.name;
```

`count(column)` skips nulls (module 07), so Amy now reports **0**.

> **After a `left join`, count something from the optional side — never
> `count(*)`.** This is the single most common outer-join mistake, and it is
> examinable.

The same applies to `sum`: the sum of no rows is **null**, not 0, so you often
want `coalesce(sum(x), 0)` — module 05's tool.

### The second trap: a `where` that undoes the outer join

```sql
select s.name, c.course
from   Students s left join Attends a on a.student_id = s.id
       left join Classes c on a.class_id = c.id
where  c.ctype = 'Lecture';
```

Amy comes through the joins with `c.ctype` null. Then `null = 'Lecture'` is
*unknown*, so the `where` throws her out — turning your outer join back into an
ordinary one.

If the condition is about the **optional** table, put it in the `on`:

```sql
left join Classes c on a.class_id = c.id and c.ctype = 'Lecture'
```

**Condition about the optional side ⇒ `on`. Condition about the required side ⇒
`where`.**

### Finding the rows with no partner at all

```sql
select s.name
from   Students s left join Attends a on a.student_id = s.id
where  a.student_id is null;
```

Bring everything across, then keep only the ones where the match failed. This is
the standard way to ask "which X has no Y?".

---

## THE TASK

How well equipped is each room?

**View** `q12(room, rtype, capacity, nfacilities, nitems)` over **every** room —
including any with no facilities recorded.

| column | meaning |
|---|---|
| `nfacilities` | how many different facilities the room has (**0** if none) |
| `nitems` | the total number of items across those facilities (**0** if none) |

Sorted by `nfacilities` descending, then room name.

## Hints

<details><summary>Hint 1</summary>

`Rooms` on the left, `left join Has`. Every room must survive.
</details>

<details><summary>Hint 2</summary>

`count(*)` would give 1 for an unequipped room. Count something from `Has`.
</details>

<details><summary>Hint 3</summary>

`sum` of no rows is null, so `nitems` needs `coalesce(sum(h.nitems), 0)`.
</details>
