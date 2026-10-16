# Question 24

### The same overlap test, a different self-join

```sql
from Classes a join Classes b on a.held_in = b.held_in and a.id < b.id
where a.held_in = _room
  and a.day_of_week = b.day_of_week
  and a.start_time < b.end_time and b.start_time < a.end_time
```

Question 19 joined `Attends` to itself to find clashes in **one student's**
timetable. Here we join `Classes` to itself to find clashes in **one room's**
bookings. Same overlap arithmetic, different thing being paired.

Recognising that these are the same question wearing different clothes is most
of what makes the exam's harder queries tractable.

### `a.id < b.id` is needed here

The two classes are interchangeable — "these two overlap" is symmetric — so
without it you'd get every pair twice plus every class against itself. Compare
question 12, where the roles differed and `<` would have been wrong.

Note that `a.held_in = _room` only constrains `a`; `b` is pinned to the same
room by the join condition `a.held_in = b.held_in`. Adding `and b.held_in =
_room` would be harmless but redundant.

### The room name in the clean message

`ROOMNAME is never double-booked` needs the name, which is why we fetch the row
into `m Rooms` even though the timetable query works off the id alone. One
`select ... into` serves both the existence check and the message.

### Room 347 versus room 208

`EE-233C` (347) runs 20 classes and does have overlaps. `GOLDST-G01` (208) does
not. Both branches are reachable — always find real data for each branch before
you trust a solution.

### A thought for the theory paper

77 pairs of classes in this database are double-booked. No constraint in the
schema prevents it: you cannot express *"no two classes in the same room may
overlap"* as a table constraint, because it is a statement about **other rows**.
It needs an assertion — which PostgreSQL does not implement — or a trigger.
That's exactly the argument from the theory lab's modules 33 and 34.
