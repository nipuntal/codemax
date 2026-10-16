# Module 22

### Why the counter is needed here

There is no `Courses` table, so "does this course exist?" cannot be answered by
a `select … into` and `if not found` the way module 20 checked a room. The only
evidence is whether any class mentions it — that is, whether the loop ran.

Hence `n`, incremented inside the loop and tested afterwards.

**Look at the schema and ask what "does not exist" actually means** before
writing the branch. Sometimes it is `if not found`; sometimes it is a count.

### The aliases in the query

```sql
select c.day_of_week as d, c.start_time as s, ...
```

`record` takes its shape from the query, and you reach into it with the column
names the query produced. Giving short aliases keeps the `return next` line
readable — otherwise it would be `t.day_of_week || ' ' || t.start_time || ...`.

This also avoids a real trap: the query selects `r.name`, and without an alias
the record's field would be `name`, which is fine — but if you also selected
`c.course`, two columns could end up with clashing names. Aliasing everything
removes the question.

### `return next` in a loop

Each pass appends one line. Nothing is sent to the caller until the function
finishes, so the counter is still meaningful afterwards.

### Could this have been `return query`?

Almost. The formatting is one expression, so:

```sql
return query
    select c.day_of_week || ' ' || c.start_time || '-' || ... 
    from Classes c join Rooms r on c.held_in = r.id
    where c.course = _course
    order by c.day_of_week, c.start_time, r.name;
```

would produce the same lines. But you would still need to know whether anything
came back, to decide about `No such course` — which means either a separate
`count(*)` query or `get diagnostics n = row_count;` after it.

The loop keeps the counting and the formatting in one place, which is why it is
written this way.

### Using it

```sql
select * from q22('COMP1927');
select * from q22('COMP9999');
select count(*) from q22('COMP1911');
```

That last one shows the point of `setof`: the result behaves like a table, so
you can count it, filter it, or join to it.
