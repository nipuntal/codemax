# Module 16

```sql
select c.course, count(*), count(distinct c.held_in)
from   Classes c
where  not exists (
           select 1
           from   Classes c2 join Rooms m on c2.held_in = m.id
           where  c2.course = c.course and m.rtype <> 'Tutorial Room'
       )
group  by c.course
having count(*) >= 3
order  by c.course
```

### Turning "every" inside out

*Every class of this course is in a tutorial room*
becomes
*there is **no** class of this course in a room that is not a tutorial room.*

The inner query looks for a counterexample; `not exists` succeeds when it finds
none. That is the whole technique, and it applies to every "all"/"every"
question you will meet.

### Why no `except` here

The `except` recipe is for "has **all of** a set of things" — all the facilities,
all the events. This question is subtly different: it is "**every one of** its
own rows satisfies a property". That only needs a search for one bad row, which
is simpler.

Recognising which of the two shapes you have saves a lot of time:

- *"has every facility that room X has"* → the `except` recipe
- *"all of its classes are in tutorial rooms"* → a plain `not exists` counterexample

### `where` and `having` doing different jobs

- the `not exists` is in `where`, because it is a property of each individual
  class row (well — of its course, but it is evaluated per row)
- `count(*) >= 3` is in `having`, because it is a property of the whole pile

Module 09's distinction, still holding.

### `count(distinct c.held_in)`

A course teaches many classes in the same room, so counting rows would be the
wrong answer to "how many rooms". The same trap as modules 08 and 11.

### A shortcut that also works

Because we only care about this course's own classes, the counting form is
neat here:

```sql
select course, count(*), count(distinct held_in)
from   Classes c join Rooms m on c.held_in = m.id
group  by course
having count(*) >= 3
   and count(*) = count(*) filter (where m.rtype = 'Tutorial Room');
```

*The number of classes in tutorial rooms equals the total number of classes.*
Some find that clearer. Both are accepted.

### Worth trying

```sql
-- the counterexample search on its own, for one course
select c2.course, m.name, m.rtype
from Classes c2 join Rooms m on c2.held_in=m.id
where c2.course='COMP1927' and m.rtype <> 'Tutorial Room';

-- and the backwards except, to see it return everything
select count(*) from Classes c where not exists (
  (select held_in from Classes where course=c.course)
  except
  (select id from Rooms where rtype='Tutorial Room'));
```
