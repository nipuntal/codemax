# Module 04

```sql
select name, rtype, capacity
from   Rooms
where  name like 'EE-%'
```

### Why the `%` goes only on the right

`'EE-%'` means: the letters `E`, `E`, `-`, then anything at all. That is exactly
"begins with `EE-`".

`'%EE-%'` would mean "contains `EE-` somewhere", which also matches a room named
`CHEE-1`. There is no such room today, but the question said *begins with*, and
writing the condition you were asked for is the habit that keeps you right when
the data changes.

### The regular-expression version

```sql
where name ~ '^EE-'
```

Equally correct. `^` pins the match to the start. Without it, `~ 'EE-'` would
match anywhere and behave like `'%EE-%'`.

Use whichever you find clearer. `like` is simpler for "starts with" and "ends
with"; regular expressions win once you need alternatives or character classes.

### The `-` needs no escaping

Inside a regular expression, `-` is only special **inside square brackets**
(where it makes ranges, like `[0-9]`). On its own it is an ordinary character,
so `'^EE-'` is fine.

### Worth trying

```sql
select name from Rooms where name like 'EE-%';       -- 22 rooms
select name from Rooms where name like '%EE%';       -- more -- why?
select split_part(name,'-',1) from Rooms limit 10;   -- building codes
select name from Rooms where name not like '%-%';    -- the three with no dash
```

That last one is worth seeing, because it is the sort of odd row that breaks a
careless answer later.
