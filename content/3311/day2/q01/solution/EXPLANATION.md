# Question 01

```sql
select rtype, count(*), min(capacity), max(capacity)
from   Rooms group by rtype order by rtype
```

Nothing subtle here — it exists so you see the data before the questions get
hard. Two things worth noticing for later:

**The ordering lives in the view.** The real exam says outright: *"The view must
order the tuples appropriately; the test will not use order by."* Get in the
habit now.

**`rtype` is an enum**, not text. `order by rtype` sorts by the **declaration
order** in `create type RoomType as enum (...)`, not alphabetically — which here
happens to give Lecture Theatre before Tutorial Room. If a question wants
alphabetical order you need `order by rtype::text`.

Try it and see:

```sql
select rtype from Rooms group by rtype order by rtype;
select rtype from Rooms group by rtype order by rtype::text;
```

That distinction has cost people marks.
