# Module 23

```sql
begin
    execute 'select count(*) from ' || quote_ident(lower(_table)) into n;
    return n;
exception
    when others then
        return -1;
end;
```

### Why `execute` is genuinely needed

A parameter can stand in for a **value**, never for a **name**. Writing
`select count(*) from _table` would look for a table literally called `_table`.
The only way to vary the table name is to build the SQL as text and run it.

Recognising *when* dynamic SQL is required — and, more often, when it is not —
is what this module tests. Ninety-nine times out of a hundred an ordinary query
with a parameter is the right answer.

### `lower()` is not optional

Without it, `q23('Rooms')` returns **-1**, and so does every other capitalised
name.

`quote_ident('Rooms')` produces `"Rooms"` with double quotes. A quoted name is
taken exactly as written, and the table is actually called `rooms`, because
PostgreSQL folded the name to lower case when it was created. So the `execute`
fails, the exception handler fires, and you get -1 for everything.

The symptom to recognise: a dynamic query that works when you type the name in
lower case and fails when you capitalise it.

### The `exception` section

It sits between the last statement and `end;`, and belongs to the enclosing
`begin … end` block. `when others` catches anything the `execute` raised —
including "there is no such table".

`others` is blunt: it hides genuine bugs as well as the case you meant to catch.
More careful:

```sql
exception
    when undefined_table then
        return -1;
```

Both are accepted; the specific one is better practice.

### Debugging your own version

```sql
raise notice 'about to run: %', 'select count(*) from ' || quote_ident(lower(_table));
```

Put that before the `execute` and you can see exactly what SQL you built. That
one habit will save you more time than anything else in this module.

### Using it

```sql
select q23('Rooms'), q23('rooms'), q23('Attends'), q23('Nonsense');
```
