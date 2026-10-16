# Module 10

```sql
select c.course, c.ctype, c.day_of_week,
       c.start_time || '-' || c.end_time,
       r.name, r.rtype, r.capacity
from   Classes c join Rooms r on c.held_in = r.id
where  r.rtype = 'Computer Lab'
order  by c.day_of_week, c.start_time, r.name
```

### Which side each column came from

- `course`, `ctype`, `day_of_week`, the times — from `Classes` (`c`)
- `name`, `rtype`, `capacity` — from `Rooms` (`r`)

Once the rows are glued together you pick freely from either side. That is the
whole point of joining.

### `on` and `where` doing separate jobs

```sql
on    c.held_in = r.id        -- how the tables line up
where r.rtype = 'Computer Lab' -- which of the glued rows we want
```

You *could* write both conditions in a `where` with the older comma syntax:

```sql
from  Classes c, Rooms r
where c.held_in = r.id and r.rtype = 'Computer Lab'
```

It gives the same answer and is still legal SQL. Prefer the `join ... on` form:
it keeps the matching rule next to the tables it matches, so a forgotten join
condition is obvious rather than hidden in a long `where`.

### Sorting on something not selected

`order by c.start_time` works even though the output shows `span` instead. The
sort happens on the joined rows, before `select` picks the columns — the running
order from module 08.

Sorting on `span` would actually be wrong: it is **text**, so `'9-11'` would sort
after `'11-13'`, the way `9` comes after `11` in a dictionary. Sorting on the
number keeps it in time order. That is a genuinely easy mistake to make.

### Counting the result

97 classes are held in computer labs. Compare that with `select count(*) from
Classes` — 514 — and with the nonsense figure a missing `on` would give:

```sql
select count(*) from Classes, Rooms;      -- 65792
```

Getting a feel for plausible row counts is one of the best debugging instincts
you can build.

### Worth trying

```sql
-- the same join, then look at what one glued row contains
select * from Classes c join Rooms r on c.held_in = r.id limit 1;

-- follow a different foreign key
select s.name, a.class_id from Students s join Attends a on s.id = a.student_id limit 5;
```
