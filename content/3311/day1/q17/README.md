# Module 17 &nbsp;·&nbsp; SQL

## Naming a piece of a query


## LEARN FIRST

Module 00 introduced views as the way you hand in an answer. They are also the
main tool for **breaking a hard query into steps**, which is what this module is
really about.

### A view is a saved query

```sql
create view BigRooms(room, seats) as
select name, capacity from Rooms where capacity > 200;
```

From then on the name behaves like a table:

```sql
select count(*) from BigRooms;
select * from BigRooms where seats > 300;
```

It stores **no data**. Each time you use it, the query runs again.

### Two ways to name the columns

```sql
create view v(a, b) as select x, y from T;              -- names in brackets
create view v      as select x as a, y as b from T;     -- names via `as`
```

This course uses the first for answers, because it puts the promised output
columns right next to the view's name.

### `create or replace`, and its limit

```sql
create or replace view v(a, b) as select x, y from T;
```

replaces the definition **only if the shape is unchanged** — same number of
columns, same types. To change the shape you must `drop view v;` first.

That is exactly why every template in this course starts with

```sql
drop view if exists q17 cascade;
```

`if exists` stops it complaining the first time; `cascade` also drops anything
built on top of this view.

You cannot `insert` or `update` through a view. Views are for reading.

### Their real value: building up

Instead of one enormous query, define the pieces:

```sql
create view ClassSize(class, course, nstudents) as
select c.id, c.course, count(*)
from   Classes c join Attends a on a.class_id = c.id
group  by c.id, c.course;

create view BigClasses(course, nstudents) as
select course, nstudents from ClassSize where nstudents > 100;

select * from BigClasses order by nstudents desc;
```

Each piece is testable on its own — you can `select * from ClassSize limit 5;`
and see whether it is right before going further.

> **When a question looks impossible, ask: what table would make this easy? Then
> build that table as a view.**

The exam allows this explicitly. Its SQL questions say *"place any additional
views used by q1 in this file"* — helper views are expected, not merely
tolerated.

### `with` — a helper that lives for one query

If you only need the helper once, `with` defines it inline:

```sql
with ClassSize as (
    select c.id as class, c.course, count(*) as nstudents
    from   Classes c join Attends a on a.class_id = c.id
    group  by c.id, c.course
)
select course, count(*), max(nstudents)
from   ClassSize
group  by course
order  by course;
```

Advantages over a view: nothing is left behind in the database, and you can
define several, comma-separated, each able to use the ones before it:

```sql
with A as ( … ),
     B as ( select … from A … ),
     C as ( select … from B … )
select … from C;
```

That last shape turns a genuinely hard question into a readable pipeline, and it
is the most useful thing in this module.

### It solves the aggregate-of-aggregate problem

Module 13 showed that

```sql
select avg(count(*)) from Attends group by class_id;      -- ERROR
```

does not work. With a name for the first level, it becomes easy:

```sql
with sizes as (select class_id, count(*) as n from Attends group by class_id)
select round(avg(n), 1), min(n), max(n) from sizes;
```

**Compute the first level into a named intermediate, then work on that.**

---

## THE TASK

Which courses have unusually **large** classes?

For each course, work out the average size of its classes. Report only the
courses whose average is **above the average class size across the whole
database**.

**View** `q17(course, nclasses, avg_size)`:

| column | meaning |
|---|---|
| `nclasses` | how many classes the course runs |
| `avg_size` | its average class size, to **one** decimal place |

Biggest average first, then by course code.

## Hints

<details><summary>Hint 1</summary>

You need an average compared against an **average of averages**. That cannot be
done in one step — build the per-class sizes first with `with` (or a helper
view).
</details>

<details><summary>Hint 2</summary>

```sql
with sizes as (
    select c.id, c.course, count(*) as n
    from Classes c join Attends a on a.class_id = c.id
    group by c.id, c.course
)
select ... from sizes group by course
having avg(n) > (select avg(n) from sizes)
```
</details>

<details><summary>Hint 3</summary>

`round(avg(n), 1)` for the output, but compare on the unrounded `avg(n)`.
</details>
