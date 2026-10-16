# Question 21

```sql
create view q21equipped(room) as
select h.room_id from Has h join Facilities f on h.facility_id = f.id
where  f.name = 'Video data projector';

select c.course, count(*), count(distinct c.held_in)
from   Classes c
group  by c.course
having count(*) = count(*) filter (where c.held_in in (select room from q21equipped))
order  by c.course
```

### Two ways to say "for all"

**The counting way**, used above: a course qualifies when *the number of its
classes that are equipped* equals *the number of its classes*. `count(*) filter
(where ...)` counts only the matching rows within the same group, so both
numbers come from one pass.

The portable spelling of `filter` is `count(case when ... then 1 end)` — a
`case` with no `else` yields null, and `count` skips nulls.

**The double-negative way**, which the course teaches:

```sql
select c.course, count(*), count(distinct c.held_in)
from   Classes c
where  not exists (
          select 1 from Classes c2
          where  c2.course = c.course
            and  c2.held_in not in (select room from q21equipped)
       )
group  by c.course
order  by c.course;
```

*There is no class of this course held in an unequipped room.* Same answer.

**The `except` way**, which is the one the lecture notes use:

```sql
where not exists (
    (select held_in from Classes where course = c.course)
    except
    (select room from q21equipped)
)
```

*The rooms this course uses, minus the equipped rooms, is empty.* Getting the
`except` the right way round is the whole trick — `required except owned` finds
what's **missing**; the reverse finds extras and always returns everyone.

All three are accepted. Learn at least two, because under exam pressure one of
them will come out right.

### Why a helper view

The set of equipped rooms is used twice (or, in the counting version, once but
inside a group). Naming it makes the main query readable and is explicitly
permitted — the exam says *"place any additional views used by q21 in this
file"*.

### `count(distinct c.held_in)`

A course may use the same room for several classes. "How many rooms" means
distinct rooms — the same trap as question 06.
