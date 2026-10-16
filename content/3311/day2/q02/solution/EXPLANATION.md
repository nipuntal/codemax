# Question 02

```sql
select name, capacity from Rooms
where  rtype = 'Computer Lab'
order  by capacity desc, name
```

### The tie-break is doing real work

Seven of the ten labs have capacity 30 and three have 20. Without `, name` the
order among the sevens is whatever PostgreSQL feels like, and the check — which
compares text exactly — would pass or fail at random.

**Any time you sort on something with duplicates, add a tie-break.** In this
database that is nearly always true, so make it reflexive.

### Comparing an enum

`rtype = 'Computer Lab'` works because PostgreSQL coerces the string literal to
the enum type. If you misspell it you get a helpful error rather than an empty
result:

```
ERROR: invalid input value for enum roomtype: "Computer lab"
```

That's a nice property — unlike a typo in a `text` column, which silently
returns nothing.
