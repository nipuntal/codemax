# Module 22 &nbsp;·&nbsp; PLpgSQL

## Giving back many rows instead of one


## LEARN FIRST

Modules 19–21 returned a single value. Often you want a **list of lines**, or a
whole table.

### `returns setof text` — a list of lines

This is the shape the exam uses most.

```sql
create or replace function bigRooms(_min integer) returns setof text
as $$
declare
    r record;
begin
    for r in select name, capacity from Rooms
             where capacity >= _min order by name
    loop
        return next r.name || ' seats ' || r.capacity;
    end loop;
    return;
end;
$$ language plpgsql;
```

Use it in a `from` clause, like a table:

```sql
select * from bigRooms(300);
```

- **`return next EXPR`** adds **one** value to the result and **carries on**.
  It does not stop the function.
- **`return;`** on its own says "no more rows". Optional in most cases, but
  clearer.

### `return query` — add a whole query's worth at once

```sql
create or replace function bigRooms(_min integer) returns setof text
as $$
begin
    return query
        select name || ' seats ' || capacity
        from   Rooms where capacity >= _min order by name;
    return;
end;
$$ language plpgsql;
```

Much shorter. **If your function body is one query, use `return query` and do
not write a loop.**

The loop version earns its place when you need to count as you go, or decide
something between rows — which the task below needs.

### Other shapes you can return

```sql
returns setof Rooms                    -- whole rows of an existing table
returns table(room text, seats integer) -- columns you describe inline
```

With `returns table(a, b)`, the names `a` and `b` become **variables** you assign
before each `return next;`:

```sql
create or replace function f() returns table(room text, seats integer)
as $$
declare r record;
begin
    for r in select name, capacity from Rooms loop
        room  := r.name;        -- assign the output columns...
        seats := r.capacity;
        return next;            -- ...then emit a row (nothing after `next`)
    end loop;
end;
$$ language plpgsql;
```

For exam answers, `returns setof text` is usually what is asked for, because it
lets the question specify the exact wording of each line.

### The three-branch skeleton

Nearly every exam question of this kind wants:

1. a single line saying the thing does not exist,
2. a single line saying there is nothing to report,
3. otherwise, one formatted line per row.

```sql
create or replace function qN(_x integer) returns setof text
as $$
declare
    r  record;
    n  integer := 0;
begin
    -- does it exist?  (module 20)
    ...
    if not found then
        return next 'No such thing';
        return;                      -- <-- ESSENTIAL
    end if;

    for r in <the query> loop
        n := n + 1;
        return next <a formatted line>;
    end loop;

    if n = 0 then
        return next 'Nothing to report';
    end if;
    return;
end;
$$ language plpgsql;
```

> **The bare `return;` after the error line is essential.** `return next` does
> **not** stop the function — it appends a row and keeps going. Leave the
> `return;` out and you emit `No such thing` and then fall into the loop as
> well.

That is the single most common bug in this shape.

### Counting as you go

The `n` counter is how you know whether the loop produced anything. You cannot
ask afterwards — the rows have already been sent.

---

## THE TASK

```sql
create or replace function q22(_course text) returns setof text
```

List a course's timetable, one class per line.

- no such course → a single line `No such course`
- otherwise one line per class, ordered by day (week order) then start time then
  room name:

```
DAY S-E CTYPE in ROOM (N seats)
```

```
psql -At -c "select * from q22('COMP1927');"
Wed 13-15 Lecture in D23-304 (200 seats)
...
```

There is no `Courses` table — a course exists only because some class mentions
it. So "no such course" means the query found nothing.

## Hints

<details><summary>Hint 1</summary>

You need the counter, because the "no such course" test is *"the loop produced
nothing"*.
</details>

<details><summary>Hint 2</summary>

Join `Classes` to `Rooms` (module 10) to get the room's name and capacity.
</details>

<details><summary>Hint 3</summary>

`order by day_of_week, start_time, room name` — the enum gives week order free
(module 06).
</details>
