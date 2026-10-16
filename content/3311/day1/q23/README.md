# Module 23 &nbsp;·&nbsp; PLpgSQL

## When things go wrong, and when the query isn't known yet


## LEARN FIRST

Three tools for the awkward cases.

### `raise notice` — seeing inside

Module 21 introduced this. It is worth repeating because it is how you debug:

```sql
raise notice 'about to process room %', r.name;
raise notice 'n = %, total = %', n, total;
```

Sprinkle them freely while developing, remove them when it works.

### `raise exception` — stop and fail

```sql
if _amount <= 0 then
    raise exception 'amount must be positive, got %', _amount;
end if;
```

This aborts the function **and undoes everything it had already changed**.

That is a feature. It means you can never leave the database half-updated: either
the whole operation happened, or none of it did.

> **Theory pointer.** That all-or-nothing behaviour is called **atomicity**, and
> it is the "A" of ACID — the four promises a database makes about a unit of
> work. Theory module 38 covers it. The short version: a transaction either
> completes fully or is rolled back completely, so a crash halfway through
> cannot leave a mess.

### Catching an error

```sql
begin
    ... something risky ...
exception
    when division_by_zero then
        return 'cannot divide by zero';
    when others then
        return 'something went wrong';
end;
```

The `exception` section goes at the **end** of a `begin … end` block, just
before `end;`, and catches anything raised inside it. `when others` catches
everything.

Use it sparingly — usually you *want* the failure to propagate.

### Dynamic SQL — building a query as text

Sometimes the **table or column name** is not known until the function runs. You
cannot write that as a parameter:

```sql
select * from _tablename;      -- WRONG: looks for a table called "_tablename"
```

A parameter can stand in for a **value**, never for a **name**. So you build the
query as a string and `execute` it:

```sql
create or replace function nrows(_table text) returns integer
as $$
declare
    n integer;
begin
    execute 'select count(*) from ' || quote_ident(lower(_table)) into n;
    return n;
end;
$$ language plpgsql;
```

Three forms:

```sql
execute 'update ...';                        -- no result wanted
execute 'select count(*) from R' into n;     -- one result
for t in execute 'select * from ' || tbl loop … end loop;   -- many results
```

### Quoting, and the case trap

- `quote_ident(x)` — for **names** of tables and columns
- `quote_literal(x)` — for **values**; adds quotes and escapes apostrophes

```sql
qry := 'select * from ' || quote_ident('rooms') ||
       ' where name = ' || quote_literal('EE-417');
-- becomes:  select * from rooms where name = 'EE-417'
```

**The trap:** when you write `create table Rooms (...)`, PostgreSQL **folds the
unquoted name to lower case** — the table is really called `rooms`. Unquoted
names in queries are folded the same way, which is why `select * from Rooms`
works.

But `quote_ident('Rooms')` produces `"Rooms"` **with quotes**, and a quoted name
is taken literally, capitals and all. There is no table called `"Rooms"`, so it
fails.

```sql
select quote_ident('Rooms');   -- "Rooms"   <- quoted, case-sensitive, no match
select quote_ident('rooms');   -- rooms     <- bare, matches
```

Hence `quote_ident(lower(_table))` above.

### When *not* to use dynamic SQL

Only when a **name** varies. If only a **value** varies, an ordinary query is
simpler, safer and faster:

```sql
select count(*) into n from Classes where held_in = _room;   -- no execute needed
```

Gluing user text straight into a query without `quote_ident`/`quote_literal` is
how databases get broken into. Reach for `execute` only when you must.

---

## THE TASK

```sql
create or replace function q23(_table text) returns integer
```

Count the rows in any of our tables.

- if the table exists, return how many rows it has
- if it does not exist, return `-1` — do not let the error escape

```
q23('Rooms')    ->  128
q23('Attends')  ->  18917
q23('Nonsense') ->  -1
```

## Hints

<details><summary>Hint 1</summary>

The table name is not known until the function runs, so this genuinely needs
`execute … into`.
</details>

<details><summary>Hint 2</summary>

Wrap it so the error becomes `-1`: an `exception when others then return -1;`
section before `end;`.
</details>

<details><summary>Hint 3</summary>

Remember the case trap — `quote_ident(lower(_table))`.
</details>
