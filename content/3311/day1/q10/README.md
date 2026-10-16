# Module 10 &nbsp;·&nbsp; SQL

## Putting two tables side by side


## LEARN FIRST

`Classes` tells you that class 152992 is held in room **1003**. That number is
useless on its own — which room is 1003? The name lives in `Rooms`.

Module 00 called `held_in` a **foreign key**: a column holding an id from
another table. A **join** is how you follow it.

### The picture

A join lines the two tables up and glues matching rows together, side by side:

```
         Classes                                 Rooms
 ┌────────┬──────────┬─────────┐        ┌──────┬────────────┬──────────┐
 │   id   │  course  │ held_in │        │  id  │    name    │ capacity │
 ├────────┼──────────┼─────────┤        ├──────┼────────────┼──────────┤
 │ 152992 │ COMP1000 │  1003   │        │ 1003 │ MECH-G15   │    30    │
 │ 153095 │ COMP1927 │   209   │        │  209 │ GOLDST-G02 │    20    │
 └────────┴──────────┴─────────┘        └──────┴────────────┴──────────┘

              join ... on Classes.held_in = Rooms.id

                            ▼   glued together, one row per match

 ┌────────┬──────────┬─────────┬──────┬────────────┬──────────┐
 │   id   │  course  │ held_in │  id  │    name    │ capacity │
 ├────────┼──────────┼─────────┼──────┼────────────┼──────────┤
 │ 152992 │ COMP1000 │  1003   │ 1003 │ MECH-G15   │    30    │
 │ 153095 │ COMP1927 │   209   │  209 │ GOLDST-G02 │    20    │
 └────────┴──────────┴─────────┴──────┴────────────┴──────────┘
```

Each result row is **one row from the left plus one row from the right**, and
you can then select columns from either side.

### The syntax

```sql
select Classes.course, Rooms.name
from   Classes join Rooms on Classes.held_in = Rooms.id;
```

`on` is the **matching rule** — it says which left row belongs with which right
row.

### Short names for the tables

Give each table a nickname straight after it:

```sql
select c.course, r.name
from   Classes c join Rooms r on c.held_in = r.id;
```

`c` and `r` are **aliases**. Use them from the start — once a query has three
tables the full names become unreadable.

### Where does the matching rule come from?

From the foreign keys. Module 00 listed all five:

```
Classes.held_in     ──▶ Rooms.id
Attends.student_id  ──▶ Students.id
Attends.class_id    ──▶ Classes.id
Has.room_id         ──▶ Rooms.id
Has.facility_id     ──▶ Facilities.id
```

**Almost every join in this course is one of those five.** When you need to
connect two tables, look for the foreign key between them.

### `on` versus `where`

Keep them separate in your head:

- **`on`** says how the two tables line up.
- **`where`** says which of the resulting rows you want.

```sql
select c.course, c.day_of_week, r.name
from   Classes c join Rooms r on c.held_in = r.id
where  r.rtype = 'Computer Lab'
  and  c.day_of_week = 'Mon';
```

Everything from modules 03 and 04 works on the glued-together rows.

### What happens to rows with no partner

If a class's room did not exist, that class would simply **not appear** in the
result. A join keeps only the rows that find a match on both sides.

Here that never happens — `held_in` is a foreign key, so the room always
exists. But it is worth knowing that a join can lose rows, because sometimes
that is what you want and sometimes it is not.

### The mistake that produces nonsense

```sql
select * from Classes, Rooms;         -- no matching rule at all
```

That glues **every** class to **every** room: 514 × 128 = 65,792 rows of
garbage. If a query returns a wildly implausible number of rows, a missing `on`
is the first thing to check.

---

## THE TASK

**View** `q10(course, ctype, day, span, room, rtype, capacity)` — every class
that is held in a **Computer Lab**, with details of the room it uses.

| column | meaning |
|---|---|
| `span` | text like `9-11`, as in module 02 |

Sorted by day (week order), then start time, then room name.

## Hints

<details><summary>Hint 1</summary>

Two tables, joined on `Classes.held_in = Rooms.id`.
</details>

<details><summary>Hint 2</summary>

`rtype` lives in `Rooms`, so the condition on it goes in the `where`, using the
alias you gave that table.
</details>

<details><summary>Hint 3</summary>

You can sort by a column you did not select — `c.start_time` — because sorting
happens on the joined rows, before the columns are picked.
</details>
