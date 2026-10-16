# Module 21 &nbsp;·&nbsp; PLpgSQL

## Walking through rows one at a time


## LEARN FIRST

Module 20 fetched **one** row into a variable. To visit **many** rows, you loop.

### Looping over a query

```sql
declare
    t record;
begin
    for t in select id, name from Rooms order by id
    loop
        raise notice 'room % is %', t.id, t.name;
    end loop;
```

- **`record`** is a variable whose shape is decided **when the query runs** —
  you do not declare its columns. Get at them with `t.column`.
- `end loop;` closes it.

You can also loop with a variable of a table's row type, when the query selects
whole rows of that table:

```sql
declare m Rooms;
begin
    for m in select * from Rooms loop … end loop;
```

### `raise notice` — the only way to print

PLpgSQL has no `print`. To see what is happening inside a function:

```sql
raise notice 'x = %', x;
raise notice 'x = %, y = %', x, y;
```

`%` is the placeholder, filled in order by the values after the comma. Notices
appear in psql as the function runs.

**Use this constantly while developing.** A function that returns the wrong
answer with no visibility inside is far harder to fix than one sprinkled with
notices.

### Counting loops

```sql
for i in 1..10 loop … end loop;
for i in reverse 10..1 loop … end loop;
```

### `while`

```sql
while n > 0 loop
    n := n - 1;
end loop;
```

### `exit` and `continue`

```sql
for t in select … loop
    if t.capacity is null then
        continue;              -- skip to the next row
    end if;
    if total > 1000 then
        exit;                  -- leave the loop entirely
    end if;
end loop;
```

### The most important lesson here

> **Do not do in a loop what SQL can do in a query.**

```sql
-- BAD: reads all 514 classes to find the ones you want
for t in select * from Classes
loop
    if t.day_of_week = 'Mon' then
        ... process t ...
    end if;
end loop;

-- GOOD: the database finds them
for t in select * from Classes where day_of_week = 'Mon'
loop
    ... process t ...
end loop;
```

Same answer. The first reads 514 rows, the second reads 88. With a real table of
ten million rows, the difference is a query that returns and one that does not.

The same applies to nested loops:

```sql
-- BAD
for a in select * from Classes loop
    for b in select * from Rooms loop
        if a.held_in = b.id then … end if;
    end loop;
end loop;

-- GOOD
for t in select * from Classes c join Rooms r on c.held_in = r.id loop
    …
end loop;
```

The bad version does 514 × 128 = 65,792 comparisons — exactly the nonsense
module 10 warned about. The good one lets the database do the join properly.

**A loop whose body is just an `if` on a column is a `where` clause that has not
been written yet.**

### When a loop genuinely is right

When you need to do something **procedural** per row: build up a string, keep a
running total that SQL cannot express, or make a decision that affects the next
step.

---

## THE TASK

Write a function that lists a room's timetable for one day, as a single line of
text.

```sql
create or replace function q21(_room integer, _day text) returns text
```

- no such room → `No such room`
- nothing on that day → `NAME: nothing on DAY`
- otherwise → `NAME: ` followed by the classes, comma-separated, in start-time
  order, each written `COURSE S-E`

```
q21(1003, 'Thu')  ->  MECH-G15: COMP1000 9-11, COMP1000 11-13, ...
q21(208,  'Fri')  ->  GOLDST-G01: nothing on Fri
q21(99999,'Mon')  ->  No such room
```

## Hints

<details><summary>Hint 1</summary>

Check the room first with `select … into` and `if not found` (module 20) — you
need its name for the other messages anyway.
</details>

<details><summary>Hint 2</summary>

Put the day filter and the ordering **in the query**, not in the loop body.
</details>

<details><summary>Hint 3</summary>

Handle the comma by testing whether your accumulated text is still empty:
`if out = '' then out := piece; else out := out || ', ' || piece; end if;`
</details>

<details><summary>Hint 4</summary>

`_day` arrives as `text` and `day_of_week` is an enum, so compare with
`day_of_week::text = _day`.
</details>
