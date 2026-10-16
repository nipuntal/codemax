# Question 04

```sql
select c.ctype, c.day_of_week, c.start_time, c.end_time, r.name
from   Classes c join Rooms r on c.held_in = r.id
where  c.course = 'COMP1927'
order  by c.day_of_week, c.start_time, r.name
```

### The enum ordering is a gift

`day_of_week` is `Weekday`, declared `('Mon','Tue','Wed','Thu','Fri')`. Ordering
by it gives the days **in week order**, because enums sort by declaration
position.

Had the column been `text`, `order by day_of_week` would give
Fri, Mon, Thu, Tue, Wed — alphabetical nonsense — and you'd need an ugly `case`
to fix it. Notice which columns in this schema are enums; it changes what
ordering means.

### `course` is `char(8)`

Not `text`. `char(n)` is blank-padded, so comparisons pad too — `course =
'COMP1927'` works fine. But watch out when you **concatenate**:

```sql
select course || '!' from Classes limit 1;    -- 'COMP1927!'  (8 chars, no padding visible)
```

Here the codes are exactly 8 characters so it never bites. On a `char(10)`
column it would.
