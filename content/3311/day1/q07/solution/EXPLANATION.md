# Module 07

```sql
select count(*), count(distinct rtype), min(capacity), max(capacity),
       sum(capacity), round(avg(capacity), 1)
from   Rooms
```

### Six aggregates, one row

Because every selected item is an aggregate, the whole table collapses to a
single row and there is no ambiguity about what else to show. That is the rule
from the LEARN FIRST section, satisfied.

### `count(*)` versus `count(distinct rtype)`

- `count(*)` = 128 rooms
- `count(distinct rtype)` = 4 — the four kinds from module 00: Lecture Theatre,
  Tutorial Room, Computer Lab, Meeting Room

Same table, same rows, two completely different questions. Getting `distinct`
right is most of what aggregate questions test.

### The average, and why `round`

`avg(capacity)` comes back as `50.0000000000000000`. The task asked for one
decimal place, and the check compares characters, so `50.0000000000000000` and
`50.0` are different answers.

`round(avg(capacity), 1)` produces exactly `50.0`.

### A detail worth noticing

The average room capacity is 50, but the *biggest* room seats 400 and the
smallest 20. A single average hides a lot — 99 of the 128 rooms are tutorial
rooms seating 20–185, and a handful of lecture theatres pull the top end up.

Whenever an aggregate answer looks surprising, look at the spread before
trusting it. `min` and `max` alongside `avg` is a good habit for exactly this
reason.

### Worth trying

```sql
select count(*), count(distinct rtype), count(distinct capacity) from Rooms;
select min(start_time), max(end_time) from Classes;
select count(*) from Attends;                 -- 18917
select count(distinct student_id) from Attends;  -- fewer -- why?
```

That last pair is the `count` vs `count(distinct)` distinction doing real work:
18,917 enrolment rows, but far fewer students, because most students attend
several classes.
