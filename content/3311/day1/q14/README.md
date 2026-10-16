# Module 14 &nbsp;·&nbsp; SQL

## A subquery that looks at the current row


## LEARN FIRST

Every subquery in module 13 was self-contained: it did not care which outer row
was being considered, so it ran once.

A **correlated** subquery mentions a table from the query outside it. That means
it cannot be worked out once — it has to be re-run **for every outer row**.

### The shape

```sql
select c.course, c.day_of_week, c.start_time, r.name
from   Classes c join Rooms r on c.held_in = r.id
where  c.start_time = (select min(c2.start_time)
                       from   Classes c2
                       where  c2.held_in = c.held_in);
```

Look at `c2.held_in = c.held_in`. The inner query needs to know which row the
outer query is looking at right now. So for each class, PostgreSQL works out the
earliest start time **in that class's own room**, and compares.

Note the inner alias `c2` — the inner query uses `Classes` again, so it needs
its own name to tell "the row I am testing" apart from "all the rows I am
searching".

### The pattern worth memorising: the best in each group

```sql
-- the earliest class in each room
select c.held_in, c.course, c.start_time
from   Classes c
where  c.start_time = (select min(c2.start_time)
                       from Classes c2 where c2.held_in = c.held_in);
```

Read it as: *for each class, is your start time equal to the earliest start time
among classes in your own room?*

Ties are handled correctly for free — if two classes share the earliest time,
both answer yes and both appear.

This shape answers "the biggest class in each course", "the fastest runner in
each race", "the cheapest item in each category". You will use it a lot.

### `exists` — is there at least one?

`exists (subquery)` is true when the subquery gives back **at least one row**.
What is in those rows is irrelevant, which is why people write `select 1`.

```sql
-- rooms that have at least one class in them
select r.name
from   Rooms r
where  exists (select 1 from Classes c where c.held_in = r.id);
```

### `not exists` — is there none?

```sql
-- students scheduled for nothing
select s.name
from   Students s
where  not exists (select 1 from Attends a where a.student_id = s.id);
```

**`not exists` is the safe way to say "has no…".** Unlike `not in` (module 13)
it is completely immune to nulls, which is why this course prefers it.

### Three ways to say the same thing

```sql
-- students who attend something
select s.name from Students s
where  exists (select 1 from Attends a where a.student_id = s.id);

select name from Students
where  id in (select student_id from Attends);

select distinct s.name
from   Students s join Attends a on a.student_id = s.id;
```

All correct. The **join** version is usually fastest, but needs `distinct`,
because a student in five classes would otherwise appear five times (module 11).

For "has none", the join version does not work at all — you want `not exists`,
or the `left join … is null` idiom from module 12.

> **Theory pointer.** A correlated subquery may be re-run once per outer row,
> which can be very slow on a big table; a join usually gives the database more
> freedom to be clever. Theory module 37 covers this properly. The short version:
> *prefer a join when you have the choice, but write whichever you can get
> right.*

---

## THE TASK

For each room, which class in it starts **earliest** in the week — that is, has
the smallest start time of any class in that room?

**View** `q14(room, course, ctype, day, start_time)`.

If several classes in a room share that earliest start time, show them all.

Sorted by room name, then day, then course.

## Hints

<details><summary>Hint 1</summary>

The "best in each group" pattern above, with the room as the group.
</details>

<details><summary>Hint 2</summary>

The inner query needs its own alias for `Classes`, and must be linked with
`c2.held_in = c.held_in`.
</details>

<details><summary>Hint 3</summary>

Join to `Rooms` as well, so you can show and sort by the room's name.
</details>
