# Module 19

```sql
begin
    if _capacity is null then
        return 'unknown';
    elsif _capacity < 30 then
        return 'small';
    elsif _capacity < 100 then
        return 'medium';
    else
        return 'large';
    end if;
end;
```

### The null test has to come first

This is the point of the question. If you write

```sql
if _capacity < 30 then return 'small';
elsif _capacity < 100 then return 'medium';
else return 'large';           -- a null lands HERE
end if;
```

then a null fails both comparisons — they are *unknown*, not false (module 05) —
and falls through to `else`, so a missing capacity is reported as `large`. No
error, just a wrong answer, which is the hardest kind to notice.

### The branches are cumulative

`elsif _capacity < 100` does not need `and _capacity >= 30`. If execution
reached that branch, the earlier one was already false, so we know the capacity
is at least 30. Conditions in an if-chain narrow as you go down.

### `elsif`

Not `elseif`, not `elif`. PLpgSQL is old-fashioned and particular, and the error
message when you get it wrong is unhelpful. Worth memorising.

### No `declare`

There are no local variables, so the word is omitted entirely. Writing `declare`
with nothing after it is a syntax error — leave it out.

### Using it

```sql
select q19(20), q19(30), q19(400), q19(null);

select name, capacity, q19(capacity) from Rooms order by capacity limit 8;

select q19(capacity), count(*) from Rooms group by q19(capacity);
```

That last one is the real payoff: a fiddly piece of logic, written once, now
usable anywhere a value can go — including in a `group by`. Compare it with
module 18, where the same banding had to be spelled out three times inside the
query.
