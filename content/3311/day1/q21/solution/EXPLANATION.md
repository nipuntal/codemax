# Module 21

### The filtering is in the query, not the loop

```sql
for t in
    select course, start_time, end_time
    from   Classes
    where  held_in = _room and day_of_week::text = _day
    order  by start_time, course
loop
```

Everything selective happens in SQL: both conditions and the ordering. The loop
body does nothing but glue text together.

Compare the version this module warns against:

```sql
for t in select * from Classes loop
    if t.held_in = _room and t.day_of_week::text = _day then …
```

That reads all 514 classes instead of the handful you want. It is the most
commonly criticised pattern in PLpgSQL.

### The comma problem

Starting from `out := ''` and always appending `', ' || piece` would give a
leading comma: `, COMP1000 9-11, ...`. The `if out = ''` test handles the first
item differently.

An alternative is to always append and strip the first two characters at the
end with `substr(out, 3)`. Both work; the `if` is easier to read.

### Two different empty results, one test

After the loop, `out` is still `''` in two situations — the room has no classes
at all, or none on that day. The task treats them the same, so one test covers
both. Note this is quite separate from the `if not found` check on the room
itself, which happens before the loop.

### Comparing text with an enum

```sql
day_of_week::text = _day
```

`_day` is declared `text`; `day_of_week` is the `Weekday` enum (module 00).
Converting the column to text lets them be compared.

The other direction — `day_of_week = _day::Weekday` — also works and is faster,
but it **raises an error** if `_day` is not a real weekday. `q21(1003,'Sunday')`
would abort rather than politely reporting nothing. The version above quietly
finds no rows, which then produces the friendly `nothing on Sunday` message.

Which you want depends on the question. When it does not say, the forgiving one
is safer.

### Using it

```sql
select q21(1003,'Thu'), q21(208,'Fri'), q21(99999,'Mon');
select id, q21(id,'Mon') from Rooms order by id limit 5;
```
