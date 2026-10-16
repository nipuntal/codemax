# Module 05

```sql
select name,
       coalesce(name, 'unknown')
       || ' (' || coalesce(rtype::text, 'unknown')
       || ', seats ' || coalesce(capacity::text, '0') || ')'
from   Rooms
```

### Why bother, when this table has no nulls?

Because the habit is what you need, not the result. The moment you combine
tables, nulls appear in results that were not in any table. Writing
null-safe text now means you are not surprised then.

And the reason it matters is the spreading rule: if `rtype` were null, then

```sql
name || ' (' || rtype || ')'
```

would be **null for the whole row** — you would lose the name too, not just the
type. One missing piece wipes out the entire label.

### The casts are not optional

```sql
coalesce(rtype, 'unknown')          -- ERROR: enum vs text
coalesce(rtype::text, 'unknown')    -- fine
coalesce(capacity, '0')             -- ERROR: number vs text
coalesce(capacity::text, '0')       -- fine
```

`coalesce` returns one value, so everything you hand it must be the same kind of
thing. `name` needs no cast because it is already text.

Note that `coalesce(capacity, 0)` — with a **number** zero — would also be
legal, and would then be turned into text by the `||`. Both work. The version
above keeps everything as text throughout, which is easier to reason about.

### Reading a long `||` chain

Breaking it across lines with the `||` at the start of each line makes the
structure visible:

```
coalesce(...)
|| ' ('  || coalesce(...)
|| ', seats ' || coalesce(...) || ')'
```

You can see the literal text pieces — `' ('`, `', seats '`, `')'` — sitting
between the values. Getting a space wrong here is the most likely way to fail a
test, so lay it out where you can count them.

### Worth trying

```sql
select 'a' || null || 'b';                    -- null, not 'ab'
select coalesce(null, null, 'third');         -- third
select coalesce(null::text, 'unknown');       -- unknown
select null = null, null is null;             -- null, t
```
