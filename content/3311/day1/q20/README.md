# Module 20 &nbsp;·&nbsp; PLpgSQL

## Getting data out of the database into a variable


## LEARN FIRST

Module 19's function only looked at its argument. Usually you want to look
something **up**.

### You cannot assign a query result with `:=`

```sql
x := select count(*) from Rooms;      -- WRONG. This is not Python.
```

PLpgSQL has its own spelling — the `into` goes **between the select list and the
`from`**:

```sql
select count(*) into x from Rooms;
```

That reads oddly at first and then becomes automatic.

### Several values at once

```sql
declare
    nm  text;
    cap integer;
begin
    select name, capacity into nm, cap
    from   Rooms where id = _room;
```

The number and types of the variables must match the selected expressions,
position by position.

### A whole row at once

```sql
declare
    r Rooms;                      -- a variable shaped like a Rooms row
begin
    select * into r from Rooms where id = _room;
    return r.name || ' seats ' || r.capacity;
```

**Any table name works as a type.** You then reach inside with `r.column`. One
query fills the whole thing, which is usually tidier than three variables.

### What if nothing matched?

This is the important part.

`select … into` does **not** raise an error when there is no matching row. It
quietly leaves the variables **null** and carries straight on. So you must
check:

```sql
select * into r from Rooms where id = _room;
if not found then
    return 'No such room';
end if;
```

`found` is a special boolean that PLpgSQL sets after every query. **Check it
every time you `select … into` something that might not exist.**

Without the check, module 05's rule takes over: `null || ' seats ' || null` is
null, so the function returns null rather than a message — and null prints as
nothing at all.

> Every past exam question of this kind has a "No such X" branch. This is how
> you write it.

### An aggregate always finds a row

Worth knowing, because it catches people:

```sql
select count(*) into n from Classes where held_in = _room;
```

An aggregate over **no rows** still returns one row — containing `0` for
`count`, and `null` for `min`, `max`, `sum` and `avg`. So `found` is always true
here, and testing it would be pointless. Test `n = 0` instead.

That is the same asymmetry module 12 met with `count` and `sum` after an outer
join.

### If several rows match

`select … into` takes the **first** row and ignores the rest, silently. If that
matters, add an `order by`, or narrow the condition.

### Assigning an ordinary value

`:=` is still how you set a plain variable:

```sql
hours := r.end_time - r.start_time;
```

---

## THE TASK

Write a function that reports on one room.

```sql
create or replace function q20(_room integer) returns text
```

- if there is no such room → `No such room`
- if the room exists but has no classes → `NAME (TYPE, N seats): no classes`
- otherwise → `NAME (TYPE, N seats): C classes, H hours`

where `C` is how many classes are held there and `H` is their total hours.

```
q20(1003)  ->  MECH-G15 (Computer Lab, 30 seats): 23 classes, 35 hours
q20(99999) ->  No such room
```

## Hints

<details><summary>Hint 1</summary>

Two stages: look the room up and check `found`; then count its classes.
</details>

<details><summary>Hint 2</summary>

A class's length is `end_time - start_time` (module 02); the total is `sum` of
that. Remember `sum` over no rows is null, not 0.
</details>

<details><summary>Hint 3</summary>

The class-count query is an aggregate, so `found` is always true — branch on
whether the count is 0.
</details>
