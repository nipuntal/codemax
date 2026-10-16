# Question 12

```sql
from Classes a
     join Classes b on a.held_in     = b.held_in
                   and a.day_of_week = b.day_of_week
                   and a.end_time    = b.start_time
     join Rooms m on a.held_in = m.id
where m.rtype = 'Computer Lab'
```

### Two aliases, two roles

`a` is the class that finishes; `b` is the one that starts. They come from the
same table, so they need different names — without aliases PostgreSQL cannot
tell which `end_time` you mean.

### Why there's no `a.id < b.id` here

Question 12 in day 1 used `a.id < b.id` to avoid listing each *pair* twice. That
trick applies when the two sides are interchangeable — "two events on the same
date".

Here they are **not** interchangeable: one class ends where the other begins.
`a.end_time = b.start_time` already fixes which is which, and adding
`a.id < b.id` would wrongly discard half the genuine back-to-back pairs.

**Ask whether the two sides mean the same thing.** If yes, you need the `<`. If
no, you don't.

### It also can't match a class with itself

A class would need `end_time = start_time`, and the schema's checks force
`start_time` between 9 and 20 and `end_time` between 10 and 21, with every class
lasting at least an hour. So no self-pairing is possible and no `a.id <> b.id`
is needed — though adding it would be harmless and defensive.
