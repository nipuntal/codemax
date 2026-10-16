# Question 05

```sql
declare
    r Rooms;
begin
    select * into r from Rooms where id = _id;
    if not found then
        return 'No such room';
    end if;
    return r.name || ' (' || r.rtype || ', capacity ' || r.capacity || ')';
end;
```

### `if not found` is the whole question

`select ... into` does **not** raise an error when nothing matches — it leaves
`r` null and carries straight on. Without the check, `q05(99999)` would try to
concatenate nulls and return **null**, not the words `No such room`.

Every past-paper PLpgSQL question has a "No such X" branch. This is how you
write it, every time.

### `r Rooms` — a whole row in one variable

Declaring a variable with a **table name as its type** gives you a record shaped
like that table. One query fills it and `r.name`, `r.rtype`, `r.capacity` reach
inside.

The alternative is three variables and `select name, rtype, capacity into a,b,c`
— equally correct, more typing.

### Concatenating an enum

`|| r.rtype ||` just works: PostgreSQL casts the enum to text for you. Same for
the integer `capacity`. If a concatenation ever complains, add `::text`.

### The `drop function` line

```sql
drop function if exists q05(integer);
```

You must give the **parameter types**, because functions can be overloaded. And
you need the drop because `create or replace` refuses to change a function's
return type.
