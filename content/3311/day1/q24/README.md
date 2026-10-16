# Module 24 &nbsp;·&nbsp; PLpgSQL

## A full exam-style function


## THIS ONE IS EXAM-SHAPED

No new syntax. This is question 3 of a COMP3311 final: *"write a PLpgSQL
function"*, worth around 6 marks, with about 25 minutes to do it.

Read the whole thing before typing. Everything you need is in modules 00–23.

---

## THE TASK

```sql
create or replace function q24(_room integer) returns setof text
```

A report on one room's week.

- no such room → a single line `No such room`
- the room exists but has no classes → a single line
  `NAME (TYPE, N seats): no classes`
- otherwise:
  1. first a header line: `NAME (TYPE, N seats)`
  2. then one line per **day that has classes**, in week order:
     `  DAY: C classes, H hours` — two spaces at the front
  3. then a final line: `  Total: C classes, H hours` — two spaces at the front

```
psql -At -c "select * from q24(1003);"
MECH-G15 (Computer Lab, 30 seats)
  Mon: 5 classes, 8 hours
  Tue: 7 classes, 10 hours
  ...
  Total: 23 classes, 35 hours
```

## How to attack it

<details><summary>Step 1 — the room, and the two easy exits</summary>

`select * into r from Rooms where id = _room;` then `if not found`. Module 20.

Remember the `return;` after `return next 'No such room';` — module 22 explains
why leaving it out is the classic bug here.
</details>

<details><summary>Step 2 — is it empty?</summary>

A `select count(*) into n from Classes where held_in = _room;` before you start
looping. If `n = 0`, emit the "no classes" line and `return;`.

Note this is an aggregate, so `found` is always true — test the count itself
(module 20).
</details>

<details><summary>Step 3 — the per-day lines</summary>

A loop over a grouped query:

```sql
for t in
    select day_of_week as d, count(*) as c, sum(end_time - start_time) as h
    from   Classes where held_in = _room
    group  by day_of_week
    order  by day_of_week
loop
```

Modules 08 and 09 built exactly this query; module 06 explains why ordering by
the enum gives week order.
</details>

<details><summary>Step 4 — the totals</summary>

You can add them up as you go, in two variables — or run a second query. Either
is fine. Adding up in the loop reuses numbers you already have.
</details>

## When you are done

```bash
./check
./check solution
cat solution/EXPLANATION.md
```

Then try it on a room you did not test with, and on a room id that does not
exist.
