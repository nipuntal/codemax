# Question 10

### `returns setof text` — the exam's favourite shape

Both past papers' PLpgSQL questions return `setof text`: a list of formatted
lines, with special single-line answers for the edge cases. Learn this skeleton:

```sql
create or replace function qN(...) returns setof text
as $$
declare r record; n integer := 0;
begin
    -- (optionally) check the thing exists, return next 'No such X'; return;
    for r in <the query> loop
        n := n + 1;
        return next <a formatted line>;
    end loop;
    if n = 0 then return next 'Nothing to report'; end if;
    return;
end;
$$ language plpgsql;
```

### `return next` versus `return query`

`return next EXPR` appends **one** value. `return query SELECT ...` appends a
whole query's worth at once, and would work here too:

```sql
return query
    select c.day_of_week || ' ' || c.start_time || '-' || ... 
    from Classes c join Rooms m on c.held_in = m.id
    where c.course = _course
    order by ...;
```

That's shorter — but then you still need to know whether anything came back.
`get diagnostics n = row_count;` after it, or a separate `count(*)`. The
counter-in-a-loop version keeps it all in one place, which is why it's written
that way here.

### The bare `return;`

Signals "no more rows". Optional in most cases, but explicit and harmless.

### Why `record` and not a table type

The query selects columns from **two** tables plus computed aliases, so no
single table's row type fits. `record` takes its shape from the query at
runtime — that's exactly what it's for.
