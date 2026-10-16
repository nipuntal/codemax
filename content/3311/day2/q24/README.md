# Question 24 &nbsp;·&nbsp; PLpgSQL &nbsp;·&nbsp; ★★★★☆

## Is this room double-booked?


```
create or replace function q24(_room integer) returns setof text
```

Report every pair of classes in this room that overlap in time on the same day.

- no such room → `No such room`
- no overlaps → `ROOMNAME is never double-booked`
- otherwise one line per pair:
  `DAY S1-E1 COURSE1 overlaps S2-E2 COURSE2`

Order by day, then the first start time, then the second. Each pair once.

> **Tests:** the same overlap logic as question 19, but between classes rather
> than between one student's enrolments — and the room's name is needed for the
> "clean" message.

<details><summary>Hint</summary>

`Classes a join Classes b on a.held_in = b.held_in and a.id < b.id` plus the day
and overlap conditions.
</details>
