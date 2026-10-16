# Module 19 &nbsp;·&nbsp; PLpgSQL

## Teaching the database a new word


## LEARN FIRST

Everything so far has been a single query. Sometimes that is not enough.

Suppose you want: *given a number of minutes, describe it as short, normal or
long — and say "unknown" if no number is supplied.* A query cannot take an
argument, and it cannot make a decision and stop.

A **stored function** can. You write it once, it lives in the database, and
afterwards you use it like any built-in.

### The general shape

```sql
create or replace function
    fname(arg1 type, arg2 type) returns rettype
as $$
   ... the body ...
$$ language plpgsql;
```

Two oddities:

- `$$ … $$` is just an unusual pair of quotes. The whole body is handed to
  PostgreSQL as a **string**, and `$$` saves you escaping every apostrophe
  inside it.
- `language plpgsql` says which language the body is written in.

### The easy kind: a body that is one query

If the body is a single `select`, the language can be plain `sql`:

```sql
create or replace function
    seats(_room integer) returns integer
as $$
select capacity from Rooms where id = _room;
$$ language sql;
```

Use it exactly like a built-in:

```sql
select seats(1003);
select name, seats(id) from Rooms limit 5;
```

The value returned is the **first value of the last `select`** in the body.

### The real kind: PLpgSQL

When you need decisions or variables, the body is written in PLpgSQL:

```sql
create or replace function
    band(_n integer) returns text
as $$
declare
   limit_small integer := 30;      -- a variable, with a starting value
begin
   if _n is null then
      return 'unknown';
   elsif _n < limit_small then
      return 'small';
   else
      return 'big';
   end if;
end;
$$ language plpgsql;
```

The anatomy, every single time:

```
declare      -- local variables. Leave this word out entirely if you have none.
   ...
begin        -- the code
   ...
end;
```

Details that trip people up:

- **`:=` assigns.** A single `=` is comparison.
- Every statement ends with `;` — including `end;`.
- `if` blocks close with `end if;`.
- It is **`elsif`**. Not `elseif`, not `elif`.

### Test the null first

Notice `if _n is null` comes **before** the comparisons. Module 05 explained
why: `null < 30` is *unknown*, not false, so a null would fall past every
comparison and land in the `else`, quietly coming out as `'big'`.

**Whenever an argument can be null, handle null first and explicitly.**

### Naming your parameters

```sql
create or replace function f(_name text) ...
```

The leading underscore is a course convention, and it matters. If a parameter
were called `name` and a table also has a column called `name`, then inside a
query `where name = name` is comparing the column with itself — always true —
and you would get every row. `_name` can never collide.

### Seeing and removing your functions

```
\df                       -- list the functions you have defined
\df+ band                 -- show one, including its body
```

```sql
drop function if exists band(integer);
```

You must give the **parameter types**, because several functions can share a
name with different parameters. And you need the `drop` before changing a
function's return type — `create or replace` refuses to change that.

---

## THE TASK

Write a function that describes a room's size.

```sql
create or replace function q19(_capacity integer) returns text
```

Given a capacity, return:

| condition | return |
|---|---|
| the capacity is null | `unknown` |
| under 30 | `small` |
| 30 to 99 | `medium` |
| 100 or more | `large` |

```
q19(20)   -> small
q19(30)   -> medium
q19(400)  -> large
q19(null) -> unknown
```

## Hints

<details><summary>Hint 1</summary>

`if … then … elsif … then … else … end if;`, with a `return` in each branch. No
`declare` section is needed at all.
</details>

<details><summary>Hint 2</summary>

Test the null **first**, for the reason in the LEARN FIRST section.
</details>

<details><summary>Hint 3</summary>

The bands are the same ones as module 18 — reuse those boundaries.
</details>
