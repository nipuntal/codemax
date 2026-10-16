# Module 11 &nbsp;·&nbsp; SQL

## More than two tables, and a table joined to itself


## LEARN FIRST

### Adding a third table

You add tables one at a time. Each new `join` brings its own `on`:

```sql
select s.name, c.course, r.name
from   Students s
       join Attends a on a.student_id = s.id
       join Classes c on a.class_id   = c.id
       join Rooms   r on c.held_in    = r.id;
```

Follow the chain in the picture from module 00:

```
Students ── Attends ── Classes ── Rooms
```

You cannot jump straight from `Students` to `Classes`: there is no column
connecting them. `Attends` sits in the middle, holding one row per
student-and-class pairing, and it is what makes the link possible.

**When a join looks impossible, you are usually missing a middle table.** The
map is worth keeping beside you:

```
Facilities ── Has ── Rooms ── Classes ── Attends ── Students
```

To connect any two of those, join every table on the path between them.

### Aliases stop being optional

With four tables, `Students.name` and `Rooms.name` both exist. Without aliases
PostgreSQL cannot tell which `name` you mean and refuses:

```
ERROR:  column reference "name" is ambiguous
```

With aliases, `s.name` and `r.name` are unmistakable.

### Joining a table to itself

Sometimes you want to compare rows of one table with **other rows of the same
table** — "two classes in the same room at the same time", say.

Mention the table twice, with two different aliases:

```sql
select a.course, b.course, a.day_of_week, a.start_time
from   Classes a join Classes b
         on a.held_in     = b.held_in
        and a.day_of_week = b.day_of_week
        and a.start_time  = b.start_time
where  a.id < b.id;
```

Think of `a` and `b` as two independent fingers moving over the same table:

```
            a                                    b
 ┌────────┬──────────┬─────────┐      ┌────────┬──────────┬─────────┐
 │ 153200 │ COMP3441 │  1003   │◀─────│ 153200 │ COMP3441 │  1003   │
 │ 153201 │ COMP9441 │  1003   │      │ 153201 │ COMP9441 │  1003   │
 └────────┴──────────┴─────────┘      └────────┴──────────┴─────────┘
```

Every combination of one row from `a` and one from `b` is considered; the `on`
conditions keep only the interesting ones.

### The `a.id < b.id` trick

Without that last line you would get:

- every class paired with **itself** (same room, same day, same time —
  trivially true), and
- every real pair **twice**, once as (X, Y) and once as (Y, X)

`a.id < b.id` removes both in one stroke: it keeps exactly one copy of each
genuine pair and drops the self-pairings.

**Use it whenever the two sides mean the same thing** — "two classes that
clash", "two rooms of equal size". If the two sides mean *different* things —
"the class that ends and the one that starts after it" — then you do **not**
want it, because the roles already tell them apart.

### Joins multiply rows

This surprises people. A student attending 5 classes appears **5 times** after
joining to `Attends`:

```sql
select count(*) from Students;                                          -- 7784
select count(*) from Students s join Attends a on a.student_id = s.id;  -- 18917
```

So after a join, `count(*)` counts **pairings**, not things. If a question asks
"how many students", you almost certainly want `count(distinct s.id)` — module
07's lesson, now doing real work.

---

## THE TASK

Find rooms that are **double-booked**: two different classes in the same room,
on the same day, starting at the same hour.

**View** `q11(room, day, start_time, course1, course2)`, where `course1` is the
class with the smaller id.

Sorted by room name, then day, then start time, then the two course codes.

List each pair **once**.

## Hints

<details><summary>Hint 1</summary>

`Classes` twice with two aliases, plus `Rooms` once for the name.
</details>

<details><summary>Hint 2</summary>

The two classes mean the same kind of thing here, so you need the `a.id < b.id`
trick.
</details>

<details><summary>Hint 3</summary>

Three conditions in the `on`: same room, same day, same start time.
</details>
