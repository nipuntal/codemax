# Module 12

```sql
select r.name, r.rtype, r.capacity,
       count(h.facility_id),
       coalesce(sum(h.nitems), 0)
from   Rooms r left join Has h on h.room_id = r.id
group  by r.id, r.name, r.rtype, r.capacity
order  by count(h.facility_id) desc, r.name
```

### `count(h.facility_id)`, not `count(*)`

A room with no facilities produces one row of nulls on the `Has` side.
`count(*)` sees a row and says 1; `count(h.facility_id)` sees a null and skips
it, giving 0.

As it happens **every** room in this database has at least one facility, so
today the two give the same answer. Write it correctly anyway — the exam's data
is not yours to assume, and this is precisely the check a question of this shape
is testing.

### `coalesce(sum(...), 0)`

`sum` over zero rows returns **null**, not 0. Without the `coalesce` an
unequipped room would show a blank rather than a zero, and the check would fail.

`count` needs no such protection: counting nothing genuinely is 0.

### `group by r.id, r.name, r.rtype, r.capacity`

Every non-aggregated column must be in the `group by` (module 08). Grouping by
`r.id` as well is deliberate: `id` is the primary key (module 00), so it
guarantees two different rooms never merge into one pile even if they somehow
shared a name.

**Group by the key, not just the display text.** It costs nothing and it is
always right.

### Why `Rooms` is on the left

`left join` keeps everything from the **left**. We want every room, so `Rooms`
goes first. Writing `Has h left join Rooms r` would keep every `Has` row instead
— which is not the question, and would silently lose rooms.

### Worth trying

```sql
-- see the trap for yourself
select r.name, count(*) as wrong, count(h.facility_id) as right
from Rooms r left join Has h on h.room_id = r.id
group by r.id, r.name order by right limit 5;

-- the "has no partner" idiom
select s.name from Students s left join Attends a on a.student_id = s.id
where a.student_id is null;                    -- the 11 students in nothing
```
